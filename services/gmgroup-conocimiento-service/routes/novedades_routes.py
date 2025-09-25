from flask import Blueprint, request, jsonify, g
from controllers.novedades_controller import listar_novedades, agregar_novedad
from middlewares.auth import authenticate

novedades_bp = Blueprint("novedades", __name__)

@novedades_bp.route("/", methods=["GET"])
@authenticate
def get_all():

    return jsonify(listar_novedades())

@novedades_bp.route("/", methods=["POST"])
@authenticate
def create():
    data = request.get_json()
    # 👇 agregamos el id_usuario autenticado
    data["id_usuario"] = g.user["id"]

    new_id = agregar_novedad(data)
    return jsonify({"id": new_id, "message": "Novedad creada con éxito"}), 201
