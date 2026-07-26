from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Workshop, WorkshopRegistration

from . import workshops_bp
from .schemas import (
    workshops_schema,
    registration_input_schema,
    registration_schema,
    registrations_schema,
)


@workshops_bp.route("", methods=["GET"])
@jwt_required()
def list_workshops():
    workshops = Workshop.query.order_by(Workshop.event_date).all()
    return jsonify(workshops_schema.dump(workshops)), 200


@workshops_bp.route("/register", methods=["POST"])
@jwt_required()
def register_for_workshop():
    """
    No capacity/waitlist logic - Deogracious confirmed no capacity
    management in the MVP, so this doesn't check Workshop.capacity
    even though the column exists.
    """
    user_id = int(get_jwt_identity())

    try:
        payload = registration_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    workshop = db.get_or_404(Workshop, payload["workshop_id"])

    existing = WorkshopRegistration.query.filter_by(
        user_id=user_id, workshop_id=workshop.id
    ).first()

    if existing is not None:
        if existing.status.lower() == "cancelled":
            # Reactivate the same row rather than creating a duplicate
            existing.status = "registered"
            db.session.commit()
            return jsonify(registration_schema.dump(existing)), 200

        return jsonify(
            {"error": f"Already {existing.status.lower()} for this workshop"}
        ), 400

    registration = WorkshopRegistration(
        user_id=user_id,
        workshop_id=workshop.id,
        status="registered",
    )
    db.session.add(registration)
    db.session.commit()

    return jsonify(registration_schema.dump(registration)), 201


@workshops_bp.route("/register/<int:registration_id>", methods=["DELETE"])
@jwt_required()
def cancel_registration(registration_id):
    """Soft cancel - sets status to 'cancelled', doesn't delete the row,
    so attendance/registration history is preserved."""
    user_id = int(get_jwt_identity())
    registration = db.get_or_404(WorkshopRegistration, registration_id)

    if registration.user_id != user_id:
        return jsonify({"error": "Forbidden"}), 403

    registration.status = "cancelled"
    db.session.commit()

    return jsonify(registration_schema.dump(registration)), 200


@workshops_bp.route("/registered", methods=["GET"])
@jwt_required()
def list_my_registrations():
  
    user_id = int(get_jwt_identity())
    registrations = (
        WorkshopRegistration.query
        .filter_by(user_id=user_id)
        .order_by(WorkshopRegistration.registered_at.desc())
        .all()
    )
    return jsonify(registrations_schema.dump(registrations)), 200