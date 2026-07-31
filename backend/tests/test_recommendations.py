from app.extensions import db
from app.models import Assessment, AssessmentResponse, Question, Resource


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


def _make_resource(admin_id, title, category, is_active=True):
    resource = Resource(
        title=title,
        category=category,
        description=f"Resource about {category}",
        url="https://example.com/resource",
        is_active=is_active,
        created_by=admin_id,
    )
    db.session.add(resource)
    db.session.commit()
    return resource


def test_recommendations_with_no_assessments_404s(app, client, client_token):
    response = client.get(
        "/recommendations", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 404


def test_recommendations_targets_worst_scoring_categories(
    app, client, client_token, client_user, admin_user
):
    stress_q = _make_question(admin_user.id, category="stress")
    sleep_q = _make_question(admin_user.id, category="sleep", display_order=2)
    mood_q = _make_question(admin_user.id, category="mood", display_order=3)

    assessment = _make_assessment(client_user.id, total_score=15, wellness_level="High Stress")
    _make_response(assessment.id, stress_q.id, "Often", 8)
    _make_response(assessment.id, sleep_q.id, "Rarely", 5)
    _make_response(assessment.id, mood_q.id, "Rarely", 2)

    _make_resource(admin_user.id, "Managing stress", category="stress")
    _make_resource(admin_user.id, "Sleep hygiene basics", category="sleep")
    _make_resource(admin_user.id, "Mood boosters", category="mood")

    response = client.get(
        "/recommendations", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 200

    data = response.get_json()
    assert data["based_on_assessment_id"] == assessment.id
    # Highest subtotal (stress=8) should be ranked first.
    assert data["focus_categories"][0] == "stress"
    assert set(data["focus_categories"]) == {"stress", "sleep", "mood"}

    titles = {r["title"] for r in data["resources"]}
    assert "Managing stress" in titles
    assert "Sleep hygiene basics" in titles
    assert "Mood boosters" in titles


def test_recommendations_excludes_inactive_resources(
    app, client, client_token, client_user, admin_user
):
    stress_q = _make_question(admin_user.id, category="stress")
    assessment = _make_assessment(client_user.id, total_score=8, wellness_level="High Stress")
    _make_response(assessment.id, stress_q.id, "Often", 8)

    _make_resource(admin_user.id, "Archived stress guide", category="stress", is_active=False)

    response = client.get(
        "/recommendations", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 200
    assert response.get_json()["resources"] == []


def test_recommendations_category_matching_is_case_insensitive(
    app, client, client_token, client_user, admin_user
):
    stress_q = _make_question(admin_user.id, category="Stress")
    assessment = _make_assessment(client_user.id, total_score=8, wellness_level="High Stress")
    _make_response(assessment.id, stress_q.id, "Often", 8)

    _make_resource(admin_user.id, "Calm down techniques", category="stress")

    response = client.get(
        "/recommendations", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 200
    titles = {r["title"] for r in response.get_json()["resources"]}
    assert "Calm down techniques" in titles


def test_recommendations_limits_to_top_three_categories(
    app, client, client_token, client_user, admin_user
):
    categories_scores = [
        ("stress", 9), ("sleep", 8), ("mood", 7), ("energy", 6),
    ]
    assessment = _make_assessment(client_user.id, total_score=30, wellness_level="High Stress")
    for i, (category, score) in enumerate(categories_scores):
        q = _make_question(admin_user.id, category=category, display_order=i + 1)
        _make_response(assessment.id, q.id, "Often", score)

    for category, _ in categories_scores:
        _make_resource(admin_user.id, f"{category} guide", category=category)

    response = client.get(
        "/recommendations", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 200
    focus_categories = response.get_json()["focus_categories"]
    assert len(focus_categories) == 3
    assert focus_categories == ["stress", "sleep", "mood"]


def test_recommendations_requires_auth(app, client):
    response = client.get("/recommendations")
    assert response.status_code == 401