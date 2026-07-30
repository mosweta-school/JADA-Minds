# backend/app/auth.py

"""
Authentication module for JADA Minds.
ALL auth logic in ONE file for simplicity and easy testing.
"""
# backend/app/auth.py

import requests  #  Add this import at the top

from flask import current_app
import secrets
import re
from datetime import datetime, timezone, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token
from app.extensions import db
from app.models import User, VerificationToken, TokenBlacklist
from app.email import send_verification_email, send_welcome_email, send_password_reset_email, send_mfa_email


# ============================================================================
# CONSTANTS
# ============================================================================

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128
SPECIAL_CHARACTERS = r'[!@#$%^&*()_\-+=\[\]{}|\\:;"\'<>,.?/~`]'
MAX_LOGIN_ATTEMPTS = 5
ACCOUNT_LOCK_MINUTES = 15
MFA_MAX_ATTEMPTS = 5
MFA_LOCK_MINUTES = 15


# ============================================================================
# DATETIME HELPERS - CRITICAL FOR SQLITE
# ============================================================================

def utc_now():
    """Get current UTC time with timezone."""
    return datetime.now(timezone.utc)


def ensure_aware(dt):
    """
    Ensure datetime is timezone-aware.
    If naive, assume UTC.
    This is critical for SQLite which doesn't store timezone info.
    """
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt


def ensure_naive(dt):
    """
    Ensure datetime is timezone-naive for SQLite storage.
    Converts to UTC and removes timezone info.
    """
    if dt is None:
        return None
    if dt.tzinfo is not None:
        # Convert to UTC if not already
        dt = dt.astimezone(timezone.utc)
        # Remove timezone info for SQLite
        dt = dt.replace(tzinfo=None)
    return dt


# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

from flask import current_app, request

# Add this function to auth.py
def google_login(credential):
    """
    Authenticate user with Google OAuth.
    
    Args:
        credential: Google ID token (access token from frontend)
        
    Returns:
        tuple: (response_data, status_code)
    """
    try:
        #  Verify Google token with Google's API
        # Note: The frontend sends an access token, not an ID token
        # We need to use the userinfo endpoint to get user data
        headers = {
            'Authorization': f'Bearer {credential}'
        }
        
        #  Get user info from Google using the access token
        response = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers=headers,
            timeout=10
        )
        
        if response.status_code != 200:
            current_app.logger.error(f"Google token verification failed: {response.text}")
            return {"error": "Invalid Google token"}, 401
        
        user_info = response.json()
        email = user_info.get('email')
        full_name = user_info.get('name', 'Google User')
        email_verified = user_info.get('verified_email', False)
        
        if not email:
            return {"error": "Email not provided by Google"}, 400
        
        #  Normalize email
        email = normalize_email(email)
        
        #  Check if user exists
        user = User.query.filter_by(email=email).first()
        
        if not user:
            #  Create new user with Google info
            random_password = secrets.token_urlsafe(32)
            user = User(
                full_name=full_name,
                email=email,
                role='client',
                email_verified=email_verified,
                phone=None
            )
            user.set_password(random_password)
            db.session.add(user)
            db.session.commit()
            current_app.logger.info(f"New user created via Google OAuth: {email}")
        else:
            #  Update existing user's name if changed
            if user.full_name != full_name:
                user.full_name = full_name
                db.session.commit()
        
        #  Update last login
        user.last_login = ensure_naive(utc_now())
        db.session.commit()
        
        #  Generate tokens
        return generate_tokens(user)
        
    except requests.RequestException as e:
        current_app.logger.error(f"Google OAuth request error: {e}")
        return {"error": "Google authentication service unavailable"}, 503
    except Exception as e:
        current_app.logger.error(f"Google login error: {e}")
        return {"error": "Google authentication failed"}, 401


def get_user_by_id(user_id):
    """
    Get a user by ID using db.session.get() instead of User.query.get().
    This avoids SQLAlchemy legacy warnings.
    """
    return db.session.get(User, user_id)


