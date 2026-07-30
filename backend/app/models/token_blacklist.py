# backend/app/models/token_blacklist.py

from datetime import datetime, timezone
from app.extensions import db
import logging
from sqlalchemy import inspect

logger = logging.getLogger(__name__)


class TokenBlacklist(db.Model):
    """Blacklisted JWT tokens."""
    
    __tablename__ = "token_blacklist"
    
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), unique=True, nullable=False, index=True)
    token_type = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False, index=True)
    revoked_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )
    expires_at = db.Column(db.DateTime(timezone=True), nullable=False)
    
    owner = db.relationship("User", back_populates="blacklisted_tokens")


def is_token_revoked(jwt_payload):
    """
    Check if a token is revoked.
    
    Args:
        jwt_payload: The JWT payload containing the jti
        
    Returns:
        bool: True if token is revoked, False otherwise
    """
    jti = jwt_payload.get("jti")
    if not jti:
        return False
    
    try:
        #  Check if table exists first to avoid errors in tests
        inspector = inspect(db.engine)
        if not inspector.has_table('token_blacklist'):
            return False
        
        return TokenBlacklist.query.filter_by(jti=jti).first() is not None
    except Exception as e:
        logger.error(f"Error checking if token is revoked: {e}")
        return False


def add_token_to_blacklist(jti, token_type, user_id, expires_at):
    """
    Add a token to the blacklist.
    
    Args:
        jti: JWT ID
        token_type: 'access' or 'refresh'
        user_id: User ID
        expires_at: Token expiration time
    """
    blacklisted = TokenBlacklist(
        jti=jti,
        token_type=token_type,
        user_id=user_id,
        expires_at=expires_at
    )
    db.session.add(blacklisted)
    db.session.commit()
    return blacklisted