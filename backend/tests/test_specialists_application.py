from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import User


def _make_specialist_user(email="newspecialist@fixture.com"):
    user = User(
        full_name="New Specialist",
        role="specialist",
        email=email,
        password_hash="x",
    )
    db.session.add(user)
    db.session.commit()
    return user


def test_submit_application_requires_specialist_role(app, client, client_token):
    # client_token belongs to a role="client" user
    response = client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "registration_number": "REG-001",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_submit_application_success_and_defaults_to_pending(app, client):
    user = _make_specialist_user()
    token = create_access_token(identity=str(user.id))

    response = client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "bio": "Licensed counselor with 5 years experience.",
            "registration_number": "REG-001",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 201
    data = response.get_json()
    assert data["verification_status"] == "pending"
    assert data["specialization"] == "Counseling"


def test_cannot_submit_second_application(app, client):
    user = _make_specialist_user(email="dupe@fixture.com")
    token = create_access_token(identity=str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "specialization": "Counseling",
        "registration_number": "REG-002",
        "national_id_url": "https://example.com/id.pdf",
        "degree_certificate_url": "https://example.com/degree.pdf",
        "professional_license_url": "https://example.com/license.pdf",
    }

    first = client.post("/specialists", json=payload, headers=headers)
    assert first.status_code == 201

    second = client.post("/specialists", json=payload, headers=headers)
    assert second.status_code == 400


def test_get_and_update_own_profile(app, client):
    user = _make_specialist_user(email="ownprofile@fixture.com")
    token = create_access_token(identity=str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "registration_number": "REG-003",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers=headers,
    )

    get_resp = client.get("/specialists/me", headers=headers)
    assert get_resp.status_code == 200
    assert get_resp.get_json()["specialization"] == "Counseling"

    update_resp = client.put(
        "/specialists/me",
        json={"bio": "Updated bio."},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.get_json()["bio"] == "Updated bio."


def test_get_own_profile_without_application_404s(app, client):
    user = _make_specialist_user(email="noapplication@fixture.com")
    token = create_access_token(identity=str(user.id))

    response = client.get(
        "/specialists/me", headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 404