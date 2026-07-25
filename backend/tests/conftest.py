import pytest
from flask_jwt_extended import create_access_token

from app import create_app
from app.extensions import db as _db
from app.models import User


@pytest.fixture
def app():
    flask_app = create_app()
    flask_app.config.update(
        TESTING=True,
        SQLALCHEMY_DATABASE_URI="sqlite:///:memory:",
    )

    with flask_app.app_context():
        _db.create_all()
        yield flask_app
        _db.session.remove()
        _db.drop_all()


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def admin_user(app):
    admin = User(
        full_name="Admin",
        role="admin",
        email="admin@fixture.com",
        password_hash="x",
    )
    _db.session.add(admin)
    _db.session.commit()
    return admin


@pytest.fixture
def client_user(app):
    user = User(
        full_name="Client",
        role="client",
        email="client@fixture.com",
        password_hash="x",
    )
    _db.session.add(user)
    _db.session.commit()
    return user


@pytest.fixture
def admin_token(app, admin_user):
    return create_access_token(identity=str(admin_user.id))


@pytest.fixture
def client_token(app, client_user):
    return create_access_token(identity=str(client_user.id))