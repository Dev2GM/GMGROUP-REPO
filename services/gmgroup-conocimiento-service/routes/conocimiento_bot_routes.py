from flask import Blueprint
from controllers.conocimiento_bot_controller import (
    get_conocimiento_bot_items,
    add_conocimiento_bot_item,
    delete_conocimiento_bot_item
)
from middlewares.auth import authenticate

conocimiento_bot_bp = Blueprint("conocimiento_bot", __name__)

conocimiento_bot_bp.route("/", methods=["GET"])(authenticate(get_conocimiento_bot_items))
conocimiento_bot_bp.route("/", methods=["POST"])(authenticate(add_conocimiento_bot_item))
conocimiento_bot_bp.route("/<int:id>", methods=["DELETE"])(authenticate(delete_conocimiento_bot_item))
