import os
import zipfile
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from io import BytesIO
from app.database import db
from app.database.models import Template

template_routes = Blueprint("templates", __name__)

UPLOAD_FOLDER = "templates"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@template_routes.route("/", methods=["POST"])
def upload_template():
    data = request.form
    name = data.get("name")
    category = data.get("category")
    price = data.get("price")
    description = data.get("description")

    if not all([name, category, price, description]):
        return jsonify({"message": "All fields are required!"}), 400

    zip_file = request.files.get("template_file")
    if not zip_file:
        return jsonify({"message": "No template file selected!"}), 400

    image_file = request.files.get("image")
    if not image_file:
        return jsonify({"message": "No image file selected!"}), 400

    try:
        with zipfile.ZipFile(BytesIO(zip_file.read()), "r") as zip_ref:
            print("-------------------------")
            print(zip_ref.namelist()[0])
            print("-------------------------")
            zip_file_names = zip_ref.namelist()

            template_folder_path = os.path.join(UPLOAD_FOLDER)
            os.makedirs(template_folder_path, exist_ok=True)

            for file_name in zip_file_names:
                if not file_name.endswith('/'):
                    zip_ref.extract(file_name, template_folder_path)

    except zipfile.BadZipFile:
        return jsonify({"message": "Bad zip file!"}), 400

    image_filename = secure_filename(image_file.filename)

    image_path = os.path.join(UPLOAD_FOLDER, zip_file_names[0], image_filename)
    template_dir = os.path.join(UPLOAD_FOLDER, zip_file_names[0])
    image_file.save(image_path)

    image_url = f"/uploads/templates/{image_filename}"
    template_dir = f"{template_folder_path}/{name}"

    template = Template(
        name=name,
        category=category,
        price=price,
        description=description,
        image_url=image_path,
        template_dir=template_dir,
        owner_id=1
    )

    db.session.add(template)
    db.session.commit()

    return jsonify({
        "message": "Template successfully uploaded!",
        "template": {
            "name": name,
            "category": category,
            "image_url": image_url,
            "template_dir": template_folder_path
        }
    }), 201


@template_routes.route("/", methods=["GET"])
def get_all_templates():
    templates = Template.query.all()

    if not templates:
        return jsonify({"message": "No templates available at the moment!"}), 404

    result = []
    for template in templates:
        result.append({
            "id": template.id,
            "name": template.name,
            "category": template.category,
            "price": template.price,
            "description": template.description,
            "image_url": template.image_url,
            "template_dir": template.template_dir,
            "owner_id": template.owner_id
        })

    return jsonify(result), 200


@template_routes.route("/<int:id>", methods=["GET"])
def get_template(id):
    template = Template.query.get(id)

    if not template:
        return jsonify({"message": "Template not found!"}), 404

    return jsonify({
        "id": template.id,
        "name": template.name,
        "category": template.category,
        "price": template.price,
        "description": template.description,
        "image_url": template.image_url,
        "template_dir": template.template_dir,
        "owner_id": template.owner_id
    }), 200
