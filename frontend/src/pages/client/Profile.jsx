// frontend/src/pages/client/Profile.jsx

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Alert, Button, Modal, Input } from '../../components/ui';

export default function Profile() {
  const { user, updateProfile, changePassword, enableMFA, verifyMFASetup, disableMFA, logout } = useAuth();
  
  // Profile form state
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // MFA state
  const [mfaCode, setMfaCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [mfaMessage, setMfaMessage] = useState({ type: '', text: '' });
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaStep, setMfaStep] = useState('confirm');
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfa_enabled || false);

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        phone: user.phone || '',
      });
      setMfaEnabled(user.mfa_enabled || false);
    }
  }, [user]);

  // ============================================================
  // PROFILE UPDATE
  // ============================================================
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updatedUser = await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setFormData({
        full_name: updatedUser.full_name || '',
        phone: updatedUser.phone || '',
      });
      // Clear message after 3 seconds
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err) {
      setMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // PASSWORD CHANGE
  // ============================================================
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordMessage({ type: 'error', text: 'Passwords do not match' });
      setPasswordLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setPasswordMessage({ 
        type: 'error', 
        text: 'Password must be at least 8 characters' 
      });
      setPasswordLoading(false);
      return;
    }

    try {
      await changePassword(
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setPasswordMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to change password' 
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  // ============================================================
  // MFA MANAGEMENT
  // ============================================================
  const handleEnableMFA = async () => {
    setMfaLoading(true);
    setMfaMessage({ type: '', text: '' });

    try {
      await enableMFA();
      setMfaStep('verify');
      setMfaMessage({ 
        type: 'info', 
        text: 'A verification code has been sent to your email.' 
      });
    } catch (err) {
      setMfaMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to enable MFA' 
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const handleVerifyMFA = async (e) => {
    e.preventDefault();
    setMfaLoading(true);
    setMfaMessage({ type: '', text: '' });

    if (!mfaCode || mfaCode.length !== 6) {
      setMfaMessage({ type: 'error', text: 'Please enter a valid 6-digit code' });
      setMfaLoading(false);
      return;
    }

    try {
      await verifyMFASetup(mfaCode);
      setMfaEnabled(true);
      setMfaMessage({ type: 'success', text: 'MFA enabled successfully!' });
      setMfaStep('confirm');
      setMfaCode('');
      setTimeout(() => {
        setShowMfaModal(false);
        setMfaMessage({ type: '', text: '' });
      }, 2000);
    } catch (err) {
      setMfaMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Invalid verification code' 
      });
    } finally {
      setMfaLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication?')) {
      return;
    }

    setMfaLoading(true);
    setMfaMessage({ type: '', text: '' });

    try {
      await disableMFA();
      setMfaEnabled(false);
      setMfaMessage({ type: 'success', text: 'MFA disabled successfully!' });
      setTimeout(() => {
        setMfaMessage({ type: '', text: '' });
      }, 3000);
    } catch (err) {
      setMfaMessage({ 
        type: 'error', 
        text: err.response?.data?.error || 'Failed to disable MFA' 
      });
    } finally {
      setMfaLoading(false);
    }
  };

  // ============================================================
  // RENDER - MAINTAINING ORIGINAL LAYOUT
  // ============================================================
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
        {/* Left Column - Profile Form */}
        <div className="form-card">
          <h3>Profile details</h3>
          
          {message.text && (
            <Alert variant={message.type} style={{ marginBottom: '1rem' }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleProfileUpdate}>
            <div className="input-group">
              <label>Full name</label>
              <input 
                name="full_name"
                value={formData.full_name}
                onChange={handleProfileChange}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="input-group">
              <label>Email address</label>
              <input 
                type="email" 
                value={user?.email || ''} 
                disabled 
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
            </div>
            
            <div className="input-group">
              <label>Phone number</label>
              <input 
                name="phone"
                value={formData.phone}
                onChange={handleProfileChange}
                placeholder="+254 700 000 000"
              />
            </div>

            {/* Added Change Password button inline */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              <button 
                type="button" 
                className="button button-secondary" 
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                onClick={() => setShowPasswordModal(true)}
              >
                Change password
              </button>
            </div>

            {/* Wellness interests - kept for layout consistency */}
            <div className="input-group">
              <label>Wellness interests</label>
              <select defaultValue="coaching">
                <option value="coaching">Wellness Coaching</option>
                <option value="therapy">Mental Health Support</option>
                <option value="fitness">Fitness & Nutrition</option>
                <option value="mindfulness">Mindfulness & Meditation</option>
              </select>
            </div>

            {/* Preferred contact method - kept for layout consistency */}
            <div className="input-group">
              <label>Preferred contact method</label>
              <select defaultValue="email">
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="sms">SMS</option>
              </select>
            </div>

            <div className="btn-row">
              <button type="submit" className="button button-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>

          {/* MFA Section - Added below the form */}
          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e8d4ff' }}>
            <h3> Security</h3>
            
            {mfaMessage.text && (
              <Alert variant={mfaMessage.type} style={{ marginBottom: '1rem' }}>
                {mfaMessage.text}
              </Alert>
            )}

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div>
                <p style={{ margin: 0, fontWeight: '600', color: '#2d1b69' }}>
                  Two-Factor Authentication (MFA)
                </p>
                <p style={{ margin: '0.25rem 0 0', color: '#6b5b95', fontSize: '0.9rem' }}>
                  {mfaEnabled 
                    ? 'MFA is enabled on your account' 
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {mfaEnabled ? (
                  <button 
                    className="button button-danger" 
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    onClick={handleDisableMFA}
                    disabled={mfaLoading}
                  >
                    {mfaLoading ? 'Processing...' : 'Disable MFA'}
                  </button>
                ) : (
                  <button 
                    className="button button-primary" 
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                    onClick={() => {
                      setShowMfaModal(true);
                      setMfaStep('confirm');
                      setMfaCode('');
                      setMfaMessage({ type: '', text: '' });
                    }}
                    disabled={mfaLoading}
                  >
                    {mfaLoading ? 'Processing...' : 'Enable MFA'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Journey Stats */}
        <div className="panel">
          <h3> Your journey</h3>
          <div className="list-card" style={{ border: 'none' }}>
            <p className="badge badge-success" style={{ marginBottom: '0.8rem' }}>
              Member since {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Jan 2026'}
            </p>
            <ul style={{ fontSize: '0.95rem' }}>
              <li> Email verified</li>
              <li> MFA {mfaEnabled ? 'enabled' : 'not enabled'}</li>
              <li> {user?.full_name || 'User'}</li>
              <li> {user?.email || 'No email'}</li>
            </ul>
            
            {/* Logout button */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e8d4ff' }}>
              <button className="button button-danger" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }} onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          CHANGE PASSWORD MODAL
          ============================================================ */}
      <Modal
        open={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordMessage({ type: '', text: '' });
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: '',
          });
        }}
        title="Change Password"
      >
        {passwordMessage.text && (
          <Alert variant={passwordMessage.type} style={{ marginBottom: '1rem' }}>
            {passwordMessage.text}
          </Alert>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className="input-group">
            <label>Current Password</label>
            <input
              type="password"
              value={passwordData.current_password}
              onChange={(e) => setPasswordData({ 
                ...passwordData, 
                current_password: e.target.value 
              })}
              placeholder="Enter your current password"
              required
            />
          </div>

          <div className="input-group">
            <label>New Password</label>
            <input
              type="password"
              value={passwordData.new_password}
              onChange={(e) => setPasswordData({ 
                ...passwordData, 
                new_password: e.target.value 
              })}
              placeholder="Create a new password"
              required
            />
            <small style={{ color: '#6b5b95', fontSize: '0.8rem' }}>
              8+ characters with uppercase, lowercase, number & special character
            </small>
          </div>

          <div className="input-group">
            <label>Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirm_password}
              onChange={(e) => setPasswordData({ 
                ...passwordData, 
                confirm_password: e.target.value 
              })}
              placeholder="Confirm your new password"
              required
            />
          </div>

          <div className="btn-row">
            <button type="submit" className="button button-primary" disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
            <button 
              type="button" 
              className="button button-secondary"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordMessage({ type: '', text: '' });
                setPasswordData({
                  current_password: '',
                  new_password: '',
                  confirm_password: '',
                });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>

      {/* ============================================================
          MFA MODAL
          ============================================================ */}
      <Modal
        open={showMfaModal}
        onClose={() => {
          setShowMfaModal(false);
          setMfaStep('confirm');
          setMfaCode('');
          setMfaMessage({ type: '', text: '' });
        }}
        title={mfaStep === 'confirm' ? 'Enable Two-Factor Authentication' : 'Verify MFA Code'}
      >
        {mfaMessage.text && (
          <Alert variant={mfaMessage.type} style={{ marginBottom: '1rem' }}>
            {mfaMessage.text}
          </Alert>
        )}

        {mfaStep === 'confirm' ? (
          <div>
            <p style={{ color: '#6b5b95', marginBottom: '1rem' }}>
              Two-factor authentication adds an extra layer of security to your account.
              You'll need to enter a verification code from your email each time you log in.
            </p>
            <ul style={{ color: '#6b5b95', marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
              <li>A 6-digit code will be sent to your email</li>
              <li>You'll need to enter this code when logging in</li>
              <li>You can disable MFA at any time</li>
            </ul>
            <div className="btn-row">
              <button className="button button-primary" onClick={handleEnableMFA} disabled={mfaLoading}>
                {mfaLoading ? 'Sending...' : 'Enable MFA'}
              </button>
              <button 
                type="button" 
                className="button button-secondary"
                onClick={() => {
                  setShowMfaModal(false);
                  setMfaStep('confirm');
                  setMfaCode('');
                  setMfaMessage({ type: '', text: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleVerifyMFA}>
            <p style={{ color: '#6b5b95', marginBottom: '0.5rem' }}>
              Enter the 6-digit verification code sent to your email.
            </p>
            <div className="input-group">
              <label>Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
              />
              <small style={{ color: '#6b5b95', fontSize: '0.8rem' }}>
                Enter the 6-digit code from your email
              </small>
            </div>
            <div className="btn-row">
              <button type="submit" className="button button-primary" disabled={mfaLoading}>
                {mfaLoading ? 'Verifying...' : 'Verify Code'}
              </button>
              <button 
                type="button" 
                className="button button-secondary"
                onClick={() => {
                  setShowMfaModal(false);
                  setMfaStep('confirm');
                  setMfaCode('');
                  setMfaMessage({ type: '', text: '' });
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}