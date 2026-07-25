from flask import Flask

from .config import Config
from .extensions import db, migrate, jwt, cors


def create_app():
    app = Flask(__name__)

    app.config.from_object(Config)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
   
    from .questions import questions_bp
    from .assessments import assessments_bp
 
    app.register_blueprint(questions_bp)
    app.register_blueprint(assessments_bp) 
   
    @app.route("/")
    def home():
        return {
            "status": "success",
            "message": "Welcome to JADA Minds API 🚀"
        }

    return app