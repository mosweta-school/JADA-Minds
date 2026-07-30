# backend/app/config.py

import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration for the Flask application."""

    SECRET_KEY = os.getenv("SECRET_KEY")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "sqlite:///jada_minds.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ===== EMAIL CONFIGURATION =====
    MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
    MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", "True").lower() == "true"
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER")
    MAIL_FROM_NAME = os.getenv("MAIL_FROM_NAME", "JADA Minds")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    # ===== GOOGLE OAUTH =====
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")