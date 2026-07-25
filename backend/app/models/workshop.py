from datetime import datetime, timezone

from app.extensions import db


class Workshop(db.Model):
    __tablename__ = "workshops"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    event_date = db.Column(
        db.Date,
        nullable=False
    )

    location = db.Column(
        db.String(150),
        nullable=False
    )

    capacity = db.Column(
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
        default=lambda: datetime.now(timezone.utc)  
    )

    updated_at = db.Column(
        db.DateTime,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships

    creator = db.relationship(
        "User",
        back_populates="workshops_created"
    )

    registrations = db.relationship(
        "WorkshopRegistration",
        back_populates="workshop",
        cascade="all, delete-orphan"
    )