export default function NotFound() {
  return (
    <div className="page-shell" style={{ padding: "2rem", textAlign: "center" }}>
      <section className="empty-state">
        <h2 className="page-title">The page you requested is still being designed.</h2>
        <p className="page-subtitle">Please return to the dashboard to continue exploring the experience.</p>
        <div className="btn-row" style={{ justifyContent: "center" }}>
          <a className="link-button link-button-primary" href="/dashboard">Go to dashboard</a>
        </div>
      </section>
    </div>
  );
}
