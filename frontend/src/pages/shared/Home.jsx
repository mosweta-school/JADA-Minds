export default function Home() {
  return (
    <div className="page-shell" style={{ padding: "2rem" }}>
      <section className="hero-banner">
        <div className="home-hero">
          <span className="eyebrow" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>JADA Minds</span>
          <h1>Support that feels thoughtful, clear, and human.</h1>
          <p>
            Bring structure to your wellness journey with guided assessments, compassionate resources, and a welcoming space to grow.
          </p>
          <div className="btn-row">
            <a className="link-button link-button-primary" href="/login">Get started</a>
            <a className="link-button link-button-secondary" href="/" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}>Explore dashboard</a>
          </div>
        </div>

        <div className="home-card">
          <h3>What you can expect</h3>
          <ul>
            <li>Welcoming questionnaire flows</li>
            <li>Personalized results and recommendations</li>
            <li>Easy access to specialists and workshops</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
