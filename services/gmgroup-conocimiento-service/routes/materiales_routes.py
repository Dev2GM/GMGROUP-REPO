from flask import Blueprint
from controllers.materiales_controller import get_folder, create_folder, create_file
from middlewares.auth import authenticate

materiales_bp = Blueprint("materiales", __name__)

materiales_bp.route("/folder", methods=["GET"])(authenticate(get_folder))
materiales_bp.route("/folder", methods=["POST"])(authenticate(create_folder))
materiales_bp.route("/file", methods=["POST"])(authenticate(create_file))
