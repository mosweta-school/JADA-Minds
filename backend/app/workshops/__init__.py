from flask import Blueprint

workshops_bp = Blueprint("workshops", __name__, url_prefix="/workshops")

from . import routes  # noqa: E402,F401