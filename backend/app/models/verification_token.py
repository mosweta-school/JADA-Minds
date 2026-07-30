# backend/app/models/verification_token.py

"""
Verification token model for email verification, password reset, and MFA.
"""

from datetime import datetime, timezone
from app.extensions import db


def utc_now():
    """Get current UTC time with timezone."""
    return datetime.now(timezone.utc)


def ensure_naive(dt):
    """Ensure datetime is timezone-naive for SQLite storage."""
    if dt is None:
        return None
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc)
        dt = dt.replace(tzinfo=None)
    return dt


class VerificationToken(db.Model):
    """Email verification and password reset tokens."""
    
    __tablename__ = "verification_tokens"
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    token = db.Column(db.String(255), unique=True, nullable=False, index=True)
    purpose = db.Column(db.String(30), nullable=False)  # 'email_verification', 'password_reset', 'mfa'
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    used = db.Column(db.Boolean, default=False, nullable=False)
    used_at = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), 
                          default=utc_now,
                          nullable=False)

    # Use 'owner' instead of 'user' to avoid conflicts
    owner = db.relationship("User", back_populates="verification_tokens")
    
    def __init__(self, **kwargs):
        """Override __init__ to ensure datetime values are naive for SQLite."""
        if 'expires_at' in kwargs and kwargs['expires_at']:
            kwargs['expires_at'] = ensure_naive(kwargs['expires_at'])
        if 'used_at' in kwargs and kwargs['used_at']:
            kwargs['used_at'] = ensure_naive(kwargs['used_at'])
        if 'created_at' in kwargs and kwargs['created_at']:
            kwargs['created_at'] = ensure_naive(kwargs['created_at'])
        super(VerificationToken, self).__init__(**kwargs)