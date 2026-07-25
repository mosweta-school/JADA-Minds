from datetime import datetime

from app.extensions import db


class WorkshopRegistration(db.Model):
    __tablename__ = "workshop_registrations"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    workshop_id = db.Column(
        db.Integer,
        db.ForeignKey("workshops.id"),
        nullable=False
    )

    status = db.Column(
        db.String(20),
        default="Registered",
        nullable=False
    )

    registered_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    updated_at = db.Column(
        db.DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    # Relationships

    user = db.relationship(
        "User",
        back_populates="workshop_registrations"
    )

    workshop = db.relationship(
        "Workshop",
        back_populates="registrations"
    )