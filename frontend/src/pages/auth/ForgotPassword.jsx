import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Alert } from './common/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Check Your Email</h1>
            <p style={{ color: '#6b5b95', marginBottom: '1rem' }}>
              If an account exists with this email, you'll receive a password reset link.
            </p>
            <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
              Return to Login
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Reset Password</h1>
          <p style={{ color: '#6b5b95' }}>Enter your email and we'll send you a reset link</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            Send Reset Link
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b5b95' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}