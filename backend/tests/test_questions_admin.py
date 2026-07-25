def test_create_question_requires_admin(client, client_token):
    response = client.post(
        "/questions",
        json={
            "question_text": "Do you feel rested?",
            "category": "sleep",
            "display_order": 1,
        },
        headers={"Authorization": f"Bearer {client_token}"},
    )
    assert response.status_code == 403


def test_admin_can_create_update_and_soft_delete_question(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}

    create_resp = client.post(
        "/questions",
        json={
            "question_text": "Do you feel rested?",
            "category": "sleep",
            "display_order": 1,
        },
        headers=headers,
    )
    assert create_resp.status_code == 201
    question_id = create_resp.get_json()["id"]

    update_resp = client.put(
        f"/questions/{question_id}",
        json={"question_text": "Do you feel well-rested?"},
        headers=headers,
    )
    assert update_resp.status_code == 200
    assert update_resp.get_json()["question_text"] == "Do you feel well-rested?"

    list_resp = client.get("/questions", headers=headers)
    assert any(q["id"] == question_id for q in list_resp.get_json())

    delete_resp = client.delete(f"/questions/{question_id}", headers=headers)
    assert delete_resp.status_code == 200

    list_after_delete = client.get("/questions", headers=headers)
    assert all(q["id"] != question_id for q in list_after_delete.get_json())