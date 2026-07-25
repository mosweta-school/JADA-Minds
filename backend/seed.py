from app import create_app
from app.extensions import db
from app.models import User, Question
from flask_jwt_extended import create_access_token

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

    token = create_access_token(identity=str(admin.id))
    print("\nTOKEN:", token, "\n")