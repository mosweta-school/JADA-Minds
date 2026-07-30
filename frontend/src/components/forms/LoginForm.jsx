// frontend/src/components/forms/LoginForm.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import useAuth from "../../hooks/useAuth";
import PasswordField from "./PasswordField";
import mockUsers from "../../data/mockUsers";

function LoginForm() {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ Regular Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
        setError("Please enter your email and password.");
        return;
    }

    try {
      setLoading(true);

      const result = await login(form.email, form.password);
      
      if (result.requires_mfa) {
        // ✅ Redirect to MFA verification
        navigate('/mfa-verify', { state: { user: result.user } });
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Unable to sign in. Please try again."
      );
    } finally {
        setLoading(false);
    }
  };

  // ✅ Google OAuth Login
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError("");
      try {
        const result = await googleLogin(tokenResponse.access_token);
        
        if (result.requires_mfa) {
          navigate('/mfa-verify', { state: { user: result.user } });
        } else {
          navigate("/dashboard");
        }
      } catch (err) {
        setError(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Google login failed. Please try again."
        );
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: () => {
      setGoogleLoading(false);
      setError("Google login failed. Please try again.");
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      {/* Error Alert */}
      {error && (
        <div
          style={{
            marginBottom: "1rem",
            padding: "0.85rem",
            borderRadius: "0.75rem",
            background: "#fff3f3",
            border: "1px solid #f5bcbc",
            color: "#c0392b",
            display: "flex",
            alignItems: "flex-start",
            gap: "0.5rem",
          }}
        >
          <span style={{ fontSize: "1.2rem" }}>❌</span>
          <span>{error}</span>
        </div>
      )}

      {/* Email Field */}
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

      {/* Password Field */}
      <div className="input-group">
        <PasswordField
          label="Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Enter your password"
        />
      </div>

      {/* Options Row */}
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
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={handleChange}
            style={{ accentColor: "#6b3cb8", cursor: "pointer" }}
          />
          Remember me
        </label>

        <Link
          to="/forgot-password"
          style={{
            color: "#6b3cb8",
            fontWeight: 600,
            textDecoration: "none",
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
          onMouseLeave={(e) => e.target.style.textDecoration = "none"}
        >
          Forgot password?
        </Link>
      </div>

      {/* ✅ Sign In Button */}
      <button
        type="submit"
        disabled={loading || googleLoading}
        className="button button-primary"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {loading && <span className="spinner" />}
        {loading ? "Signing in..." : "Sign In"}
      </button>

      {/* ✅ Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          margin: "1.5rem 0",
        }}
      >
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "#e8d4ff",
          }}
        />
        <span
          style={{
            color: "#6b5b95",
            fontSize: "0.85rem",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
        >
          or continue with
        </span>
        <div
          style={{
            flex: 1,
            height: "1px",
            background: "#e8d4ff",
          }}
        />
      </div>

      {/* ✅ Google Sign In Button */}
      <button
        type="button"
        onClick={() => googleLoginHandler()}
        disabled={loading || googleLoading}
        style={{
          width: "100%",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.75rem",
          border: "2px solid #e0e0e0",
          background: "#ffffff",
          color: "#333333",
          fontWeight: "600",
          fontSize: "1rem",
          cursor: googleLoading ? "not-allowed" : "pointer",
          opacity: googleLoading ? 0.6 : 1,
          transition: "all 0.2s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
        }}
        onMouseEnter={(e) => {
          if (!googleLoading) {
            e.target.style.background = "#f5f5f5";
            e.target.style.borderColor = "#b0b0b0";
          }
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "#ffffff";
          e.target.style.borderColor = "#e0e0e0";
        }}
      >
        {googleLoading ? (
          <span className="spinner" style={{ borderColor: "#ccc", borderTopColor: "#333" }} />
        ) : (
          <>
            {/* Google Icon */}
            <svg style={{ width: "20px", height: "20px", flexShrink: 0 }} viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.238 6.51l4.028 3.255z"
              />
              <path
                fill="#34A853"
                d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.26A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3.013l-3.794-2.974z"
              />
              <path
                fill="#4A90E2"
                d="M19.834 20.987A11.98 11.98 0 0 0 24 12c0-1.105-.145-2.194-.426-3.24H12v6.48h4.634c-.476 1.62-1.675 2.98-3.334 3.77l3.534 2.977z"
              />
              <path
                fill="#FBBC05"
                d="M5.277 14.268A7.08 7.08 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.238 6.51A11.94 11.94 0 0 0 0 12c0 1.92.452 3.73 1.238 5.49l4.039-3.222z"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>

      {/* ✅ Register Link */}
      <div
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: "0.9rem",
          color: "#6b5b95",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#6b3cb8",
            fontWeight: "600",
            textDecoration: "none",
          }}
          onMouseEnter={(e) => e.target.style.textDecoration = "underline"}
          onMouseLeave={(e) => e.target.style.textDecoration = "none"}
        >
          Sign up
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;