from app.extensions import db
from app.models import User, Specialist


def _make_specialist(app, *, specialization, verification_status, full_name="Dr. Test"):
    unique_slug = specialization.lower().replace(" ", "")
    user = User(
        full_name=full_name,
        role="specialist",
        email=f"{unique_slug}@fixture.com",
        password_hash="x",
    )
    db.session.add(user)
    db.session.commit()

    specialist = Specialist(
        user_id=user.id,
        specialization=specialization,
        bio="Test bio",
        registration_number=f"REG-{user.id}",
        national_id_url="https://example.com/id.pdf",
        degree_certificate_url="https://example.com/degree.pdf",
        professional_license_url="https://example.com/license.pdf",
        verification_status=verification_status,
    )
    db.session.add(specialist)
    db.session.commit()
    return specialist


def test_list_specialists_only_returns_approved_regardless_of_casing(app, client, client_token):
    # Deliberately mixed casing - "approved", "Pending", "rejected" -
    # confirms the filter isn't casing-dependent either way.
    _make_specialist(app, specialization="Counseling", verification_status="approved")
    _make_specialist(app, specialization="Psychiatry", verification_status="Pending")
    _make_specialist(app, specialization="Nutrition", verification_status="rejected")

    response = client.get("/specialists", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 200

    specializations = {s["specialization"] for s in response.get_json()}
    assert specializations == {"Counseling"}


def test_list_specialists_filters_by_specialization(app, client, client_token):
    _make_specialist(app, specialization="Counseling", verification_status="Approved")
    _make_specialist(app, specialization="Psychiatry", verification_status="approved")

    response = client.get(
        "/specialists?specialization=psychiatry",
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 200

    results = response.get_json()
    assert len(results) == 1
    assert results[0]["specialization"] == "Psychiatry"


def test_get_specialist_hides_unapproved(app, client, client_token):
    specialist = _make_specialist(
        app, specialization="Counseling", verification_status="pending"
    )

    response = client.get(
        f"/specialists/{specialist.id}",
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 404


def test_get_specialist_returns_approved_with_name_but_no_documents(app, client, client_token):
    specialist = _make_specialist(
        app,
        specialization="Counseling",
        verification_status="approved",
        full_name="Dr. Amina Yusuf",
    )

    response = client.get(
        f"/specialists/{specialist.id}",
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 200

    data = response.get_json()
    assert data["full_name"] == "Dr. Amina Yusuf"
    assert "national_id_url" not in data
    assert "degree_certificate_url" not in data
    assert "professional_license_url" not in data
    assert "verification_status" not in data