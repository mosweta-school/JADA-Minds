# backend/tests/conftest.py

"""
Test configuration and fixtures for JADA Minds.
"""

import pytest
from datetime import datetime, timezone, timedelta
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_mail import Message

from app import create_app
from app.extensions import db as _db
from app.models import User, VerificationToken, TokenBlacklist


# ============================================================================
# BASE FIXTURES
# ============================================================================

@pytest.fixture
def app():
    """Create a Flask application for testing."""
    flask_app = create_app()
    flask_app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
        MAIL_SUPPRESS_SEND=True,
        JWT_SECRET_KEY="test-jwt-secret-key",
        JWT_ACCESS_TOKEN_EXPIRES=timedelta(hours=1),
        JWT_REFRESH_TOKEN_EXPIRES=timedelta(days=7),
        WTF_CSRF_ENABLED=False,
    )

    with flask_app.app_context():
        _db.create_all()
        yield flask_app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def db(app):
    """Database fixture."""
    return _db


@pytest.fixture
def client(app):
    """Test client fixture."""
    return app.test_client()


# ============================================================================
# USER FIXTURES
# ============================================================================

@pytest.fixture
def admin_user(app):
    """Create an admin user."""
    admin = User(
        full_name="Admin",
        role="admin",
        email="admin@fixture.com",
        password_hash="x",
    )
    _db.session.add(admin)
    _db.session.commit()
    return admin


@pytest.fixture
def client_user(app):
    """Create a client user."""
    user = User(
        full_name="Client",
        role="client",
        email="client@fixture.com",
        password_hash="x",
    )
    _db.session.add(user)
    _db.session.commit()
    return user


@pytest.fixture
def admin_token(app, admin_user):
    """Create an admin token."""
    with app.app_context():
        return create_access_token(identity=str(admin_user.id))


@pytest.fixture
def client_token(app, client_user):
    """Create a client token."""
    with app.app_context():
        return create_access_token(identity=str(client_user.id))


# ============================================================================
# AUTHENTICATION TEST FIXTURES
# ============================================================================

@pytest.fixture
def test_user(db):
    """Create a test user with a real password."""
    user = User(
        full_name="Test User",
        email="test@example.com",
        role="client"
    )
    user.set_password("Test@1234")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def verified_user(db):
    """Create a verified test user."""
    user = User(
        full_name="Verified User",
        email="verified@example.com",
        role="client",
        email_verified=True
    )
    user.set_password("Test@1234")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def specialist_user(db):
    """Create a verified specialist user."""
    user = User(
        full_name="Dr. Specialist",
        email="specialist@example.com",
        role="specialist",
        email_verified=True
    )
    user.set_password("Test@1234")
    db.session.add(user)
    db.session.commit()
    return user


@pytest.fixture
def admin_user_with_password(db):
    """Create an admin user with a real password."""
    user = User(
        full_name="Admin User",
        email="admin@example.com",
        role="admin",
        email_verified=True
    )
    user.set_password("Test@1234")
    db.session.add(user)
    db.session.commit()
    return user


# ============================================================================
# TOKEN FIXTURES - ✅ FIXED: Use str() for identity
# ============================================================================

@pytest.fixture
def user_token(app, verified_user):
    """Create a fresh access token for the verified user."""
    with app.app_context():
        token = create_access_token(
            identity=str(verified_user.id),  # ✅ Convert to string for consistency
            additional_claims={"role": verified_user.role}
        )
        return token


@pytest.fixture
def specialist_token(app, specialist_user):
    """Create an access token for the specialist user."""
    with app.app_context():
        token = create_access_token(
            identity=str(specialist_user.id),  # ✅ Convert to string
            additional_claims={"role": specialist_user.role}
        )
        return token


@pytest.fixture
def admin_token_with_password(app, admin_user_with_password):
    """Create an access token for the admin user."""
    with app.app_context():
        token = create_access_token(
            identity=str(admin_user_with_password.id),  # ✅ Convert to string
            additional_claims={"role": admin_user_with_password.role}
        )
        return token


@pytest.fixture
def refresh_token(app, verified_user):
    """Create a refresh token for the verified user."""
    with app.app_context():
        token = create_refresh_token(
            identity=str(verified_user.id),  # ✅ Convert to string
            additional_claims={"role": verified_user.role}
        )
        return token


# ============================================================================
# VERIFICATION TOKEN FIXTURES
# ============================================================================

@pytest.fixture
def verification_token(db, test_user):
    """Create a valid verification token."""
    token = VerificationToken(
        user_id=test_user.id,
        token="valid-verification-token-12345",
        purpose="email_verification",
        expires_at=datetime.now(timezone.utc) + timedelta(hours=24)
    )
    db.session.add(token)
    db.session.commit()
    return token


@pytest.fixture
def expired_token(db, test_user):
    """Create an expired verification token."""
    token = VerificationToken(
        user_id=test_user.id,
        token="expired-verification-token-12345",
        purpose="email_verification",
        expires_at=datetime.now(timezone.utc) - timedelta(hours=1)
    )
    db.session.add(token)
    db.session.commit()
    return token


@pytest.fixture
def password_reset_token(db, test_user):
    """Create a valid password reset token."""
    token = VerificationToken(
        user_id=test_user.id,
        token="valid-reset-token-12345",
        purpose="password_reset",
        expires_at=datetime.now(timezone.utc) + timedelta(minutes=30)
    )
    db.session.add(token)
    db.session.commit()
    return token


# ============================================================================
# AUTH HEADER FIXTURES
# ============================================================================

@pytest.fixture
def auth_headers(user_token):
    """Return headers with Bearer token."""
    return {
        'Authorization': f'Bearer {user_token}'
    }


@pytest.fixture
def specialist_auth_headers(specialist_token):
    """Return headers with specialist Bearer token."""
    return {
        'Authorization': f'Bearer {specialist_token}'
    }


@pytest.fixture
def admin_auth_headers(admin_token_with_password):
    """Return headers with admin Bearer token."""
    return {
        'Authorization': f'Bearer {admin_token_with_password}'
    }