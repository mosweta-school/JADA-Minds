from app.extensions import db
from app.models import Question


def _make_question(admin_id, category="stress", weight=1, display_order=1):
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


def test_submit_assessment_success(app, client, client_token, admin_user):
    q1 = _make_question(admin_user.id, category="stress")
    q2 = _make_question(admin_user.id, category="sleep")

    payload = {
        "responses": [
            {"question_id": q1.id, "selected_option": "Often"},
            {"question_id": q2.id, "selected_option": "Rarely"},
        ]
    }

    response = client.post(
        "/assessment", json=payload, headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 201

    data = response.get_json()
    assert data["total_score"] == 4  # Often=3 + Rarely=1
    assert data["wellness_level"] == "Low Stress"
    assert len(data["responses"]) == 2


def test_submit_assessment_unknown_question_id_rejected(app, client, client_token, admin_user):
    q1 = _make_question(admin_user.id)

    payload = {
        "responses": [
            {"question_id": q1.id, "selected_option": "Often"},
            {"question_id": 999999, "selected_option": "Rarely"},
        ]
    }

    response = client.post(
        "/assessment", json=payload, headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 400
    assert "999999" in response.get_json()["error"]


def test_submit_assessment_invalid_option_rejected(app, client, client_token, admin_user):
    q1 = _make_question(admin_user.id)

    payload = {"responses": [{"question_id": q1.id, "selected_option": "Maybe"}]}

    response = client.post(
        "/assessment", json=payload, headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 400


def test_submit_assessment_empty_responses_rejected(app, client, client_token):
    response = client.post(
        "/assessment",
        json={"responses": []},
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 400


def test_get_own_assessment(app, client, client_token, admin_user):
    q1 = _make_question(admin_user.id)
    submit = client.post(
        "/assessment",
        json={"responses": [{"question_id": q1.id, "selected_option": "Always"}]},
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assessment_id = submit.get_json()["id"]

    response = client.get(
        f"/assessment/{assessment_id}",
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 200
    assert response.get_json()["id"] == assessment_id


def test_get_someone_elses_assessment_forbidden(
    app, client, client_token, admin_token, admin_user
):
    q1 = _make_question(admin_user.id)
    submit = client.post(
        "/assessment",
        json={"responses": [{"question_id": q1.id, "selected_option": "Never"}]},
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assessment_id = submit.get_json()["id"]

    response = client.get(
        f"/assessment/{assessment_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 403


def test_get_nonexistent_assessment_404s(app, client, client_token):
    response = client.get(
        "/assessment/999999", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 404