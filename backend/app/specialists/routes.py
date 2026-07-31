from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Specialist, User
from app.rbac import current_user_is_admin

from . import specialists_bp
from .schemas import (
    specialists_schema,
    specialist_schema,
    specialist_application_input_schema,
    specialist_profile_update_schema,
    specialist_own_profile_schema,
    specialist_application_admin_schema,
    specialist_applications_admin_schema,
    specialist_verification_input_schema,
) 

_RESUBMISSION_ONLY_FIELDS = {
    "registration_number",
    "national_id_url",
    "degree_certificate_url",
    "professional_license_url",
}
 

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

 
@specialists_bp.route("/applications", methods=["GET"])
@jwt_required()
def list_applications():
    """
    Admin-only queue of specialist applications, including the
    private documents SpecialistSchema hides from the public
    directory. Defaults to pending so the queue opens on what needs
    action; ?status=all (or any other status) widens/narrows it.
    """
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403
 
    status = request.args.get("status", "pending")
 
    query = Specialist.query
    if status.lower() != "all":
        query = query.filter(
            db.func.lower(Specialist.verification_status) == status.lower()
        )
 
    applications = query.order_by(Specialist.created_at.asc()).all()
    return jsonify(specialist_applications_admin_schema.dump(applications)), 200
 
 
@specialists_bp.route("/applications/<int:specialist_id>", methods=["GET"])
@jwt_required()
def get_application(specialist_id):
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403
 
    specialist = db.get_or_404(Specialist, specialist_id)
    return jsonify(specialist_application_admin_schema.dump(specialist)), 200
 
 
@specialists_bp.route("/applications/<int:specialist_id>/verification", methods=["PUT"])
@jwt_required()
def review_application(specialist_id):
    """
    Approve or reject a specialist's application. Rejecting requires
    a rejection_reason so the specialist knows what to fix before
    resubmitting via PUT /specialists/me.
    """
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403
 
    specialist = db.get_or_404(Specialist, specialist_id)
 
    try:
        payload = specialist_verification_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400
 
    new_status = payload["verification_status"]
    reason = payload.get("rejection_reason")
 
    if new_status == "rejected" and not reason:
        return jsonify(
            {"errors": {"rejection_reason": ["Required when rejecting an application."]}}
        ), 400
 
    specialist.verification_status = new_status
    specialist.rejection_reason = reason if new_status == "rejected" else None
    db.session.commit()
 
    return jsonify(specialist_application_admin_schema.dump(specialist)), 200
 


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
    specialization/bio are always editable. Document fields and
    registration_number are only accepted when the application was
    rejected - that's the resubmission path, and it puts the
    application back to "pending" so an admin re-reviews it.
    """
    specialist = _get_own_specialist()
    if specialist is None:
        return jsonify({"error": "No specialist application found"}), 404
 
    try:
        payload = specialist_profile_update_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    is_resubmission = specialist.verification_status.lower() == "rejected"
    attempted_restricted_fields = _RESUBMISSION_ONLY_FIELDS & payload.keys()
 
    if attempted_restricted_fields and not is_resubmission:
        return jsonify({
            "error": "Documents and registration number can only be "
                     "changed when resubmitting a rejected application"
        }), 400

    for field, value in payload.items():
        setattr(specialist, field, value)

    if is_resubmission and attempted_restricted_fields:
        specialist.verification_status = "pending"
        specialist.rejection_reason = None

    db.session.commit()

    return jsonify(specialist_own_profile_schema.dump(specialist)), 200