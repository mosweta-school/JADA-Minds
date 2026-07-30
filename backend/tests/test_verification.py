# backend/tests/test_auth_verification.py

"""
Tests for email verification.
"""

import pytest
from datetime import datetime, timezone, timedelta
from app.models import User, VerificationToken


class TestEmailVerification:
    """Test email verification endpoint."""
    
    def test_verify_email_success(self, client, db, test_user, verification_token):
        """✅ Test successful email verification."""
        response = client.post('/api/auth/verify-email', json={
            'token': verification_token.token
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['verified'] == True
        assert 'successfully' in data['message'].lower()
        
        # Check user updated
        user = User.query.get(test_user.id)
        assert user.email_verified == True
        
        # Check token marked as used
        token = VerificationToken.query.get(verification_token.id)
        assert token.used == True
        assert token.used_at is not None
    
    def test_verify_email_invalid_token(self, client):
        """❌ Test verification with invalid token."""
        response = client.post('/api/auth/verify-email', json={
            'token': 'invalid-token-12345'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'invalid' in data['error'].lower()
    
    def test_verify_email_expired_token(self, client, db, test_user, expired_token):
        """❌ Test verification with expired token."""
        response = client.post('/api/auth/verify-email', json={
            'token': expired_token.token
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'expired' in data['error'].lower()
        
        # User should NOT be verified
        user = User.query.get(test_user.id)
        assert user.email_verified == False
    
    def test_verify_email_already_used_token(self, client, db, test_user, verification_token):
        """❌ Test verification with already used token."""
        # First use
        response = client.post('/api/auth/verify-email', json={
            'token': verification_token.token
        })
        assert response.status_code == 200
        
        # Second use
        response = client.post('/api/auth/verify-email', json={
            'token': verification_token.token
        })
        assert response.status_code == 400
        assert 'invalid' in response.get_json()['error'].lower()
    
    def test_verify_email_missing_token(self, client):
        """❌ Test verification without token."""
        response = client.post('/api/auth/verify-email', json={})
        assert response.status_code == 400
        error = response.get_json()['error'].lower()
        assert 'token' in error or 'json' in error  # ✅ Accept either message