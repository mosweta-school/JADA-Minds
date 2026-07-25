from datetime import datetime

from app.extensions import db


class Specialist(db.Model):
    __tablename__ = "specialists"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        unique=True,
        nullable=False
    )

    specialization = db.Column(
        db.String(100),
        nullable=False
    )

    bio = db.Column(
        db.Text
    )

    registration_number = db.Column(
        db.String(100),
        unique=True,
        nullable=False
    )

    national_id_url = db.Column(
        db.String(255),
        nullable=False
    )

    degree_certificate_url = db.Column(
        db.String(255),
        nullable=False
    )

    professional_license_url = db.Column(
        db.String(255),
        nullable=False
    )

    verification_status = db.Column(
        db.String(20),
        default="Pending",
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

    # Relationship

    user = db.relationship(
        "User",
        back_populates="specialist_profile"
    )