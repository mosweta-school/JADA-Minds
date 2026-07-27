def test_create_resource_requires_admin(client, client_token):
    response = client.post(
        "/resources",
        json={
            "title": "Managing Exam Stress",
            "category": "stress",
            "description": "Short guide on coping strategies before exams.",
        },
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_admin_can_create_update_and_soft_delete_resource(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    create_resp = client.post(
        "/resources",
        json={
            "title": "Managing Exam Stress",
            "category": "stress",
            "description": "Short guide on coping strategies before exams.",
            "url": "https://example.com/exam-stress",
        },
        headers=headers,
    )
    assert create_resp.status_code == 201
    resource_id = create_resp.get_json()["id"]

    update_resp = client.put(
        f"/resources/{resource_id}",
        json={"title": "Managing Exam Stress (Updated)"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.get_json()["title"] == "Managing Exam Stress (Updated)"

    list_resp = client.get("/resources", headers=headers)
    assert any(r["id"] == resource_id for r in list_resp.get_json())

    delete_resp = client.delete(f"/resources/{resource_id}", headers=headers)
    assert delete_resp.status_code == 200

    list_after_delete = client.get("/resources", headers=headers)
    assert all(r["id"] != resource_id for r in list_after_delete.get_json())


def test_create_resource_rejects_invalid_url(client, admin_token):
    response = client.post(
        "/resources",
        json={
            "title": "Bad URL Resource",
            "category": "misc",
            "description": "Testing validation.",
            "url": "not-a-valid-url",
        },
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 400