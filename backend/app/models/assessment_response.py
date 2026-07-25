from datetime import datetime, timezone 

from app.extensions import db


class AssessmentResponse(db.Model):
    __tablename__ = "assessment_responses"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    assessment_id = db.Column(
        db.Integer,
        db.ForeignKey("assessments.id"),
        nullable=False
    )

    question_id = db.Column(
        db.Integer,
        db.ForeignKey("questions.id"),
        nullable=False
    )

    selected_option = db.Column(
        db.String(255),
        nullable=False
    )

    score = db.Column(
        db.Integer,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    # Relationships

    assessment = db.relationship(
        "Assessment",
        back_populates="responses"
    )

    question = db.relationship(
        "Question",
        back_populates="assessment_responses"
    )