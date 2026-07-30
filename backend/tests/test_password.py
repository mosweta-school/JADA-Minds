# backend/tests/test_auth_password.py

"""
Tests for password reset and change functionality.
"""

import pytest
from app.models import User, VerificationToken


class TestForgotPassword:
    """Test forgot password functionality."""
    
    def test_forgot_password_success(self, client, test_user, db):
        """ Test successful password reset request."""
        response = client.post('/api/auth/forgot-password', json={
            'email': 'test@example.com'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'reset link' in data['message'].lower()
        
        # Check reset token created
        token = VerificationToken.query.filter_by(
            user_id=test_user.id,
            purpose='password_reset',
            used=False
        ).first()
        assert token is not None
        assert token.expires_at > token.created_at
    
    def test_forgot_password_nonexistent_email(self, client):
        """ Test password reset for non-existent email (should still succeed)."""
        response = client.post('/api/auth/forgot-password', json={
            'email': 'nonexistent@example.com'
        })
        
        # Should return success (for security, don't reveal if email exists)
        assert response.status_code == 200
        data = response.get_json()
        assert 'reset link' in data['message'].lower()
    
    def test_forgot_password_missing_email(self, client):
        """ Test forgot password without email."""
        response = client.post('/api/auth/forgot-password', json={})
        assert response.status_code == 400
        error = response.get_json()['error'].lower()
        assert 'email' in error or 'json' in error  #  Accept either message


class TestResetPassword:
    """Test password reset functionality."""
    
    def test_reset_password_success(self, client, test_user, password_reset_token, db):
        """ Test successful password reset."""
        response = client.post('/api/auth/reset-password', json={
            'token': password_reset_token.token,
            'new_password': 'NewTest@5678'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'successfully' in data['message'].lower()
        
        # Check password updated
        user = User.query.get(test_user.id)
        assert user.check_password('NewTest@5678') == True
        
        # Check password_changed_at updated
        assert user.password_changed_at > password_reset_token.created_at
        
        # Check token marked as used
        token = VerificationToken.query.get(password_reset_token.id)
        assert token.used == True
    
    def test_reset_password_invalid_token(self, client):
        """ Test password reset with invalid token."""
        response = client.post('/api/auth/reset-password', json={
            'token': 'invalid-token-12345',
            'new_password': 'NewTest@5678'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'invalid' in data['error'].lower()
    
    def test_reset_password_expired_token(self, client, db, test_user):
        """ Test password reset with expired token."""
        # Create expired token
        from datetime import datetime, timezone, timedelta
        token = VerificationToken(
            user_id=test_user.id,
            token='expired-reset-token',
            purpose='password_reset',
            expires_at=datetime.now(timezone.utc) - timedelta(minutes=1)
        )
        db.session.add(token)
        db.session.commit()
        
        response = client.post('/api/auth/reset-password', json={
            'token': token.token,
            'new_password': 'NewTest@5678'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'expired' in data['error'].lower()
    
    def test_reset_password_weak_password(self, client, password_reset_token):
        """ Test password reset with weak password."""
        response = client.post('/api/auth/reset-password', json={
            'token': password_reset_token.token,
            'new_password': 'weak'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'password' in data['error'].lower()
    # backend/tests/test_password.py - Fix the missing fields test

    def test_reset_password_missing_fields(self, client):
        """ Test password reset with missing fields."""
        # Missing token
        response = client.post('/api/auth/reset-password', json={
            'new_password': 'Test@1234'
        })
        assert response.status_code == 400
        assert 'token' in response.get_json()['error'].lower()
        
        # Missing password
        response = client.post('/api/auth/reset-password', json={
            'token': 'some-token'
        })
        assert response.status_code == 400
        #  FIX: The error message says "Token and new password are required"
        # so check for 'new password' or 'new_password'
        error = response.get_json()['error'].lower()
        assert 'new password' in error or 'new_password' in error


class TestChangePassword:
    """Test change password functionality (authenticated)."""
    
    def test_change_password_success(self, client, verified_user, user_token, db):
        """ Test successful password change."""
        response = client.post('/api/profile/change-password', json={
            'current_password': 'Test@1234',
            'new_password': 'NewTest@5678',
            'confirm_password': 'NewTest@5678'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'successfully' in data['message'].lower()
        
        # Check password updated
        user = User.query.get(verified_user.id)
        assert user.check_password('NewTest@5678') == True
        
        # Check password_changed_at updated
        assert user.password_changed_at > user.created_at
    
    def test_change_password_wrong_current(self, client, verified_user, user_token):
        """ Test change password with wrong current password."""
        response = client.post('/api/profile/change-password', json={
            'current_password': 'WrongPassword123!',
            'new_password': 'NewTest@5678',
            'confirm_password': 'NewTest@5678'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 401
        data = response.get_json()
        assert 'incorrect' in data['error'].lower()
    
    def test_change_password_mismatch(self, client, verified_user, user_token):
        """ Test change password with mismatched new passwords."""
        response = client.post('/api/profile/change-password', json={
            'current_password': 'Test@1234',
            'new_password': 'NewTest@5678',
            'confirm_password': 'NewTest@9999'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'match' in data['error'].lower()
    
    def test_change_password_same_as_current(self, client, verified_user, user_token):
        """ Test change password to same as current."""
        response = client.post('/api/profile/change-password', json={
            'current_password': 'Test@1234',
            'new_password': 'Test@1234',
            'confirm_password': 'Test@1234'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'different' in data['error'].lower()
    
    def test_change_password_weak(self, client, verified_user, user_token):
        """ Test change password with weak password."""
        response = client.post('/api/profile/change-password', json={
            'current_password': 'Test@1234',
            'new_password': 'weak',
            'confirm_password': 'weak'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'password' in data['error'].lower()