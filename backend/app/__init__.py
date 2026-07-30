# backend/app/__init__.py

from flask import Flask, jsonify
from flask_cors import CORS
from .config import Config
from .extensions import db, migrate, jwt, cors, limiter, mail
from app.routes import api_bp
from app.models.token_blacklist import is_token_revoked


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, 
        origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000, http://localhost:5000/api/auth/register"],
        allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Credentials","Access-Control-Allow-Origin"],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )
    limiter.init_app(app)
    mail.init_app(app)

    #  JWT token revocation check with proper error handling
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        try:
            return is_token_revoked(jwt_payload)
        except Exception as e:
            app.logger.error(f"Error checking token revocation: {e}")
            return False  #  Default to False (not revoked) on error

    @jwt.revoked_token_loader
    def handle_revoked_token(jwt_header, jwt_payload):
        return jsonify({"error": "Token has been revoked."}), 401

    @jwt.invalid_token_loader
    def handle_invalid_token(error):
        """ Handle invalid tokens gracefully."""
        return jsonify({"error": "Invalid token. Please log in again."}), 401

    @jwt.unauthorized_loader
    def handle_missing_token(error):
        """ Handle missing tokens gracefully."""
        return jsonify({"error": "Authentication token is missing."}), 401

    @jwt.expired_token_loader
    def handle_expired_token(jwt_header, jwt_payload):
        """ Handle expired tokens gracefully."""
        return jsonify({"error": "Token has expired. Please refresh."}), 401

    #  Rate limit error handler
    @app.errorhandler(429)
    def handle_rate_limit_exceeded(e):
        return jsonify({
            "error": "Too many requests. Please try again later."
        }), 429

    # Import other blueprints
    from .questions import questions_bp
    from .assessments import assessments_bp, results_bp
    from .resources import resources_bp
    from .specialists import specialists_bp
    from .workshops import workshops_bp

    # Register all blueprints
    app.register_blueprint(api_bp)
    app.register_blueprint(questions_bp)
    app.register_blueprint(assessments_bp) 
    app.register_blueprint(results_bp)
    app.register_blueprint(resources_bp)
    app.register_blueprint(specialists_bp)
    app.register_blueprint(workshops_bp)

    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "Welcome to JADA Minds API "
        }

    return app