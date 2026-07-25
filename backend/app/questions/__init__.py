from flask import Blueprint

questions_bp = Blueprint("questions", __name__, url_prefix="/questions")

from . import routes  # noqa: E402,F401