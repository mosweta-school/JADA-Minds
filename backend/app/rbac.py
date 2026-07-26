from flask_jwt_extended import get_jwt, get_jwt_identity

from app.extensions import db
from app.models import User


def current_user_is_admin() -> bool:
    """
    Checks a 'role' JWT claim first, falls back to a DB lookup by
    identity. Confirm which path is actually needed once Deogracious's
    /login exists and confirms whether it sets that claim.
    """
    role = get_jwt().get("role")
    if role is not None:
        return role == "admin"

    user = db.session.get(User, int(get_jwt_identity()))
    return user is not None and user.role == "admin"