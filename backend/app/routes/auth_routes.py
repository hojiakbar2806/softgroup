from app.database import db
from app.database.models import User
from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_routes = Blueprint("auth", __name__)


@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    full_name = data.get("full_name")
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    phone_number = data.get("phone_number")

    if not full_name:
        return jsonify({"message": "Full name required"})
    if not username:
        return jsonify({"message": "Username required"})
    if not email:
        return jsonify({"message": "Email required"})
    if not password:
        return jsonify({"message": "Password required"})
    if not phone_number:
        return jsonify({"message": "Phone number required"})

    user = User.query.filter_by(email=email).first()

    if user:
        return jsonify({"message": "User already exists"}), 400

    new_user = User(
        full_name=full_name,
        username=username,
        email=email,
        phone_number=phone_number
    )
    new_user.set_password(password)

    try:
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": str(e)}), 500


@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"message": "Invalid credentials"}), 400

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid username or password"}), 401

    access_token = create_access_token(identity=user.id)

    session["token"] = access_token
    return jsonify({"message": "Login successful", "access_token": access_token}), 200


@auth_routes.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"message": f"Hello, {user.username}!"}), 200


@auth_routes.route("/logout", methods=["POST"])
def logout():
    session.pop("token", None)
    return jsonify({"message": "User logged out successfully!"}), 200