def generate_token():
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)


def generate_mfa_code():
    """Generate a 6-digit MFA code."""
    return ''.join(secrets.choice('0123456789') for _ in range(6))


def normalize_email(email):
    """Normalize email: lowercase and strip whitespace."""
    return email.strip().lower()


def validate_email_format(email):
    """Basic email validation."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email.strip().lower()))


def validate_password_strength(password):
    """Validate password against security policy. Returns (bool, message)."""
    if len(password) < PASSWORD_MIN_LENGTH:
        return False, f"Password must be at least {PASSWORD_MIN_LENGTH} characters."
    if len(password) > PASSWORD_MAX_LENGTH:
        return False, f"Password must not exceed {PASSWORD_MAX_LENGTH} characters."
    if not any(c.isupper() for c in password):
        return False, "Password must contain at least one uppercase letter."
    if not any(c.islower() for c in password):
        return False, "Password must contain at least one lowercase letter."
    if not any(c.isdigit() for c in password):
        return False, "Password must contain at least one digit."
    if not re.search(SPECIAL_CHARACTERS, password):
        return False, "Password must contain at least one special character."
    return True, "Password is valid."


def find_valid_token(token, purpose):
    """Find a valid, unused, non-expired token."""
    #  Debug logging
    current_app.logger.info(f"Looking for token: {token[:10]}... (purpose: {purpose})")
    
    token_obj = VerificationToken.query.filter_by(
        token=token,
        purpose=purpose,
        used=False
    ).first()
    
    if not token_obj:
        current_app.logger.warning(f"Token not found or already used: {token[:10]}...")
        return None
    
    #  Ensure both datetimes are timezone-aware before comparison
    expires_at = ensure_aware(token_obj.expires_at)
    now = utc_now()
    
    if expires_at < now:
        current_app.logger.warning(f"Token expired: {token[:10]}... (expires: {expires_at}, now: {now})")
        return None
    
    current_app.logger.info(f"Token found and valid: {token[:10]}...")
    return token_obj


def mark_token_used(token_obj):
    """Mark a token as used."""
    token_obj.used = True
    token_obj.used_at = ensure_naive(utc_now())
    db.session.commit()


def create_verification_token(user_id, purpose, expiry_hours=24):
    """Create a verification token."""
    token = generate_token()
    #  Store as naive UTC for SQLite
    expires_at = ensure_naive(utc_now() + timedelta(hours=expiry_hours))
    
    #  Debug logging
    current_app.logger.info(f"Creating token for user {user_id}, purpose: {purpose}, expires: {expires_at}")
    
    verification = VerificationToken(
        user_id=user_id,
        token=token,
        purpose=purpose,
        expires_at=expires_at
    )
    db.session.add(verification)
    db.session.commit()
    
    current_app.logger.info(f"Token created successfully: {token[:10]}...")
    return token


# ============================================================================
# AUTHENTICATION FUNCTIONS
# ============================================================================

def register_user(full_name, email, password, phone=None, role='client'):
    """
    Register a new user.
    
    Returns:
        tuple: (response_data, status_code)
    """
    # Validate email
    email = normalize_email(email)
    if not validate_email_format(email):
        return {"error": "Invalid email address."}, 400
    
    # Validate password
    valid, message = validate_password_strength(password)
    if not valid:
        return {"error": message}, 400
    
    # Check if user already exists
    existing = User.query.filter_by(email=email).first()
    if existing:
        return {"error": "Email already registered."}, 409
    
    # Only allow client or specialist roles (no admin via public registration)
    if role not in ['client', 'specialist']:
        role = 'client'
    
    # Create user
    user = User(
        full_name=full_name.strip(),
        email=email,
        phone=phone,
        role=role
    )
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    
    # Create verification token
    token = create_verification_token(user.id, 'email_verification', 24)
    
    # Send verification email
    try:
        send_verification_email(user.email, token)
    except Exception as e:
        current_app.logger.error(f"Failed to send verification email: {e}")
    
    return {
        "user": user.to_dict(),
        "message": "User registered. Please verify your email.",
        "verification_email_sent": True
    }, 201


def verify_email(token):
    """
    Verify user's email address using token.
    
    Returns:
        tuple: (response_data, status_code)
    """
    token_obj = find_valid_token(token, 'email_verification')
    
    if not token_obj:
        return {"error": "Invalid or expired verification token."}, 400
    
    # Mark token as used
    mark_token_used(token_obj)
    
    # Mark user as verified
    user = get_user_by_id(token_obj.user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    if user.email_verified:
        return {"message": "Email already verified.", "verified": True}, 200
    
    user.email_verified = True
    db.session.commit()
    
    # Send welcome email
    try:
        send_welcome_email(user.email, user.full_name)
    except Exception as e:
        current_app.logger.error(f"Failed to send welcome email: {e}")
    
    return {"message": "Email verified successfully.", "verified": True}, 200


def login_user(email, password):
    """
    Authenticate a user.
    
    Returns:
        tuple: (response_data, status_code)
    """
    email = normalize_email(email)
    user = User.query.filter_by(email=email).first()
    
    # User not found
    if not user:
        return {"error": "Invalid email or password."}, 401
    
    # Check account lock
    if user.is_account_locked():
        locked_until = ensure_aware(user.account_locked_until)
        remaining = locked_until - utc_now()
        minutes = int(remaining.total_seconds() / 60) + 1
        return {"error": f"Account locked. Try again in {minutes} minutes."}, 423
    
    # Check if active
    if not user.is_active:
        return {"error": "Account is deactivated."}, 403
    
    # Verify password
    if not user.check_password(password):
        user.increment_failed_attempts()
        db.session.commit()
        return {"error": "Invalid email or password."}, 401
    
    # Check if email verified
    if not user.email_verified:
        # Resend verification email
        token = create_verification_token(user.id, 'email_verification', 24)
        try:
            send_verification_email(user.email, token)
        except Exception as e:
            current_app.logger.error(f"Failed to resend verification email: {e}")
        
        return {"error": "Please verify your email. A new verification link has been sent."}, 403
    
    # Reset failed attempts
    user.reset_failed_attempts()
    user.last_login = ensure_naive(utc_now())
    db.session.commit()
    
    # Check if MFA is enabled
    if user.mfa_enabled:
        return handle_mfa_login(user)
    
    # Generate tokens
    return generate_tokens(user)


def generate_tokens(user):
    """
    Generate access and refresh tokens for a user.
    
    Returns:
        tuple: (response_data, status_code)
    """
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": user.to_dict(),
        "requires_mfa": False
    }, 200


# ============================================================================
# MFA FUNCTIONS
# ============================================================================

def handle_mfa_login(user):
    """
    Handle MFA login flow.
    
    Returns:
        tuple: (response_data, status_code)
    """
    # Generate MFA code
    code = generate_mfa_code()
    # Store as naive UTC for SQLite
    expires_at = ensure_naive(utc_now() + timedelta(minutes=10))
    
    # Delete old MFA tokens
    VerificationToken.query.filter_by(
        user_id=user.id,
        purpose='mfa'
    ).delete()
    
    # Create new MFA token
    mfa_token = VerificationToken(
        user_id=user.id,
        token=code,
        purpose='mfa',
        expires_at=expires_at
    )
    db.session.add(mfa_token)
    db.session.commit()
    
    # Send MFA code (don't fail if email fails)
    try:
        send_mfa_email(user.email, code)
    except Exception as e:
        current_app.logger.error(f"Failed to send MFA email: {e}")
    
    # Return pre-auth token (short-lived, MFA pending)
    access_token = create_access_token(
        identity=str(user.id),
        expires_delta=timedelta(minutes=5),
        additional_claims={"role": user.role, "mfa_pending": True}
    )
    
    return {
        "requires_mfa": True,
        "pre_auth_token": access_token,
        "user": user.to_dict()
    }, 200


def verify_mfa_login(user_id, code):
    """
    Verify MFA code during login.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    # Check MFA lock
    mfa_locked_until = ensure_aware(user.mfa_locked_until)
    if mfa_locked_until and mfa_locked_until > utc_now():
        return {"error": "Too many MFA attempts. Try again later."}, 429
    
    # Find valid MFA token
    mfa_token = VerificationToken.query.filter_by(
        user_id=user.id,
        token=code,
        purpose='mfa',
        used=False
    ).first()
    
    if not mfa_token:
        user.mfa_attempts += 1
        if user.mfa_attempts >= MFA_MAX_ATTEMPTS:
            user.mfa_locked_until = ensure_naive(utc_now() + timedelta(minutes=MFA_LOCK_MINUTES))
        db.session.commit()
        return {"error": "Invalid MFA code."}, 401
    
    # Ensure both datetimes are timezone-aware before comparison
    expires_at = ensure_aware(mfa_token.expires_at)
    if expires_at < utc_now():
        return {"error": "MFA code has expired."}, 401
    
    # Mark token as used
    mark_token_used(mfa_token)
    
    # Reset MFA attempts
    user.mfa_attempts = 0
    user.mfa_locked_until = None
    user.last_login = ensure_naive(utc_now())
    db.session.commit()
    
    # Generate full tokens
    return generate_tokens(user)


