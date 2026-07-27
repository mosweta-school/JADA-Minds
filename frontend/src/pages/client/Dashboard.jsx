const stats = [
  { label: "Current streak", value: "5 days", emoji: "🔥" },
  { label: "Wellness score", value: "72/100", emoji: "✨" },
  { label: "Workshops joined", value: "2", emoji: "🎯" },
  { label: "Resources saved", value: "6", emoji: "📚" },
];

const quickActions = [
  { title: "Begin check-in", text: "Weekly reflection", icon: "📋", href: "/assessment" },
  { title: "Browse specialists", text: "Get support", icon: "👤", href: "/specialists" },
  { title: "Join a workshop", text: "Live sessions", icon: "🎓", href: "/workshops" },
];

export default function Dashboard() {
  return (
    <div className="app-shell">
      <section className="hero-card">
        <span className="eyebrow">✨ Welcome back</span>
        <h2 className="page-title">Your wellness journey continues.</h2>
        <p className="page-subtitle">
          Keep your momentum going with guided reflections, meaningful connections, and personalized support.
        </p>
      </section>

      <section className="stat-grid">
        {stats.map((item) => (
          <div className="panel" key={item.label}>
            <h3 style={{ fontSize: "2rem" }}>{item.emoji}</h3>
            <h3 style={{ fontSize: "1.5rem", marginTop: "0.3rem" }}>{item.value}</h3>
            <p style={{ fontSize: "0.9rem" }}>{item.label}</p>
          </div>
        ))}
      </section>

      <section className="dashboard-grid">
        <div>
          <h3>Quick actions</h3>
          <div className="resource-grid">
            {quickActions.map((action) => (
              <a href={action.href} className="card" key={action.title} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{action.icon}</div>
                <h3>{action.title}</h3>
                <p>{action.text}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>📈 Progress</h3>
          <div className="list-card" style={{ border: "none" }}>
            <p className="badge badge-success" style={{ marginBottom: "0.8rem" }}>Trending well</p>
            <ul style={{ fontSize: "0.95rem" }}>
              <li>Energy stable this week</li>
              <li>2 new workshops saved</li>
              <li>Keep going strong!</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
