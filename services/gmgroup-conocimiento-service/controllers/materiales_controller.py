from models.materiales_model import MaterialesModel
from flask import request, jsonify

def get_folder():
    folder_id = request.args.get("folder_id")
    folder = MaterialesModel.get_folder(folder_id)
    if not folder:
        return jsonify({"error": "Carpeta no encontrada"}), 404
    subfolders = MaterialesModel.get_subfolders(folder["id"])
    files = MaterialesModel.get_files(folder["id"])
    return jsonify({"folder": folder, "subfolders": subfolders, "files": files}), 200

def create_folder():
    data = request.get_json()
    nombre = data.get("nombre")
    parent_id = data.get("parent_id")
    if not nombre:
        return jsonify({"error": "Nombre requerido"}), 400
    MaterialesModel.create_folder(nombre, parent_id)
    return jsonify({"message": "Carpeta creada"}), 201

def create_file():
    data = request.get_json()
    nombre = data.get("nombre")
    url = data.get("url")
    folder_id = data.get("folder_id")
    if not nombre or not url or not folder_id:
        return jsonify({"error": "Datos requeridos"}), 400
    MaterialesModel.create_file(nombre, url, folder_id)
    return jsonify({"message": "Archivo creado"}), 201
