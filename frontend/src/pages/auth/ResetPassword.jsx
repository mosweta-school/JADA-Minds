// frontend/src/pages/auth/ResetPassword.jsx

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Alert } from './common/Alert';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [form, setForm] = useState({
    password: '',
    confirm_password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      // ✅ Make sure we're sending the token and password correctly
      console.log('Sending reset request with token:', token.substring(0, 10) + '...');
      
      const response = await authApi.resetPassword(token, form.password);
      console.log('Reset response:', response.data);
      
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      console.error('Reset error:', err.response?.data);
      setError(err.response?.data?.error || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>🔒 Password Reset!</h1>
            <p style={{ color: '#6b5b95', marginBottom: '0.5rem' }}>Your password has been reset successfully.</p>
            <p style={{ color: '#6b5b95', fontSize: '0.875rem' }}>Redirecting to login...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Set New Password</h1>
          <p style={{ color: '#6b5b95' }}>Create a strong password for your account</p>
          {token && (
            <p style={{ color: '#6b5b95', fontSize: '0.75rem', marginTop: '0.5rem' }}>
              Token: {token.substring(0, 10)}...
            </p>
          )}
        </div>

        {error && <Alert variant="error">{error}</Alert>}
        {!token && <Alert variant="warning">Invalid or missing reset token</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="New Password"
            type="password"
            placeholder="Create a strong password"
            helperText="8+ characters with uppercase, lowercase, number & special character"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            disabled={!token}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your new password"
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            required
            disabled={!token}
          />

          <Button type="submit" loading={loading} fullWidth disabled={!token}>
            Reset Password
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b5b95' }}>
          <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
}