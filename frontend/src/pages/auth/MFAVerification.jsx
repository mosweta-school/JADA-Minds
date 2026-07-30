import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Card } from './common/Card';
import { Input } from './common/Input';
import { Button } from './common/Button';
import { Alert } from './common/Alert';

export default function MFAVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyMFA } = useAuth();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const user = location.state?.user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (code.length !== 6 || !/^\d+$/.test(code)) {
      setError('Please enter a valid 6-digit code');
      setLoading(false);
      return;
    }

    try {
      await verifyMFA(code);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Two-Factor Authentication</h1>
          <p style={{ color: '#6b5b95' }}>
            Enter the 6-digit code sent to your email
            {user && <span style={{ color: '#6b5b95' }}> ({user.email})</span>}
          </p>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <Input
            label="Verification Code"
            type="text"
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            helperText="Enter the 6-digit code from your email"
            required
          />

          <Button type="submit" loading={loading} fullWidth>
            Verify
          </Button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#6b5b95' }}>
          Didn't receive a code?{' '}
          <button
            type="button"
            style={{ background: 'none', border: 'none', color: '#6b3cb8', fontWeight: '600', cursor: 'pointer' }}
            onClick={() => {
              // Resend logic can be added here
            }}
          >
            Resend
          </button>
        </div>
      </Card>
    </div>
  );
}