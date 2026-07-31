import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Button, Card, EmptyState } from "../../components/ui";
import { emptyStateMessages } from "../../data/messages";
import { getLatestResult, getProgress } from "../../api/progressApi";

// Static for now - Recommendation Generation (tying a wellness result
// to specific resources) isn't built on the backend yet. Swap this
// for a real fetch once that endpoint exists; don't fabricate one
// here in the meantime.
const recommendations = [
  ["Practice deep breathing", "Take a slow five-minute pause when stress builds."],
  ["Improve sleep", "Create a screen-free wind-down ritual tonight."],
  ["Stay active", "Enjoy a 20-minute walk or gentle movement."],
];

const TREND_LABELS = {
  improving: { text: "Trending up", variant: "success" },
  worsening: { text: "Needs attention", variant: "danger" },
  stable: { text: "Holding steady", variant: "primary" },
  not_enough_data: { text: "Not enough data yet", variant: "primary" },
};

function TrendChart({ scores }) {
  // Falls back to the original static illustration if there aren't
  // enough points yet for a meaningful line.
  if (!scores || scores.length < 2) {
    return (
      <div className="chart-wrap" aria-label="Wellness trend chart">
        <svg viewBox="0 0 320 190" role="img">
          <text x="10" y="95" fontSize="12" fill="#938ba8">
            Take a few more assessments to see your trend chart.
          </text>
        </svg>
      </div>
    );
  }

  const width = 320;
  const height = 190;
  const padding = 10;
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min || 1;

  const points = scores.map((score, i) => {
    const x = padding + (i * (width - padding * 2)) / (scores.length - 1);
    // Inverted: a lower stress score should plot higher on the chart.
    const y = padding + ((score - min) / range) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join(" ");
  const areaPath = `${linePath} L${points[points.length - 1][0]} ${height} L${points[0][0]} ${height} Z`;

  return (
    <div className="chart-wrap" aria-label="Wellness trend chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#29bd9a" />
            <stop offset="1" stopColor="#fff" />
          </linearGradient>
        </defs>
        {[30, 70, 110, 150].map((y) => (
          <line key={y} className="chart-grid" x1="0" x2={width} y1={y} y2={y} />
        ))}
        <path className="chart-area" d={areaPath} />
        <path className="chart-line" d={linePath} />
        {points.map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="3.5" fill="#29bd9a" />
        ))}
      </svg>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasNoResult, setHasNoResult] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getLatestResult().catch((err) => {
        if (err.response?.status === 404) {
          if (!cancelled) setHasNoResult(true);
          return null;
        }
        throw err;
      }),
      getProgress(),
    ])
      .then(([resultData, progressData]) => {
        if (cancelled) return;
        setResult(resultData);
        setProgress(progressData);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="page-shell">
        <p>Loading your results...</p>
      </div>
    );
  }

  if (hasNoResult || !result) {
    return (
      <div className="page-shell">
        <EmptyState {...emptyStateMessages.assessments} />
      </div>
    );
  }

  const trendInfo = TREND_LABELS[progress?.trend] || TREND_LABELS.not_enough_data;
  const categoryTrends = progress?.category_trends || {};
  const historyScores = (progress?.history || []).map((entry) => entry.total_score);

  return (
    <div className="page-shell design-page">
      <div className="design-heading">
        <div>
          <span className="design-kicker">Results & progress</span>
          <h2 className="page-title" style={{ fontSize: "1.55rem", marginTop: "0.2rem" }}>
            Your wellness summary
          </h2>
        </div>
        <Badge variant="success">Assessment complete</Badge>
      </div>

      <section className="results-layout">
        <Card className="score-panel">
          <span className="design-kicker">Your wellness level</span>
          {/*
            total_score is a raw point total against Low/Moderate/High
            Stress thresholds, not a percentage - showing it as "X%"
            (like the old mock data did) would misrepresent it. The
            wellness_level label is the honest headline here.
          */}
          <div className="score-number" style={{ fontSize: "1.75rem" }}>
            {result.wellness_level}
          </div>
          <p style={{ color: "#786f90", fontSize: "0.75rem", marginTop: "0.2rem" }}>
            Score: {result.total_score}
          </p>
          <Badge variant={trendInfo.variant}>{trendInfo.text}</Badge>
          <p style={{ color: "#786f90", fontSize: "0.8rem" }}>
            {trendInfo.text === "Trending up"
              ? "You are making progress. Keep it up!"
              : "Here's where things stand right now."}
          </p>
          {Object.entries(categoryTrends).map(([category, categoryTrend]) => {
            const info = TREND_LABELS[categoryTrend] || TREND_LABELS.not_enough_data;
            return (
              <div className="dimension-row" key={category}>
                <span style={{ textTransform: "capitalize" }}>{category}</span>
                <Badge variant={info.variant}>{info.text}</Badge>
              </div>
            );
          })}
          <div className="btn-row">
            <Button size="sm" style={{ width: "100%" }} onClick={() => navigate("/")}>
              Back to dashboard
            </Button>
          </div>
        </Card>

        <Card>
          <span className="design-kicker">Recommendations</span>
          <h3 style={{ margin: "0.35rem 0", color: "#3d3459" }}>Based on your results</h3>
          <div className="recommendation-list">
            {recommendations.map(([title, text]) => (
              <div className="recommendation-item" key={title}>
                <div>
                  <strong>{title}</strong>
                  <br />
                  {text}
                </div>
              </div>
            ))}
          </div>
          <div className="btn-row">
            <Button
              variant="outline"
              size="sm"
              style={{ width: "100%" }}
              onClick={() => navigate("/resources")}
            >
              View all recommendations
            </Button>
          </div>
        </Card>

        <Card>
          <div className="design-heading">
            <div>
              <span className="design-kicker">Progress chart</span>
              <h3 style={{ margin: "0.35rem 0", color: "#3d3459" }}>Wellness trend</h3>
            </div>
            <Badge variant="primary">
              {progress?.statistics?.total_assessments || 0} assessments
            </Badge>
          </div>
          <TrendChart scores={historyScores} />
        </Card>
      </section>
    </div>
  );
}