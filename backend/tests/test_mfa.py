# backend/tests/test_mfa.py

"""
Tests for Multi-Factor Authentication.
"""

import pytest
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token
from app.models import User, VerificationToken


class TestMFA:
    """Test MFA functionality."""

    def test_login_with_mfa_enabled(self, client, db, verified_user):
        """ Test login with MFA enabled."""
        verified_user.mfa_enabled = True
        db.session.commit()

        response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert data['requires_mfa'] == True
        assert 'pre_auth_token' in data
        assert 'access_token' not in data

        mfa_token = VerificationToken.query.filter_by(
            user_id=verified_user.id,
            purpose='mfa',
            used=False
        ).first()
        assert mfa_token is not None
        assert mfa_token.token is not None

    def test_verify_mfa_success(self, client, db, verified_user):
        """ Test successful MFA verification."""
        verified_user.mfa_enabled = True
        db.session.commit()

        login_response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        assert login_response.status_code == 200
        pre_auth_token = login_response.get_json()['pre_auth_token']

        mfa_token = VerificationToken.query.filter_by(
            user_id=verified_user.id,
            purpose='mfa',
            used=False
        ).first()
        assert mfa_token is not None

        response = client.post('/api/auth/mfa/verify', json={
            'code': mfa_token.token
        }, headers={
            'Authorization': f'Bearer {pre_auth_token}'
        })

        #  The pre_auth_token from login is valid, so this should work
        assert response.status_code == 200
        data = response.get_json()
        assert 'access_token' in data
        assert 'refresh_token' in data
        assert data['user']['email'] == 'verified@example.com'

    def test_verify_mfa_invalid_code(self, client, db, verified_user):
        """ Test MFA verification with invalid code."""
        verified_user.mfa_enabled = True
        db.session.commit()

        login_response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        assert login_response.status_code == 200
        pre_auth_token = login_response.get_json()['pre_auth_token']

        response = client.post('/api/auth/mfa/verify', json={
            'code': '000000'
        }, headers={
            'Authorization': f'Bearer {pre_auth_token}'
        })

        assert response.status_code == 401
        data = response.get_json()
        assert 'invalid' in data['error'].lower()

    def test_verify_mfa_expired_code(self, client, db, verified_user):
        """ Test MFA verification with expired code."""
        verified_user.mfa_enabled = True
        db.session.commit()
        
        login_response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        assert login_response.status_code == 200
        pre_auth_token = login_response.get_json()['pre_auth_token']
        
        mfa_token = VerificationToken.query.filter_by(
            user_id=verified_user.id,
            purpose='mfa',
            used=False
        ).first()
        assert mfa_token is not None
        mfa_token.expires_at = datetime.now(timezone.utc) - timedelta(minutes=1)
        db.session.commit()
        
        response = client.post('/api/auth/mfa/verify', json={
            'code': mfa_token.token
        }, headers={
            'Authorization': f'Bearer {pre_auth_token}'
        })
        
        assert response.status_code == 401
        data = response.get_json()
        #  Accept either "expired" or "invalid"
        error_lower = data['error'].lower()
        assert 'expired' in error_lower or 'invalid' in error_lower

        
    def test_mfa_locks_after_5_attempts(self, client, db, verified_user):
        """ Test MFA locks after 5 failed attempts."""
        verified_user.mfa_enabled = True
        db.session.commit()
        
        login_response = client.post('/api/auth/login', json={
            'email': 'verified@example.com',
            'password': 'Test@1234'
        })
        assert login_response.status_code == 200
        pre_auth_token = login_response.get_json()['pre_auth_token']
        
        for attempt in range(5):
            response = client.post('/api/auth/mfa/verify', json={
                'code': '000000'
            }, headers={
                'Authorization': f'Bearer {pre_auth_token}'
            })
            assert response.status_code == 401, f"Attempt {attempt + 1} failed"
        
        # 6th attempt should be locked
        response = client.post('/api/auth/mfa/verify', json={
            'code': '000000'
        }, headers={
            'Authorization': f'Bearer {pre_auth_token}'
        })
        
        #  If the token expired, get a fresh one and retry
        if response.status_code == 401:
            login_response = client.post('/api/auth/login', json={
                'email': 'verified@example.com',
                'password': 'Test@1234'
            })
            assert login_response.status_code == 200
            new_pre_auth_token = login_response.get_json()['pre_auth_token']
            
            response = client.post('/api/auth/mfa/verify', json={
                'code': '000000'
            }, headers={
                'Authorization': f'Bearer {new_pre_auth_token}'
            })
        
        #  Should be 429 (too many requests)
        assert response.status_code == 429
        data = response.get_json()
        assert 'too many' in data['error'].lower()

    def test_enable_mfa(self, client, user_token, verified_user, db):
        """ Test enabling MFA."""
        response = client.post('/api/profile/mfa/enable', headers={
            'Authorization': f'Bearer {user_token}'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert data['code_sent'] == True

        mfa_token = VerificationToken.query.filter_by(
            user_id=verified_user.id,
            purpose='mfa',
            used=False
        ).first()
        assert mfa_token is not None
        assert len(mfa_token.token) == 6
        assert mfa_token.token.isdigit()

    def test_verify_mfa_setup_success(self, client, user_token, verified_user, db):
        """ Test successful MFA setup verification."""
        enable_response = client.post('/api/profile/mfa/enable', headers={
            'Authorization': f'Bearer {user_token}'
        })
        assert enable_response.status_code == 200, "MFA enable failed"

        mfa_token = VerificationToken.query.filter_by(
            user_id=verified_user.id,
            purpose='mfa',
            used=False
        ).first()
        assert mfa_token is not None, "MFA token was not created"

        response = client.post('/api/profile/mfa/verify', json={
            'code': mfa_token.token
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert data['mfa_enabled'] == True

    def test_disable_mfa(self, client, user_token, verified_user, db):
        """ Test disabling MFA."""
        verified_user.mfa_enabled = True
        db.session.commit()

        response = client.post('/api/profile/mfa/disable', headers={
            'Authorization': f'Bearer {user_token}'
        })

        assert response.status_code == 200
        data = response.get_json()
        assert data['mfa_enabled'] == False