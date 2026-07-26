from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Specialist, User

from . import specialists_bp
from .schemas import (
    specialists_schema,
    specialist_schema,
    specialist_application_input_schema,
    specialist_profile_update_schema,
    specialist_own_profile_schema,
) 


def _approved_query():
   
    return Specialist.query.filter(
        db.func.lower(Specialist.verification_status) == "approved"
    )


def _get_own_specialist():
    user_id = int(get_jwt_identity())
    return Specialist.query.filter_by(user_id=user_id).first()
 
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


@specialists_bp.route("", methods=["POST"])
@jwt_required()
def submit_application():
    """
    Lets a user with role="specialist" submit their verification
    application. This only handles the application/profile itself -
    assumes Deogracious's registration flow is what sets
    role="specialist" on the account in the first place.
    """
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)
 
    if user is None or user.role != "specialist":
        return jsonify(
            {"error": "Only specialist accounts can submit an application"}
        ), 403
 
    existing = Specialist.query.filter_by(user_id=user_id).first()
    if existing is not None:
        return jsonify({
            "error": "Application already exists",
            "verification_status": existing.verification_status,
        }), 400
 
    try:
        payload = specialist_application_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
 
    specialist = Specialist(
        user_id=user_id, verification_status="pending", **payload
    )
    db.session.add(specialist)
    db.session.commit()
 
    return jsonify(specialist_own_profile_schema.dump(specialist)), 201
 
 
@specialists_bp.route("/me", methods=["GET"])
@jwt_required()
def get_my_specialist_profile():
    specialist = _get_own_specialist()
    if specialist is None:
        return jsonify({"error": "No specialist application found"}), 404
 
    return jsonify(specialist_own_profile_schema.dump(specialist)), 200
 
 
@specialists_bp.route("/me", methods=["PUT"])
@jwt_required()
def update_my_specialist_profile():
    """
    Only specialization/bio are editable here — not the verification
    documents or verification_status itself. Resubmitting documents
    after a rejection isn't built yet, flagged as a gap for later.
    """
    specialist = _get_own_specialist()
    if specialist is None:
        return jsonify({"error": "No specialist application found"}), 404
 
    try:
        payload = specialist_profile_update_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
 
    for field, value in payload.items():
        setattr(specialist, field, value)
 
    db.session.commit()
 
    return jsonify(specialist_own_profile_schema.dump(specialist)), 200