def enable_mfa(user_id):
    """
    Enable MFA for user.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    # Generate MFA code
    code = generate_mfa_code()
    # Store as naive UTC for SQLite
    expires_at = ensure_naive(utc_now() + timedelta(minutes=10))
    
    # Delete old MFA tokens
    VerificationToken.query.filter_by(
        user_id=user.id,
        purpose='mfa'
    ).delete()
    
    # Create new MFA token
    mfa_token = VerificationToken(
        user_id=user.id,
        token=code,
        purpose='mfa',
        expires_at=expires_at
    )
    db.session.add(mfa_token)
    db.session.commit()
    
    # Send MFA code (don't fail if email fails)
    try:
        send_mfa_email(user.email, code)
    except Exception as e:
        current_app.logger.error(f"Failed to send MFA email: {e}")
    
    return {"message": "MFA code sent to your email.", "code_sent": True}, 200


def verify_mfa_setup(user_id, code):
    """
    Verify MFA setup and enable MFA.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    # Find valid MFA token
    mfa_token = VerificationToken.query.filter_by(
        user_id=user.id,
        token=code,
        purpose='mfa',
        used=False
    ).first()
    
    if not mfa_token:
        return {"error": "Invalid MFA code."}, 401
    
    # Ensure both datetimes are timezone-aware before comparison
    expires_at = ensure_aware(mfa_token.expires_at)
    if expires_at < utc_now():
        return {"error": "MFA code has expired."}, 401
    
    # Mark token as used
    mark_token_used(mfa_token)
    
    # Enable MFA
    user.mfa_enabled = True
    db.session.commit()
    
    return {"message": "MFA enabled successfully.", "mfa_enabled": True}, 200


