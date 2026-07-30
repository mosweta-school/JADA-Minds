# backend/tests/test_auth_registration.py

"""
Tests for user registration.
Following Rule 2: Every endpoint gets tests before we move to the next feature.
"""

import pytest
from app.models import User, VerificationToken


class TestRegistration:
    """Test user registration endpoint."""
    
    def test_register_success(self, client, db):
        """✅ Test successful registration."""
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['user']['email'] == 'john@example.com'
        assert data['user']['email_verified'] == False
        assert data['user']['role'] == 'client'
        assert data['verification_email_sent'] == True
        
        # Check user created in DB
        user = User.query.filter_by(email='john@example.com').first()
        assert user is not None
        assert user.full_name == 'John Doe'
        assert user.role == 'client'
        assert user.check_password('Test@1234') == True
        
        # Check verification token created
        token = VerificationToken.query.filter_by(
            user_id=user.id,
            purpose='email_verification'
        ).first()
        assert token is not None
        assert token.used == False
    
    def test_register_duplicate_email(self, client, db, test_user):
        """❌ Test registration with duplicate email."""
        response = client.post('/api/auth/register', json={
            'full_name': 'Another User',
            'email': 'test@example.com',  # Already exists
            'password': 'Test@1234',
            'confirm_password': 'Test@1234'
        })
        
        assert response.status_code == 409
        data = response.get_json()
        assert 'already registered' in data['error'].lower()
    
    def test_register_weak_password(self, client):
        """❌ Test registration with weak password."""
        # Too short
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'weak',
            'confirm_password': 'weak'
        })
        assert response.status_code == 400
        data = response.get_json()
        assert 'password' in data['error'].lower()
        
        # No uppercase
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'test1234!',
            'confirm_password': 'test1234!'
        })
        assert response.status_code == 400
        assert 'uppercase' in response.get_json()['error'].lower()
        
        # No special character
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'Test1234',
            'confirm_password': 'Test1234'
        })
        assert response.status_code == 400
        assert 'special' in response.get_json()['error'].lower()
    
    def test_register_password_mismatch(self, client):
        """❌ Test registration with mismatched passwords."""
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'john@example.com',
            'password': 'Test@1234',
            'confirm_password': 'Test@5678'
        })
        
        assert response.status_code == 400
        data = response.get_json()
        assert 'match' in data['error'].lower()
    
    def test_register_missing_fields(self, client):
        """❌ Test registration with missing required fields."""
        # Missing full_name
        response = client.post('/api/auth/register', json={
            'email': 'john@example.com',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234'
        })
        assert response.status_code == 400
        assert 'full_name' in response.get_json()['error'].lower()
        
        # Missing email
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234'
        })
        assert response.status_code == 400
        assert 'email' in response.get_json()['error'].lower()
    
    def test_register_invalid_email(self, client):
        """❌ Test registration with invalid email format."""
        response = client.post('/api/auth/register', json={
            'full_name': 'John Doe',
            'email': 'invalid-email',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234'
        })
        assert response.status_code == 400
        assert 'email' in response.get_json()['error'].lower()
    
    def test_register_specialist_role(self, client, db):
        """✅ Test registration with specialist role."""
        response = client.post('/api/auth/register', json={
            'full_name': 'Dr. Jane',
            'email': 'jane@example.com',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234',
            'role': 'specialist'
        })
        
        assert response.status_code == 201
        data = response.get_json()
        assert data['user']['role'] == 'specialist'
        
        # Check DB
        user = User.query.filter_by(email='jane@example.com').first()
        assert user.role == 'specialist'
    
    def test_register_admin_role_blocked(self, client, db):
        """❌ Test registration with admin role (should be blocked)."""
        response = client.post('/api/auth/register', json={
            'full_name': 'Admin Wannabe',
            'email': 'adminwannabe@example.com',
            'password': 'Test@1234',
            'confirm_password': 'Test@1234',
            'role': 'admin'
        })
        
        # Should create as client, not admin
        assert response.status_code == 201
        data = response.get_json()
        assert data['user']['role'] == 'client'
        
        # Check DB
        user = User.query.filter_by(email='adminwannabe@example.com').first()
        assert user.role == 'client'