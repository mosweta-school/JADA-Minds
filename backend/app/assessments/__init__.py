from flask import Blueprint

assessments_bp = Blueprint("assessments", __name__, url_prefix="/assessment")

from . import routes  # noqa: E402,F401