def disable_mfa(user_id):
    """
    Disable MFA for user.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    user.mfa_enabled = False
    
    # Delete all MFA tokens
    VerificationToken.query.filter_by(
        user_id=user.id,
        purpose='mfa'
    ).delete()
    
    db.session.commit()
    
    return {"message": "MFA disabled successfully.", "mfa_enabled": False}, 200


# ============================================================================
# TOKEN MANAGEMENT
# ============================================================================

def refresh_access_token(user_id):
    """
    Refresh access token.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user or not user.is_active:
        return {"error": "User not found or inactive."}, 401
    
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )
    
    return {"access_token": access_token}, 200


def logout_user(jti, user_id):
    """
    Logout user by blacklisting the token.
    
    Returns:
        tuple: (response_data, status_code)
    """
    blacklisted = TokenBlacklist(
        jti=jti,
        token_type='access',
        user_id=user_id,
        expires_at=ensure_naive(utc_now() + timedelta(days=1))
    )
    db.session.add(blacklisted)
    db.session.commit()
    
    return {"message": "Logged out successfully."}, 200


# ============================================================================
# PASSWORD MANAGEMENT
# ============================================================================
def forgot_password(email):
    """
    Initiate password reset.
    
    Returns:
        tuple: (response_data, status_code)
    """
    email = normalize_email(email)
    user = User.query.filter_by(email=email).first()
    
    # Always return success for security (don't reveal if user exists)
    if user:
        #  Delete old tokens
        VerificationToken.query.filter_by(
            user_id=user.id,
            purpose='password_reset'
        ).delete()
        
        #  Create new token with 30 minute expiry
        token = create_verification_token(user.id, 'password_reset', 0.5)  # 0.5 hours = 30 minutes
        
        #  Debug logging
        current_app.logger.info(f"Password reset token created for {email}: {token[:10]}...")
        
        # Send reset email
        try:
            send_password_reset_email(user.email, token)
            current_app.logger.info(f"Password reset email sent to {email}")
        except Exception as e:
            current_app.logger.error(f"Failed to send password reset email: {e}")
    else:
        current_app.logger.info(f"Password reset requested for non-existent email: {email}")
    
    return {"message": "If an account exists, a reset link has been sent."}, 200


