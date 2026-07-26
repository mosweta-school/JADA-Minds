from datetime import date

from app.extensions import db
from app.models import Workshop


def _make_workshop(admin_id, title="Managing Stress"):
    workshop = Workshop(
        title=title,
        description="A workshop on managing stress",
        event_date=date(2026, 9, 1),
        location="Nairobi",
        capacity=30,
        created_by=admin_id,
    )
    db.session.add(workshop)
    db.session.commit()
    return workshop


def test_list_workshops(app, client, client_token, admin_user):
    _make_workshop(admin_user.id)

    response = client.get("/workshops", headers={"Authorization": f"Bearer {client_token}"})
    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_register_and_view_registered(app, client, client_token, admin_user):
    workshop = _make_workshop(admin_user.id)
    headers = {"Authorization": f"Bearer {client_token}"}

    register_resp = client.post(
        "/workshops/register", json={"workshop_id": workshop.id}, headers=headers
    )
    assert register_resp.status_code == 201
    assert register_resp.get_json()["status"] == "registered"

    registered_resp = client.get("/workshops/registered", headers=headers)
    assert registered_resp.status_code == 200
    results = registered_resp.get_json()
    assert len(results) == 1
    assert results[0]["workshop"]["title"] == "Managing Stress"


def test_register_twice_rejected(app, client, client_token, admin_user):
    workshop = _make_workshop(admin_user.id)
    headers = {"Authorization": f"Bearer {client_token}"}

    client.post("/workshops/register", json={"workshop_id": workshop.id}, headers=headers)
    second = client.post(
        "/workshops/register", json={"workshop_id": workshop.id}, headers=headers
    )

    assert second.status_code == 400


def test_cancel_then_reregister_reactivates_same_row(app, client, client_token, admin_user):
    workshop = _make_workshop(admin_user.id)
    headers = {"Authorization": f"Bearer {client_token}"}

    first = client.post(
        "/workshops/register", json={"workshop_id": workshop.id}, headers=headers
    )
    registration_id = first.get_json()["id"]

    cancel_resp = client.delete(f"/workshops/register/{registration_id}", headers=headers)
    assert cancel_resp.status_code == 200
    assert cancel_resp.get_json()["status"] == "cancelled"

    reregister = client.post(
        "/workshops/register", json={"workshop_id": workshop.id}, headers=headers
    )
    assert reregister.status_code == 200
    assert reregister.get_json()["id"] == registration_id
    assert reregister.get_json()["status"] == "registered"


def test_cancel_someone_elses_registration_forbidden(
    app, client, client_token, admin_token, admin_user
):
    workshop = _make_workshop(admin_user.id)

    register_resp = client.post(
        "/workshops/register",
        json={"workshop_id": workshop.id},
        headers={"Authorization": f"Bearer {client_token}"},
    )
    registration_id = register_resp.get_json()["id"]

    cancel_resp = client.delete(
        f"/workshops/register/{registration_id}",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert cancel_resp.status_code == 403