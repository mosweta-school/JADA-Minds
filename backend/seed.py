# backend/seed.py

# Dev-only seed data for local testing.
# Question content here is a placeholder, not the real questionnaire.

from app import create_app
from app.extensions import db
from app.models import User, Question
from flask_jwt_extended import create_access_token
from datetime import timedelta

app = create_app()

with app.app_context():
    db.create_all()

    admin = User.query.filter_by(email="admin@test.com").first()
    if not admin:
        admin = User(full_name="Admin", role="admin", email="admin@test.com", password_hash="x")
        db.session.add(admin)
        db.session.commit()

    question = Question.query.first()
    if not question:
        question = Question(
            question_text="I feel overwhelmed",
            category="stress",
            weight=1,
            display_order=1,
            created_by=admin.id,
        )
        db.session.add(question)
        db.session.commit()

    # ✅ Fix: Use timedelta instead of expires_delta=False
    token = create_access_token(identity=str(admin.id), expires_delta=timedelta(days=1))
    print("\n" + "=" * 60)
    print("🔑 ADMIN TOKEN")
    print("=" * 60)
    print(token)
    print("=" * 60 + "\n")