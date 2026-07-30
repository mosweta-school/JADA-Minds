# backend/app/models/user.py

from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db


def utc_now():
    """Get current UTC time with timezone."""
    return datetime.now(timezone.utc)


def ensure_aware(dt):
    """Ensure datetime is timezone-aware. If naive, assume UTC."""
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def ensure_naive(dt):
    """Ensure datetime is timezone-naive for SQLite storage."""
    if dt is None:
        return None
    if dt.tzinfo is not None:
        dt = dt.astimezone(timezone.utc)
        dt = dt.replace(tzinfo=None)
    return dt


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    password_hash = db.Column(db.String(255), nullable=False)

    # Account status
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    email_verified = db.Column(db.Boolean, default=False, nullable=False)
    
    # Security
    mfa_enabled = db.Column(db.Boolean, default=False, nullable=False)
    failed_login_attempts = db.Column(db.Integer, default=0, nullable=False)
    account_locked_until = db.Column(db.DateTime(timezone=True), nullable=True)
    
    # MFA tracking
    mfa_attempts = db.Column(db.Integer, default=0, nullable=False)
    mfa_locked_until = db.Column(db.DateTime(timezone=True), nullable=True)
    
    # Session invalidation
    password_changed_at = db.Column(db.DateTime(timezone=True), 
                                    default=utc_now,
                                    nullable=False)
    
    # Timestamps
    last_login = db.Column(db.DateTime(timezone=True), nullable=True)
    created_at = db.Column(db.DateTime, default=utc_now)
    updated_at = db.Column(db.DateTime, default=utc_now, onupdate=utc_now)

    # Relationships
    assessments = db.relationship("Assessment", back_populates="user", cascade="all, delete-orphan")
    workshop_registrations = db.relationship("WorkshopRegistration", back_populates="user", cascade="all, delete-orphan")
    workshops_created = db.relationship("Workshop", back_populates="creator")
    questions_created = db.relationship("Question", back_populates="creator")
    resources_created = db.relationship("Resource", back_populates="creator")
    specialist_profile = db.relationship("Specialist", back_populates="user", uselist=False, cascade="all, delete-orphan")
    
    # Auth relationships
    verification_tokens = db.relationship("VerificationToken", back_populates="owner", cascade="all, delete-orphan")
    blacklisted_tokens = db.relationship("TokenBlacklist", back_populates="owner", cascade="all, delete-orphan")

    def set_password(self, password):
        """Hash and set the password."""
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """Verify password against stored hash."""
        return check_password_hash(self.password_hash, password)

    def is_account_locked(self):
        """Check if account is currently locked."""
        if not self.account_locked_until:
            return False
        locked_until = ensure_aware(self.account_locked_until)
        return locked_until > utc_now()

    def increment_failed_attempts(self):
        """Increment failed login attempts and lock if needed."""
        self.failed_login_attempts += 1
        if self.failed_login_attempts >= 5:
            self.account_locked_until = ensure_naive(utc_now() + timedelta(minutes=15))
        return self.failed_login_attempts

    def reset_failed_attempts(self):
        """Reset failed login attempts."""
        self.failed_login_attempts = 0
        self.account_locked_until = None

    def is_mfa_locked(self):
        """Check if MFA is currently locked."""
        if not self.mfa_locked_until:
            return False
        locked_until = ensure_aware(self.mfa_locked_until)
        return locked_until > utc_now()

    def increment_mfa_attempts(self):
        """Increment MFA attempts and lock if threshold exceeded."""
        self.mfa_attempts += 1
        if self.mfa_attempts >= 5:
            self.mfa_locked_until = ensure_naive(utc_now() + timedelta(minutes=15))
        return self.mfa_attempts

    def reset_mfa_attempts(self):
        """Reset MFA attempts."""
        self.mfa_attempts = 0
        self.mfa_locked_until = None

    def update_last_login(self):
        """Update the last login timestamp."""
        self.last_login = ensure_naive(utc_now())

    def invalidate_sessions(self):
        """Invalidate all existing sessions."""
        self.password_changed_at = ensure_naive(utc_now())

    def to_dict(self):
        """Convert user to dictionary for API responses."""
        return {
            "id": self.id,
            "full_name": self.full_name,
            "email": self.email,
            "phone": self.phone,
            "role": self.role,
            "email_verified": self.email_verified,
            "mfa_enabled": self.mfa_enabled,
            "is_active": self.is_active,
            "last_login": self.last_login.isoformat() if self.last_login else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

    def __repr__(self):
        return f"<User {self.email} (role={self.role})>"