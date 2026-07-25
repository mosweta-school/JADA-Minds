from datetime import datetime

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

    created_by = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationships

    creator = db.relationship(
        "User",
        back_populates="questions_created"
    )

    assessment_responses = db.relationship(
        "AssessmentResponse",
        back_populates="question",
        cascade="all, delete-orphan"
    )