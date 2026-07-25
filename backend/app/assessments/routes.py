from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Assessment, AssessmentResponse, Question

from . import assessments_bp
from .schemas import assessment_input_schema, assessment_out_schema
from .scoring import score_from_option, wellness_level_from_score


@assessments_bp.route("", methods=["POST"])
@jwt_required()
def submit_assessment():
    """
    Body shape:
    {
        "responses": [
            {"question_id": 1, "selected_option": "Often"},
            {"question_id": 2, "selected_option": "Rarely"}
        ]
    }
    """
    # Assumes get_jwt_identity() returns the user's id — confirm
    # against Deogracious's auth implementation once /login exists.
    user_id = get_jwt_identity()

    try:
        payload = assessment_input_schema.load(request.get_json() or {})
    except ValidationError as err:
        return jsonify({"errors": err.messages}), 400

    question_ids = [r["question_id"] for r in payload["responses"]]
    existing_ids = {
        q.id for q in Question.query.filter(Question.id.in_(question_ids)).all()
    }
    missing = set(question_ids) - existing_ids
    if missing:
        return jsonify({"error": f"Unknown question_id(s): {sorted(missing)}"}), 400

    total_score = 0
    response_rows = []

    for item in payload["responses"]:
        try:
            score = score_from_option(item["selected_option"])
        except ValueError as e:
            return jsonify({"error": str(e)}), 400

        total_score += score
        response_rows.append({
            "question_id": item["question_id"],
            "selected_option": item["selected_option"],
            "score": score,
        })

    assessment = Assessment(
        user_id=user_id,
        total_score=total_score,
        wellness_level=wellness_level_from_score(total_score),
    )
    db.session.add(assessment)
    db.session.flush()  # populate assessment.id before creating responses

    for row in response_rows:
        db.session.add(AssessmentResponse(assessment_id=assessment.id, **row))

    db.session.commit()

    return jsonify(assessment_out_schema.dump(assessment)), 201


@assessments_bp.route("/<int:assessment_id>", methods=["GET"])
@jwt_required()
def get_assessment(assessment_id):
    assessment = db.get_or_404(Assessment, assessment_id)

    user_id = get_jwt_identity()
    if str(assessment.user_id) != str(user_id):
        return jsonify({"error": "Forbidden"}), 403

    return jsonify(assessment_out_schema.dump(assessment)), 200