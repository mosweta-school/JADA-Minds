from datetime import datetime, timezone 

from app.extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(100),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    phone = db.Column(
        db.String(20)
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True,
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

    assessments = db.relationship(
        "Assessment",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    workshop_registrations = db.relationship(
        "WorkshopRegistration",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    workshops_created = db.relationship(
        "Workshop",
        back_populates="creator"
    )

    questions_created = db.relationship(
        "Question",
        back_populates="creator"
    )

    resources_created = db.relationship(
        "Resource",
        back_populates="creator"
    )

    specialist_profile = db.relationship(
        "Specialist",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan"
    )