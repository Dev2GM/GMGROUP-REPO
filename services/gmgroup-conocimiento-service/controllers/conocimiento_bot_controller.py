from models.conocimiento_bot_model import ConocimientoBotModel
from flask import request, jsonify

def get_conocimiento_bot_items():
    items = ConocimientoBotModel.get_all()
    return jsonify({"items": items}), 200

def add_conocimiento_bot_item():
    data = request.get_json()
    pregunta = data.get("pregunta")
    respuesta_correcta = data.get("respuesta_correcta")
    respuesta_erronea = data.get("respuesta_erronea")
    if not pregunta or not respuesta_correcta:
        return jsonify({"error": "Faltan campos obligatorios"}), 400
    ConocimientoBotModel.add(pregunta, respuesta_correcta, respuesta_erronea)
    return jsonify({"message": "Agregado correctamente"}), 201

def delete_conocimiento_bot_item(id):
    ConocimientoBotModel.delete(id)
    return jsonify({"message": "Eliminado correctamente"}), 200
