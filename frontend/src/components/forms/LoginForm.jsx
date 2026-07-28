import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PasswordField from "./PasswordField";

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email: form.email,
        role: "client",
      });

      navigate("/");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.85rem",
            borderRadius: "0.75rem",
            background: "#fff3f3",
            border: "1px solid #f5bcbc",
            color: "#c0392b",
          }}
        >
          {error}
        </div>
      )}

      <div className="input-group">
        <label htmlFor="email">Email Address</label>

        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="Enter your email"
          required
        />
      </div>

      <div className="input-group">
        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.75rem",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#6b5b95",
          }}
        >
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          style={{
            color: "#6b3cb8",
            fontWeight: 600,
          }}
        >
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="button button-primary"
        style={{ width: "100%" }}
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

export default LoginForm;