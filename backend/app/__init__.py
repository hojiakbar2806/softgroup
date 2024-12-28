from flask import Flask
from app.config import Config
from app.database import init_db
from flask_jwt_extended import JWTManager
from app.routes.auth_routes import auth_routes
from app.routes.template_routes import template_routes
from flask_cors import CORS


def create_app():
    app = Flask(__name__)

    CORS(app, resources={
         r"/*": {
             "origins": ["http://localhost:3000", "https://softgroup.uz", "https://template.softgroup.uz"],
             "supports_credentials": True
         }})

    app.config.from_object(Config)
    app.secret_key = "hojiakbar"
    jwt = JWTManager(app)

    init_db(app)

    app.register_blueprint(auth_routes, url_prefix='/api/auth')
    app.register_blueprint(template_routes, url_prefix='/api/templates')

    return app
