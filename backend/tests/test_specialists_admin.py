from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import User, Specialist


def _make_specialist_user(email="pendingspec@fixture.com"):
    user = User(
        full_name="Pending Specialist",
        role="specialist",
        email=email,
        password_hash="x",
    )
    db.session.add(user)
    db.session.commit()
    return user


def _make_specialist(app, *, specialization="Counseling", verification_status="pending",
                      full_name="Dr. Test", email=None, registration_number=None):
    unique_slug = specialization.lower().replace(" ", "")
    user = User(
        full_name=full_name,
        role="specialist",
        email=email or f"{unique_slug}-{verification_status}@fixture.com",
        password_hash="x",
    )
    db.session.add(user)
    db.session.commit()

    specialist = Specialist(
        user_id=user.id,
        specialization=specialization,
        bio="Test bio",
        registration_number=registration_number or f"REG-{user.id}",
        national_id_url="https://example.com/id.pdf",
        degree_certificate_url="https://example.com/degree.pdf",
        professional_license_url="https://example.com/license.pdf",
        verification_status=verification_status,
    )
    db.session.add(specialist)
    db.session.commit()
    return specialist


# ----------------------------------------------------------------------
# GET /specialists/applications
# ----------------------------------------------------------------------

def test_list_applications_requires_admin(app, client, client_token):
    _make_specialist(app, verification_status="pending")

    response = client.get(
        "/specialists/applications", headers={"Authorization": f"Bearer {client_token}"}
    )
    assert response.status_code == 403


def test_list_applications_defaults_to_pending(app, client, admin_token):
    _make_specialist(app, specialization="Counseling", verification_status="pending")
    _make_specialist(app, specialization="Psychiatry", verification_status="approved")
    _make_specialist(app, specialization="Nutrition", verification_status="rejected")

    response = client.get(
        "/specialists/applications", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200

    specializations = {a["specialization"] for a in response.get_json()}
    assert specializations == {"Counseling"}


def test_list_applications_status_all_returns_everything(app, client, admin_token):
    _make_specialist(app, specialization="Counseling", verification_status="pending")
    _make_specialist(app, specialization="Psychiatry", verification_status="approved")

    response = client.get(
        "/specialists/applications?status=all",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert len(response.get_json()) == 2


def test_list_applications_includes_documents_and_identity(app, client, admin_token):
    _make_specialist(
        app,
        specialization="Counseling",
        verification_status="pending",
        full_name="Dr. Amina Yusuf",
        email="amina@fixture.com",
    )

    response = client.get(
        "/specialists/applications", headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.get_json()[0]
    assert data["full_name"] == "Dr. Amina Yusuf"
    assert data["email"] == "amina@fixture.com"
    assert data["national_id_url"] == "https://example.com/id.pdf"
    assert data["verification_status"] == "pending"


# ----------------------------------------------------------------------
# GET /specialists/applications/<id>
# ----------------------------------------------------------------------

def test_get_application_requires_admin(app, client, client_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.get(
        f"/specialists/applications/{specialist.id}",
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_get_application_returns_detail(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.get(
        f"/specialists/applications/{specialist.id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.get_json()["id"] == specialist.id


def test_get_application_unknown_id_404s(app, client, admin_token):
    response = client.get(
        "/specialists/applications/99999",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 404


# ----------------------------------------------------------------------
# PUT /specialists/applications/<id>/verification
# ----------------------------------------------------------------------

def test_review_application_requires_admin(app, client, client_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "approved"},
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_admin_can_approve_application(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "approved"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.get_json()["verification_status"] == "approved"

    db.session.refresh(specialist)
    assert specialist.verification_status == "approved"


def test_admin_can_reject_application_with_reason(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "rejected", "rejection_reason": "Blurry ID scan"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["verification_status"] == "rejected"
    assert data["rejection_reason"] == "Blurry ID scan"


def test_rejecting_without_reason_is_rejected_by_api(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "rejected"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 400


def test_invalid_verification_status_rejected(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="pending")

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "maybe"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 400


def test_approving_clears_any_previous_rejection_reason(app, client, admin_token):
    specialist = _make_specialist(app, verification_status="rejected")
    specialist.rejection_reason = "Old reason"
    db.session.commit()

    response = client.put(
        f"/specialists/applications/{specialist.id}/verification",
        json={"verification_status": "approved"},
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.get_json()["rejection_reason"] is None


# ----------------------------------------------------------------------
# Resubmission after rejection via PUT /specialists/me
# ----------------------------------------------------------------------

def test_cannot_change_documents_while_pending(app, client):
    user = _make_specialist_user()
    token = create_access_token(identity=str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "registration_number": "REG-100",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers=headers,
    )

    response = client.put(
        "/specialists/me",
        json={"national_id_url": "https://example.com/new-id.pdf"},
        headers=headers,
    )
    assert response.status_code == 400


def test_resubmission_after_rejection_resets_to_pending(app, client):
    user = _make_specialist_user(email="rejectedspec@fixture.com")
    token = create_access_token(identity=str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "registration_number": "REG-200",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers=headers,
    )

    specialist = Specialist.query.filter_by(user_id=user.id).first()
    specialist.verification_status = "rejected"
    specialist.rejection_reason = "Blurry scan"
    db.session.commit()

    response = client.put(
        "/specialists/me",
        json={"national_id_url": "https://example.com/clearer-id.pdf"},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.get_json()
    assert data["verification_status"] == "pending"
    assert data["rejection_reason"] is None
    assert data["national_id_url"] == "https://example.com/clearer-id.pdf"


def test_bio_and_specialization_always_editable_regardless_of_status(app, client):
    user = _make_specialist_user(email="editablespec@fixture.com")
    token = create_access_token(identity=str(user.id))
    headers = {"Authorization": f"Bearer {token}"}

    client.post(
        "/specialists",
        json={
            "specialization": "Counseling",
            "registration_number": "REG-300",
            "national_id_url": "https://example.com/id.pdf",
            "degree_certificate_url": "https://example.com/degree.pdf",
            "professional_license_url": "https://example.com/license.pdf",
        },
        headers=headers,
    )

    response = client.put(
        "/specialists/me",
        json={"bio": "Updated while still pending."},
        headers=headers,
    )
    assert response.status_code == 200
    assert response.get_json()["bio"] == "Updated while still pending."