from collections import Counter, defaultdict
from statistics import mean

from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError

from app.extensions import db
from app.models import Assessment, AssessmentResponse, Question

from . import assessments_bp, results_bp    
from .schemas import(
    assessment_input_schema,
    assessment_out_schema,
    progress_history_schema,
) 
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

@results_bp.route("/results", methods=["GET"])
@jwt_required()
def get_latest_result():
    """Latest wellness result, without needing to know an assessment id."""
    user_id = get_jwt_identity()

    latest = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.desc())
        .first()
    )

    if latest is None:
        return jsonify({"error": "No assessments found"}), 404

    return jsonify(assessment_out_schema.dump(latest)), 200



def _category_breakdown(assessment_id):
    """Returns {category: subtotal_score} for one assessment's responses."""
    rows = (
        db.session.query(Question.category, AssessmentResponse.score)
        .join(AssessmentResponse, AssessmentResponse.question_id == Question.id)
        .filter(AssessmentResponse.assessment_id == assessment_id)
        .all()
    )
    breakdown = defaultdict(int)
    for category, score in rows:
        breakdown[category] += score
    return dict(breakdown)

 
@results_bp.route("/progress", methods=["GET"])
@jwt_required()
def get_progress():
    """
    History and trend across a user's past assessments.

    Assumption: lower total_score = less stress = improving, since
    wellness_level buckets here are literally Low/Moderate/High
    Stress. Flagging this because "higher is better" could easily be
    true for a different scoring dimension later.
    """
    user_id = get_jwt_identity()

    assessments = (
        Assessment.query
        .filter_by(user_id=user_id)
        .order_by(Assessment.created_at.asc())
        .all()
    )

    if not assessments:
        return jsonify({"history": [], 
                        "latest_wellness_level": None,
                        "trend": None,
                        "statistics": {
                            "total_assessments": 0,
                            "average_score": None,
                            "highest_score": None,
                            "lowest_score": None,
                            "most_common_wellness_level": None,
                        },
                        "category_trends": {},
                        }), 200

    history = progress_history_schema.dump(assessments)

    scores = [a.total_score for a in assessments]
    wellness_levels = [a.wellness_level for a in assessments]
 
    latest_score = scores[-1]
    prior_scores = scores[:-1]
 
    if not prior_scores:
        trend = "not_enough_data"
    else:
        prior_average = mean(prior_scores)
        if latest_score < prior_average:
            trend = "improving"
        elif latest_score > prior_average:
            trend = "worsening"
        else:
            trend = "stable"
 
    statistics = {
        "total_assessments": len(assessments),
        "average_score": round(mean(scores), 2),
        "lowest_score": min(scores),
        "highest_score": max(scores),
        "most_common_wellness_level": Counter(wellness_levels).most_common(1)[0][0],
    }
 
    # Per-category trend: latest assessment's per-category subtotal vs
    # the average of that category's subtotal across prior assessments.
    breakdowns = {a.id: _category_breakdown(a.id) for a in assessments}
    latest_breakdown = breakdowns[assessments[-1].id]
    prior_breakdowns = [breakdowns[a.id] for a in assessments[:-1]]
 
    all_categories = set()
    for breakdown in breakdowns.values():
        all_categories.update(breakdown.keys())
 
    category_trends = {}
    for category in all_categories:
        latest_value = latest_breakdown.get(category)
        prior_values = [b[category] for b in prior_breakdowns if category in b]
 
        if latest_value is None or not prior_values:
            category_trends[category] = "not_enough_data"
            continue
 
        prior_average = mean(prior_values)
        if latest_value < prior_average:
            category_trends[category] = "improving"
        elif latest_value > prior_average:
            category_trends[category] = "worsening"
        else:
            category_trends[category] = "stable"
 
    return jsonify({
        "history": history,
        "latest_wellness_level": assessments[-1].wellness_level,
        "trend": trend,
        "statistics": statistics,
        "category_trends": category_trends,
    }), 200