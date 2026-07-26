from flask import jsonify, request
from flask_jwt_extended import jwt_required

from app.extensions import db
from app.models import Specialist

from . import specialists_bp
from .schemas import specialists_schema, specialist_schema


def _approved_query():
   
    return Specialist.query.filter(
        db.func.lower(Specialist.verification_status) == "approved"
    )


@specialists_bp.route("", methods=["GET"])
@jwt_required()
def list_specialists():
    query = _approved_query()

    specialization = request.args.get("specialization")
    if specialization:
        query = query.filter(
            db.func.lower(Specialist.specialization) == specialization.lower()
        )

    specialists = query.order_by(Specialist.specialization).all()
    return jsonify(specialists_schema.dump(specialists)), 200


@specialists_bp.route("/<int:specialist_id>", methods=["GET"])
@jwt_required()
def get_specialist(specialist_id):
    specialist = _approved_query().filter_by(id=specialist_id).first()

    if specialist is None:
        # Deliberately 404, not 403 — an unapproved profile should look
        # like it doesn't exist to a client browsing the directory.
        return jsonify({"error": "Specialist not found"}), 404

    return jsonify(specialist_schema.dump(specialist)), 200