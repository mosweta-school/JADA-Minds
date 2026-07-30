# backend/tests/test_auth_login.py

"""
Tests for user login.
"""

import pytest
from datetime import datetime, timezone, timedelta
from app.models import User


class TestLogin:
    """Test login endpoint."""
    
    def test_login_success(self, client, verified_user):
        """ Test successful login without MFA."""
        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user']['email'] == 'verified@example.com'
        assert data['requires_mfa'] == False
        
        # Check last_login updated
        user = User.query.get(verified_user.id)
        assert user.last_login is not None
        
        # Check failed attempts reset
        assert user.failed_login_attempts == 0
        assert user.account_locked_until is None
    
    def test_login_invalid_credentials(self, client, verified_user):
        """ Test login with invalid credentials."""
        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'WrongPassword123!'
        })
        
        assert response.status_code == 401
        data = response.get_json()
        assert 'invalid' in data['error'].lower()
        
        # Check failed attempts incremented
        user = User.query.get(verified_user.id)
        assert user.failed_login_attempts == 1
    
    def test_login_unverified_email(self, client, test_user):
        """ Test login with unverified email."""
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com',
            'password': 'Test@1234'
        })
        
        assert response.status_code == 403
        data = response.get_json()
        assert 'verify' in data['error'].lower()
        assert 'verification link' in data['error'].lower()
    
    def test_login_inactive_account(self, client, verified_user, db):
        """ Test login with inactive account."""
        verified_user.is_active = False
        db.session.commit()
        
        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        
        assert response.status_code == 403
        data = response.get_json()
        assert 'deactivated' in data['error'].lower()
    
    def test_login_account_locked(self, client, verified_user, db):
        """ Test login with locked account."""
        # Lock the account
        verified_user.failed_login_attempts = 5
        verified_user.account_locked_until = datetime.now(timezone.utc) + timedelta(minutes=15)
        db.session.commit()
        
        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        
        assert response.status_code == 423
        data = response.get_json()
        assert 'locked' in data['error'].lower()
        assert 'minutes' in data['error'].lower()
    
    def test_login_account_locks_after_5_attempts(self, client, verified_user):
        """ Test account locks after 5 failed attempts."""
        # 5 failed attempts
        for _ in range(5):
            response = client.post('/api/auth/login', json={
                'email': 'verified@example.com',
                'password': 'WrongPassword123!'
            })
            assert response.status_code == 401
        
        # 6th attempt should be locked
        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'WrongPassword123!'
        })
        assert response.status_code == 423
        assert 'locked' in response.get_json()['error'].lower()
    
    def test_login_missing_fields(self, client):
        """ Test login with missing fields."""
        # Missing email
        response = client.post('/api/auth/login', json={
            'password': 'Test@1234'
        })
        assert response.status_code == 400
        assert 'email' in response.get_json()['error'].lower()
        
        # Missing password
        response = client.post('/api/auth/login', json={
            'email': 'test@example.com'
        })
        assert response.status_code == 400
        assert 'password' in response.get_json()['error'].lower()
    
    def test_login_case_insensitive_email(self, client, verified_user):
        """ Test login with case-insensitive email."""
        response = client.post('/api/auth/login', json={
            'email': 'VERIFIED@EXAMPLE.COM',
            'password': 'Test@1234'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['user']['email'] == 'verified@example.com'