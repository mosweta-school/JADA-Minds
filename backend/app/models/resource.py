from datetime import datetime, timezone 

from app.extensions import db


class Resource(db.Model):
    __tablename__ = "resources"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    category = db.Column(
        db.String(50),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    url = db.Column(
        db.String(255)
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
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc)
    )

    # Relationships

    creator = db.relationship(
        "User",
        back_populates="resources_created"
    )