from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from marshmallow import ValidationError

from app.models import Question, User
from app.extensions import db
from app.rbac import current_user_is_admin


from . import questions_bp
from .schemas import (
    questions_schema,
    question_schema,
    question_input_schema,
    question_update_schema,
)

@questions_bp.route("", methods=["GET"])
@jwt_required()
def list_questions():
    """Returns the active question bank, ordered for questionnaire display."""
    questions = (
        Question.query
        .filter_by(is_active=True)
        .order_by(Question.category, Question.display_order)
        .all()
    )

    return jsonify(questions_schema.dump(questions)), 200


@questions_bp.route("", methods=["POST"])
@jwt_required()
def create_question():
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    try:
        payload = question_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    question = Question(created_by=int(get_jwt_identity()), **payload)
    db.session.add(question)
    db.session.commit()

    return jsonify(question_schema.dump(question)), 201


@questions_bp.route("/<int:question_id>", methods=["PUT"])
@jwt_required()
def update_question(question_id):
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    question = db.get_or_404(Question, question_id)

    try:
        payload = question_update_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    for field, value in payload.items():
        setattr(question, field, value)

    db.session.commit()

    return jsonify(question_schema.dump(question)), 200


@questions_bp.route("/<int:question_id>", methods=["DELETE"])
@jwt_required()
def delete_question(question_id):
    """Soft delete only — a hard delete would risk cascading into
    historical assessment_responses. See Question.is_active."""
    if not current_user_is_admin():
        return jsonify({"error": "Forbidden"}), 403

    question = db.get_or_404(Question, question_id)
    question.is_active = False
    db.session.commit()

    return jsonify({"message": "Question retired"}), 200

