import { useEffect, useState } from "react";
import { Card, Badge, EmptyState } from "../../components/ui";
import { emptyStateMessages } from "../../data/messages";
import { getProgress } from "../../api/progressApi";

// Trend labels the backend actually returns - keep this in sync with
// app/assessments/routes.py's get_progress() on the backend.
const TREND_LABELS = {
  improving: { text: "Trending up", variant: "success" },
  worsening: { text: "Needs attention", variant: "danger" },
  stable: { text: "Holding steady", variant: "primary" },
  not_enough_data: { text: "Take another assessment to see a trend", variant: "primary" },
};

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    getProgress()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load your progress right now. Please try again.");
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
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell">
        <p style={{ color: "#e74c3c" }}>{error}</p>
      </div>
    );
  }

  const { history, latest_wellness_level, trend, statistics, category_trends } = data;
  const trendInfo = TREND_LABELS[trend] || TREND_LABELS.not_enough_data;
  const latestScore = history.length > 0 ? history[history.length - 1].total_score : null;

  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Progress tracking</span>
        <h2 className="page-title">Your wellness journey at a glance.</h2>
        <p className="page-subtitle">
          Track your progress over time with assessment history, wellness trends, and personalized insights.
        </p>
      </section>

      {history.length === 0 ? (
        <EmptyState {...emptyStateMessages.progress} />
      ) : (
        <>
          <section>
            <div className="stat-grid">
              <div className="panel" style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "2rem", color: "#6b3cb8", marginTop: "0.3rem" }}>{latestScore}</h3>
                <p style={{ fontSize: "0.85rem" }}>Latest Score</p>
                <Badge variant={trendInfo.variant} style={{ marginTop: "0.4rem" }}>
                  {trendInfo.text}
                </Badge>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "2rem", color: "#6b3cb8", marginTop: "0.3rem" }}>
                  {statistics.total_assessments}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>Assessments Completed</p>
              </div>
              <div className="panel" style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "1.3rem", color: "#6b3cb8", marginTop: "0.3rem" }}>
                  {statistics.most_common_wellness_level}
                </h3>
                <p style={{ fontSize: "0.85rem" }}>Most Common Level</p>
              </div>
            </div>
          </section>

          {Object.keys(category_trends).length > 0 && (
            <section>
              <h3 style={{ marginBottom: "1rem", color: "#2d1b69" }}>Wellness Dimensions</h3>
              {/*
                The backend only returns a qualitative trend per category
                (improving/worsening/stable) - there's no 0-100 numeric
                score per dimension yet, so this shows trend badges
                instead of the progress-bar percentages the old mock
                data used. Wiring in real percentages would need a
                backend change first.
              */}
              <div className="dashboard-grid">
                {Object.entries(category_trends).map(([category, categoryTrend]) => {
                  const info = TREND_LABELS[categoryTrend] || TREND_LABELS.not_enough_data;
                  return (
                    <div className="card" key={category}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: "700", color: "#2d1b69", textTransform: "capitalize" }}>
                          {category}
                        </span>
                        <Badge variant={info.variant}>{info.text}</Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <h3 style={{ marginBottom: "1rem", color: "#2d1b69" }}>Assessment History</h3>
            {history
              .slice()
              .reverse()
              .map((entry) => (
                <Card
                  key={entry.id}
                  style={{
                    marginBottom: "1rem",
                    borderTop: `4px solid ${
                      entry.wellness_level === "Low Stress"
                        ? "#20c997"
                        : entry.wellness_level === "Moderate Stress"
                        ? "#ffa733"
                        : "#e74c3c"
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <h3 style={{ margin: "0.3rem 0" }}>Score: {entry.total_score}</h3>
                      <p style={{ fontSize: "0.85rem", color: "#6b5b95" }}>{formatDate(entry.created_at)}</p>
                    </div>
                    <Badge variant="primary">{entry.wellness_level}</Badge>
                  </div>
                </Card>
              ))}
          </section>
        </>
      )}
    </div>
  );
}