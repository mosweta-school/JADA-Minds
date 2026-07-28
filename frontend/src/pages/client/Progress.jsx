import { useState } from "react";
import { Card, Progress as ProgressBar, Badge, EmptyState, Chip } from "../../components/ui";
import { emptyStateMessages } from "../../data/messages";

const assessmentHistory = [
  {
    id: "a1",
    date: "2026-07-20",
    score: 72,
    category: "Overall",
    trends: ["Energy improving", "Support growing", "Great momentum"],
  },
  {
    id: "a2",
    date: "2026-07-15",
    score: 65,
    category: "Overall",
    trends: ["Stress decreasing", "Sleep improving"],
  },
  {
    id: "a3",
    date: "2026-07-10",
    score: 58,
    category: "Overall",
    trends: ["Starting journey", "Setting goals"],
  },
];

const progressData = [
  { label: "Energy", value: 75, color: "#ffa733" },
  { label: "Mood", value: 80, color: "#6b3cb8" },
  { label: "Sleep", value: 68, color: "#20c997" },
  { label: "Stress", value: 55, color: "#e74c3c" },
  { label: "Social", value: 70, color: "#2980b9" },
  { label: "Nutrition", value: 82, color: "#f0c040" },
];

export default function Progress() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const latestScore = assessmentHistory[0]?.score || 0;
  const previousScore = assessmentHistory[1]?.score || 0;
  const trend = latestScore >= previousScore ? "up" : "down";
  const trendEmoji = trend === "up" ? "Trending up" : trend === "down" ? "Needs attention" : "Stable";

  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Progress tracking</span>
        <h2 className="page-title">Your wellness journey at a glance.</h2>
        <p className="page-subtitle">
          Track your progress over time with assessment history, wellness trends, and personalized insights.
        </p>
      </section>

      <section>
        <div className="stat-grid">
          <div className="panel" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "#6b3cb8", marginTop: "0.3rem" }}>{latestScore}</h3>
            <p style={{ fontSize: "0.85rem" }}>Latest Score</p>
            <Badge variant="success" style={{ marginTop: "0.4rem" }}>{trendEmoji} {trend === "up" ? "Trending up" : trend === "down" ? "Needs attention" : "Stable"}</Badge>
          </div>
          <div className="panel" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "#6b3cb8", marginTop: "0.3rem" }}>{assessmentHistory.length}</h3>
            <p style={{ fontSize: "0.85rem" }}>Assessments Completed</p>
          </div>
          <div className="panel" style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "2rem", color: "#6b3cb8", marginTop: "0.3rem" }}>5</h3>
            <p style={{ fontSize: "0.85rem" }}>Day Streak</p>
          </div>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: "1rem", color: "#2d1b69" }}>Wellness Dimensions</h3>
        <div className="dashboard-grid">
          {progressData.map((dim) => (
            <div className="card" key={dim.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "700", color: "#2d1b69" }}>{dim.label}</span>
                <span style={{ fontWeight: "700", color: dim.color }}>{dim.value}%</span>
              </div>
              <ProgressBar value={dim.value} max={100} variant={dim.value >= 70 ? "success" : dim.value >= 50 ? "warning" : "danger"} label={`${dim.value}%`} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h3 style={{ color: "#2d1b69", margin: 0 }}>Assessment History</h3>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {["week", "month", "all"].map((period) => (
              <Chip key={period} active={selectedPeriod === period} onClick={() => setSelectedPeriod(period)}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Chip>
            ))}
          </div>
        </div>

        {assessmentHistory.length === 0 ? (
          <EmptyState {...emptyStateMessages.assessments} />
        ) : (
          assessmentHistory.map((entry) => (
            <Card key={entry.id} style={{ marginBottom: "1rem", borderTop: `4px solid ${entry.score >= 70 ? "#20c997" : entry.score >= 50 ? "#ffa733" : "#e74c3c"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                <div>
                  <h3 style={{ margin: "0.3rem 0" }}>Score: {entry.score}/100</h3>
                  <p style={{ fontSize: "0.85rem", color: "#6b5b95" }}>{entry.date}</p>
                </div>
                <div>
                  {entry.trends.map((trend, idx) => (
                    <span key={idx} className="badge badge-primary" style={{ marginRight: "0.3rem", marginBottom: "0.3rem" }}>{trend}</span>
                  ))}
                </div>
              </div>
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