def reset_password(token, new_password):
    """
    Reset password using token.
    
    Returns:
        tuple: (response_data, status_code)
    """
    #  Debug logging
    current_app.logger.info(f"Reset password attempt with token: {token[:10]}...")
    
    # Validate password
    valid, message = validate_password_strength(new_password)
    if not valid:
        return {"error": message}, 400
    
    # Find valid token
    token_obj = find_valid_token(token, 'password_reset')
    
    if not token_obj:
        #  Check if token exists but is used or expired for better error message
        existing_token = VerificationToken.query.filter_by(
            token=token,
            purpose='password_reset'
        ).first()
        
        if existing_token:
            if existing_token.used:
                current_app.logger.warning(f"Token already used: {token[:10]}...")
                return {"error": "This reset link has already been used. Please request a new one."}, 400
            else:
                # Token exists but is expired
                current_app.logger.warning(f"Token expired: {token[:10]}...")
                return {"error": "This reset link has expired. Please request a new one."}, 400
        else:
            current_app.logger.warning(f"Token not found: {token[:10]}...")
            return {"error": "Invalid reset token. Please request a new one."}, 400
    
    # Mark token as used
    mark_token_used(token_obj)
    
    # Update password
    user = get_user_by_id(token_obj.user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    user.set_password(new_password)
    user.password_changed_at = ensure_naive(utc_now())
    db.session.commit()
    
    current_app.logger.info(f"Password reset successful for user: {user.email}")
    return {"message": "Password reset successfully."}, 200


def change_password(user_id, current_password, new_password):
    """
    Change user's password (authenticated).
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    # Verify current password
    if not user.check_password(current_password):
        return {"error": "Current password is incorrect."}, 401
    
    # Validate new password
    valid, message = validate_password_strength(new_password)
    if not valid:
        return {"error": message}, 400
    
    # Check if new password is different
    if user.check_password(new_password):
        return {"error": "New password must be different from current password."}, 400
    
    # Update password
    user.set_password(new_password)
    user.password_changed_at = ensure_naive(utc_now())
    db.session.commit()
    
    return {"message": "Password changed successfully."}, 200


# ============================================================================
# PROFILE MANAGEMENT
# ============================================================================

def get_user_profile(user_id):
    """
    Get user profile.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    return user.to_dict(), 200


def update_user_profile(user_id, data):
    """
    Update user profile.
    
    Returns:
        tuple: (response_data, status_code)
    """
    user = get_user_by_id(user_id)
    if not user:
        return {"error": "User not found."}, 404
    
    # Update allowed fields
    if 'full_name' in data and data['full_name']:
        user.full_name = data['full_name'].strip()
    
    if 'phone' in data:
        user.phone = data['phone']
    
    db.session.commit()
    
    return user.to_dict(), 200