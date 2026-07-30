import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Alert } from './common/Alert';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      await register(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <Card>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Registration Successful!</h1>
            <p style={{ color: '#6b5b95', marginBottom: '0.5rem' }}>Please check your email to verify your account.</p>
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
          <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Create Account</h1>
          <p style={{ color: '#6b5b95' }}>Join JADA Minds and start your wellness journey</p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            helperText="8+ characters with uppercase, lowercase, number & special character"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={form.confirm_password}
            onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
            required
          />

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2d1b69', fontSize: '0.95rem' }}>
              I want to join as:
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '2px solid #e8d4ff',
                fontSize: '1rem',
                background: '#faf5ff',
                color: '#2d1b69',
                outline: 'none',
              }}
            >
              <option value="client">Client</option>
              <option value="specialist">Specialist</option>
            </select>
          </div>

          <Button type="submit" loading={loading} fullWidth>
            Create Account
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b5b95' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}