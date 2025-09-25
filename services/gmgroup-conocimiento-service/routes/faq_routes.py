from flask import Blueprint, request, jsonify
from controllers.faq_controller import agregar_faq, buscar_preguntas, listar_preguntas_sin_respuesta, listar_todas_preguntas
from middlewares.auth import authenticate

faq_bp = Blueprint("faq", __name__)

@faq_bp.route("/", methods=["POST"])
@authenticate
def create_faq():
    data = request.get_json()
    if not data or "pregunta" not in data or "respuesta" not in data:
        return jsonify({"error": "Debe enviar pregunta y respuesta"}), 400

    result = agregar_faq(data)
    return jsonify({"message": "Pregunta agregada con éxito", "faq": result}), 200

@faq_bp.route("/", methods=["GET"])
@authenticate
def get_faq():
    return listar_todas_preguntas()

@faq_bp.route("/buscar", methods=["POST"])
@authenticate
def search_faqs():
    data = request.get_json()
    if not data or "texto" not in data:
        return jsonify({"error": "Debe enviar el campo 'texto'"}), 400

    result = buscar_preguntas(data)
    if "error" in result:
        return jsonify(result), 400

    return jsonify({"resultados": result}), 200

@faq_bp.route("/sin_respuesta", methods=["GET"])
@authenticate
def faq_sin_respuesta():
    return listar_preguntas_sin_respuesta()
