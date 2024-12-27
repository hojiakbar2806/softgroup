from flask import Flask
from app.config import Config
from app.database import init_db
from app.routes.auth_routes import auth_routes
from app.routes.template_routes import template_routes
from flask_jwt_extended import JWTManager


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.secret_key = "hojiakbar"
    jwt = JWTManager(app)

    init_db(app)

    app.register_blueprint(auth_routes, url_prefix='/api/auth')
    app.register_blueprint(template_routes, url_prefix='/api/templates')

    return app
