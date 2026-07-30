from flask import Blueprint

assessments_bp = Blueprint("assessments", __name__, url_prefix="/assessment")

results_bp = Blueprint("results", __name__)

from . import routes  # noqa: E402,F401