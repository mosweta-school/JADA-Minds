from flask import Blueprint

specialists_bp = Blueprint("specialists", __name__, url_prefix="/specialists")

from . import routes  # noqa: E402,F401