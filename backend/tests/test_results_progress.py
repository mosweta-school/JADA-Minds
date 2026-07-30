from app.extensions import db
from app.models import Assessment, AssessmentResponse, Question


def _make_assessment(user_id, total_score, wellness_level):
    assessment = Assessment(
        user_id=user_id,
        total_score=total_score,
        wellness_level=wellness_level,
    )
    db.session.add(assessment)
    db.session.commit()
    return assessment


def _make_question(admin_id, category, weight=1, display_order=1):
    question = Question(
        question_text=f"Sample {category} question",
        category=category,
        weight=weight,
        display_order=display_order,
        created_by=admin_id,
    )
    db.session.add(question)
    db.session.commit()
    return question


def _make_response(assessment_id, question_id, selected_option, score):
    response = AssessmentResponse(
        assessment_id=assessment_id,
        question_id=question_id,
        selected_option=selected_option,
        score=score,
    )
    db.session.add(response)
    db.session.commit()
    return response


def test_get_results_with_no_assessments_404s(app, client, client_token):
    response = client.get("/results", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 404


def test_get_results_returns_latest(app, client, client_token, client_user):
    _make_assessment(client_user.id, total_score=5, wellness_level="Low Stress")
    _make_assessment(client_user.id, total_score=12, wellness_level="Moderate Stress")

    response = client.get("/results", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 200

    data = response.get_json()
    assert data["total_score"] == 12
    assert data["wellness_level"] == "Moderate Stress"


def test_get_progress_with_no_assessments_returns_empty_shape(app, client, client_token):
    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 200

    data = response.get_json()
    assert data["history"] == []
    assert data["trend"] is None
    assert data["statistics"]["total_assessments"] == 0
    assert data["category_trends"] == {}


def test_get_progress_trend_uses_average_of_prior_not_just_last_one(
    app, client, client_token, client_user
):
    # Prior average is (20 + 4) / 2 = 12. Latest (10) is below that
    # average, so trend should be "improving" even though it's higher
    # than the immediately previous score (4) - proves it's not just
    # comparing to the last single entry.
    _make_assessment(client_user.id, total_score=20, wellness_level="High Stress")
    _make_assessment(client_user.id, total_score=4, wellness_level="Low Stress")
    _make_assessment(client_user.id, total_score=10, wellness_level="Moderate Stress")

    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 200

    data = response.get_json()
    assert data["trend"] == "improving"


def test_get_progress_single_assessment_not_enough_data(app, client, client_token, client_user):
    _make_assessment(client_user.id, total_score=10, wellness_level="Moderate Stress")

    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    data = response.get_json()
    assert data["trend"] == "not_enough_data"


def test_get_progress_statistics(app, client, client_token, client_user):
    _make_assessment(client_user.id, total_score=4, wellness_level="Low Stress")
    _make_assessment(client_user.id, total_score=10, wellness_level="Moderate Stress")
    _make_assessment(client_user.id, total_score=10, wellness_level="Moderate Stress")

    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    stats = response.get_json()["statistics"]

    assert stats["total_assessments"] == 3
    assert stats["lowest_score"] == 4
    assert stats["highest_score"] == 10
    assert stats["average_score"] == round((4 + 10 + 10) / 3, 2)
    assert stats["most_common_wellness_level"] == "Moderate Stress"


def test_get_progress_category_trends(app, client, client_token, client_user, admin_user):
    stress_q = _make_question(admin_user.id, category="stress")
    sleep_q = _make_question(admin_user.id, category="sleep")

    first = _make_assessment(client_user.id, total_score=8, wellness_level="Moderate Stress")
    _make_response(first.id, stress_q.id, "Often", 3)
    _make_response(first.id, sleep_q.id, "Rarely", 1)

    second = _make_assessment(client_user.id, total_score=4, wellness_level="Low Stress")
    _make_response(second.id, stress_q.id, "Rarely", 1)
    _make_response(second.id, sleep_q.id, "Often", 3)

    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    trends = response.get_json()["category_trends"]

    # stress: prior=3, latest=1 -> improving (lower is better)
    assert trends["stress"] == "improving"
    # sleep: prior=1, latest=3 -> worsening
    assert trends["sleep"] == "worsening"


def test_progress_only_shows_own_assessments(app, client, client_token, client_user, admin_user):
    _make_assessment(client_user.id, total_score=5, wellness_level="Low Stress")
    _make_assessment(admin_user.id, total_score=20, wellness_level="High Stress")

    response = client.get("/progress", headers={"Authorization": f"Bearer {client_token}"})
    data = response.get_json()

    assert len(data["history"]) == 1
    assert data["statistics"]["total_assessments"] == 1