import LoginForm from "../../components/forms/LoginForm";

function Login() {
  return (
    <div
      className="page-shell"
      style={{
        padding: "2rem",
        maxWidth: "560px",
        margin: "0 auto",
      }}
    >
      <section className="form-card">
        <span className="eyebrow">Welcome back</span>

        <h2 className="page-title">Log in to JADA Minds</h2>

        <p className="page-subtitle">
          Access your assessment history, recommendations, and wellbeing
          support.
        </p>

        <LoginForm />
      </section>
    </div>
  );
}

export default Login;