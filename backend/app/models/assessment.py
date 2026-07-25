from datetime import datetime, timezone 

from app.extensions import db


class Assessment(db.Model):
    __tablename__ = "assessments"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    total_score = db.Column(
        db.Integer,
        nullable=False
    )

    wellness_level = db.Column(
        db.String(20),
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc)
    )

    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships

    user = db.relationship(
        "User",
        back_populates="assessments"
    )

    responses = db.relationship(
        "AssessmentResponse",
        back_populates="assessment",
        cascade="all, delete-orphan"
    )