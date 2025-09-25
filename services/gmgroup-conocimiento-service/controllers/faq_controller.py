from models.faq_model import create_faq, buscar_faqs, get_unanswered_questions, get_all_questions
from flask import jsonify

def agregar_faq(data):
    pregunta = data["pregunta"]
    respuesta = data["respuesta"]
    return create_faq(pregunta, respuesta)

def buscar_preguntas(data):
    texto = data.get("texto", "")
    if not texto:
        return {"error": "Debe enviar un texto para buscar"}
    return buscar_faqs(texto)

def listar_preguntas_sin_respuesta():
    try:
        unanswered = get_unanswered_questions()
        return jsonify({"preguntas_sin_respuesta": unanswered}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def listar_todas_preguntas():
    try:
        unanswered = get_all_questions()
        return jsonify({"preguntas": unanswered}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500