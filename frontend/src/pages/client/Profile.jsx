export default function Profile() {
  return (
    <div className="page-shell">
      <section className="hero-card">
        <span className="eyebrow">Your profile</span>
        <h2 className="page-title">Manage your account & preferences</h2>
        <p className="page-subtitle">
          Keep your profile current to ensure your experience stays personal and relevant.
        </p>
      </section>

      <section className="dashboard-grid">
        <div className="form-card">
          <h3>Profile details</h3>
          <div className="input-group">
            <label>Full name</label>
            <input defaultValue="Amara Chen" />
          </div>
          <div className="input-group">
            <label>Email address</label>
            <input type="email" defaultValue="amara@example.com" />
          </div>
          <div className="input-group">
            <label>Wellness interests</label>
            <select defaultValue="coaching">
              <option value="coaching">Wellness Coaching</option>
              <option value="therapy">Mental Health Support</option>
              <option value="fitness">Fitness & Nutrition</option>
              <option value="mindfulness">Mindfulness & Meditation</option>
            </select>
          </div>
          <div className="input-group">
            <label>Preferred contact method</label>
            <select defaultValue="email">
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="sms">SMS</option>
            </select>
          </div>
          <div className="btn-row">
            <button type="button" className="button button-primary">Save changes</button>
          </div>
        </div>

        <div className="panel">
          <h3>Your journey</h3>
          <div className="list-card" style={{ border: "none" }}>
            <p className="badge badge-success" style={{ marginBottom: "0.8rem" }}>Member since Jan 2026</p>
            <ul style={{ fontSize: "0.95rem" }}>
              <li>3 assessments completed</li>
              <li>5 workshops attended</li>
              <li>2 specialists connected</li>
              <li>8 resources saved</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
