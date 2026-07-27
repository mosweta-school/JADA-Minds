function Login() {
  return (
    <div className="page-shell" style={{ padding: "2rem", maxWidth: "560px", margin: "0 auto" }}>
      <section className="form-card">
        <span className="eyebrow">Welcome back</span>
        <h2 className="page-title">Log in to JADA Minds</h2>
        <p className="page-subtitle">Access your assessment history, recommendations, and wellbeing support.</p>

        <div className="input-group">
          <label>Email</label>
          <input placeholder="you@example.com" />
        </div>
        <div className="input-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" />
        </div>

        <div className="btn-row">
          <button type="button" className="button button-primary">Sign in</button>
          <a className="link-button link-button-secondary" href="/">Back home</a>
        </div>
      </section>
    </div>
  );
}

export default Login;