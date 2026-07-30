# backend/tests/test_auth_profile.py

"""
Tests for user profile management.
"""

import pytest
from app.models import User

class TestProfile:
    """Test profile endpoints."""
    
    def test_get_profile_success(self, client, verified_user, user_token):
        """ Test successful profile retrieval."""
        response = client.get('/api/profile', headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == verified_user.id
        assert data['email'] == 'verified@example.com'
        assert data['full_name'] == 'Verified User'
        assert data['role'] == 'client'
        assert 'password_hash' not in data  # Should not expose password
    
    def test_get_profile_unauthenticated(self, client):
        """ Test profile retrieval without authentication."""
        response = client.get('/api/profile')
        assert response.status_code == 401
    
    def test_update_profile_success(self, client, verified_user, user_token, db):
        """ Test successful profile update."""
        response = client.put('/api/profile', json={
            'full_name': 'Updated Name',
            'phone': '+254712345678'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['full_name'] == 'Updated Name'
        assert data['phone'] == '+254712345678'
        
        # Check DB updated
        user = User.query.get(verified_user.id)
        assert user.full_name == 'Updated Name'
        assert user.phone == '+254712345678'
    
    def test_update_profile_partial(self, client, verified_user, user_token):
        """ Test partial profile update."""
        response = client.put('/api/profile', json={
            'phone': '+254987654321'
        }, headers={
            'Authorization': f'Bearer {user_token}'
        })
        
        assert response.status_code == 200
        data = response.get_json()
        assert data['full_name'] == 'Verified User'  # Unchanged
        assert data['phone'] == '+254987654321'
    
    def test_update_profile_unauthenticated(self, client):
        """ Test profile update without authentication."""
        response = client.put('/api/profile', json={
            'full_name': 'Hacker Name'
        })
        assert response.status_code == 401