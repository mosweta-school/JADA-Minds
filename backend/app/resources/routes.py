from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Resource, User

from . import resources_bp
from .schemas import (
    resources_schema,
    resource_schema,
    resource_input_schema,
    resource_update_schema,
)


def _current_user_is_admin() -> bool:
    """
    Checks a 'role' JWT claim first, falls back to a DB lookup by identity. Confirm which path is
    actually needed once Deogracious's /login exists.
    """
    role = get_jwt().get("role")
    if role is not None:
        return role == "admin"

    user = db.session.get(User, int(get_jwt_identity()))
    return user is not None and user.role == "admin"


@resources_bp.route("", methods=["GET"])
@jwt_required()
def list_resources():
    resources = (
        Resource.query
        .filter_by(is_active=True)
        .order_by(Resource.category, Resource.title)
        .all()
    )

    return jsonify(resources_schema.dump(resources)), 200


@resources_bp.route("", methods=["POST"])
@jwt_required()
def create_resource():
    if not _current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    try:
        payload = resource_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    resource = Resource(created_by=int(get_jwt_identity()), **payload)
    db.session.add(resource)
    db.session.commit()

    return jsonify(resource_schema.dump(resource)), 201


@resources_bp.route("/<int:resource_id>", methods=["PUT"])
@jwt_required()
def update_resource(resource_id):
    if not _current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    resource = db.get_or_404(Resource, resource_id)

    try:
        payload = resource_update_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    for field, value in payload.items():
        setattr(resource, field, value)

    db.session.commit()

    return jsonify(resource_schema.dump(resource)), 200


@resources_bp.route("/<int:resource_id>", methods=["DELETE"])
@jwt_required()
def delete_resource(resource_id):
   
    if not _current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    resource = db.get_or_404(Resource, resource_id)
    resource.is_active = False
    db.session.commit()

    return jsonify({"message": "Resource retired"}), 200