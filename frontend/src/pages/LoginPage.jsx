// frontend/src/pages/LoginPage.jsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Card, Input, Button, Alert } from '../components/common';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function GoogleAuthButton({ onSuccess, onError }) {
  const [loading, setLoading] = useState(false);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setLoading(false);
      onSuccess(tokenResponse.access_token);
    },
    onError: () => {
      setLoading(false);
      onError('Google login failed. Please try again.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => { setLoading(true); login(); }}
      disabled={loading}
      className="btn btn-google"
    >
      {loading ? (
        <span className="spinner border-gray-400 border-t-gray-600" />
      ) : (
        <>
          <svg className="google-icon" viewBox="0 0 24 24">
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
  );
}

function LoginForm({ onGoogleSuccess, onGoogleError }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(form.email, form.password);
      if (result.requires_mfa) {
        navigate('/mfa-verify', { state: { user: result.user } });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          id="login-email"
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          id="login-password"
        />

        <div className="form-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>

        <Button type="submit" loading={loading} fullWidth>
          Sign In
        </Button>
      </form>

      <div className="auth-divider">
        <span>or continue with</span>
      </div>

      <GoogleAuthButton
        onSuccess={onGoogleSuccess}
        onError={onGoogleError}
      />
    </>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [error, setError] = useState('');

  const handleGoogleSuccess = async (credential) => {
    try {
      const result = await googleLogin(credential);
      if (result.requires_mfa) {
        navigate('/mfa-verify', { state: { user: result.user } });
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Google login failed');
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="auth-container">
        <Card>
          <div className="auth-header">
            <h1>Welcome Back</h1>
            <p>Log in to your JADA Minds account</p>
          </div>

          {error && <Alert variant="error">{error}</Alert>}

          <LoginForm
            onGoogleSuccess={handleGoogleSuccess}
            onGoogleError={setError}
          />

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up</Link>
          </div>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}