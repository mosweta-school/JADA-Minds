from datetime import date


def test_create_workshop_requires_admin(client, client_token):
    response = client.post(
        "/workshops",
        json={
            "title": "Managing Stress",
            "description": "A workshop on stress",
            "event_date": "2026-09-01",
            "location": "Nairobi",
            "capacity": 30,
        },
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_admin_can_create_update_and_soft_delete_workshop(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    create_resp = client.post(
        "/workshops",
        json={
            "title": "Managing Stress",
            "description": "A workshop on stress",
            "event_date": "2026-09-01",
            "location": "Nairobi",
            "capacity": 30,
        },
        headers=headers,
    )
    assert create_resp.status_code == 201
    workshop_id = create_resp.get_json()["id"]

    update_resp = client.put(
        f"/workshops/{workshop_id}",
        json={"location": "Mombasa"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.get_json()["location"] == "Mombasa"

    list_resp = client.get("/workshops", headers=headers)
    assert any(w["id"] == workshop_id for w in list_resp.get_json())

    delete_resp = client.delete(f"/workshops/{workshop_id}", headers=headers)
    assert delete_resp.status_code == 200

    list_after_delete = client.get("/workshops", headers=headers)
    assert all(w["id"] != workshop_id for w in list_after_delete.get_json())