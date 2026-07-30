import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { Card } from './common/Card';
import { Alert } from './common/Alert';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification token');
        return;
      }

      try {
        const response = await authApi.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: 'linear-gradient(135deg, #f5f1ff 0%, #faf5ff 100%)' }}>
      <Card>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.75rem', color: '#2d1b69', marginBottom: '0.5rem' }}>Email Verification</h1>
          {status === 'verifying' && <p style={{ color: '#6b5b95' }}>Verifying your email...</p>}
        </div>

        {status === 'success' && (
          <>
            <Alert variant="success">{message}</Alert>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
                Proceed to Login
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <Alert variant="error">{message}</Alert>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <Link to="/login" style={{ color: '#6b3cb8', fontWeight: '600', textDecoration: 'none' }}>
                Return to Login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}