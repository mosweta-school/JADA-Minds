from datetime import datetime, timezone

from app.extensions import db


class Question(db.Model):
    __tablename__ = "questions"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    question_text = db.Column(
        db.Text,
        nullable=False
    )

    category = db.Column(
        db.String(50),
        nullable=False
    )

    weight = db.Column(
        db.Integer,
        default=1,
        nullable=False
    )

    display_order = db.Column(
        db.Integer,
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
        nullable=False
    )

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)  ,
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships

    creator = db.relationship(
        "User",
        back_populates="questions_created"
    )

    assessment_responses = db.relationship(
        "AssessmentResponse",
        back_populates="question",
    )