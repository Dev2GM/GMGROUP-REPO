import os
import requests
from flask import g, request
from models.novedades_model import create_novedad, get_novedades

def listar_novedades():
    # 1. Traer las novedades desde MySQL
    novedades = get_novedades()

    # 2. Obtener todos los grupos desde el servicio "auth" o "grupos"
    try:
        res = requests.get(
            os.getenv("API_URL") + "/api/groups",
            headers={"x-service-token": os.getenv("SERVICE_INTERNAL_TOKEN"), "Authorization" : request.headers.get("Authorization")},
            timeout=5
        )
        print(res)
        if res.status_code == 200:
            grupos = res.json().get("groups", [])
        else:
            grupos = []
    except Exception as e:
        print("Error consultando grupos:", str(e))
        grupos = []

    # Mapear grupos por id para buscar rápido
    grupos_map = {g["id"]: g for g in grupos}

    # Obtener todos los usuarios desde el servicio de auth
    try:
        res_users = requests.get(
            os.getenv("API_URL") + "/api/users",
            headers={"x-service-token": os.getenv("SERVICE_INTERNAL_TOKEN"), "Authorization": request.headers.get("Authorization")},
            timeout=5
        )
        if res_users.status_code == 200:
            usuarios = res_users.json().get("users", [])
        else:
            usuarios = []
    except Exception as e:
        print("Error consultando usuarios:", str(e))
        usuarios = []

    usuarios_map = {u["id"]: u for u in usuarios}

    # 3. Enriquecer cada novedad
    novedades_enriquecidas = []
    for n in novedades:
        novedad = dict(n)
        usuario_info = usuarios_map.get(n["id_usuario"])
        if usuario_info:
            novedad["usuario"] = {
                "id": usuario_info["id"],
                "username": usuario_info.get("username"),
                "email": usuario_info.get("email"),
            }
        else:
            novedad["usuario"] = None
        grupo_info = grupos_map.get(n["id_grupo"])
        if grupo_info:
            novedad["grupo"] = {
                "id": grupo_info["id"],
                "nombre": grupo_info["nombre"],
            }
        else:
            novedad["grupo"] = None
        novedades_enriquecidas.append(novedad)

    return novedades_enriquecidas


def agregar_novedad(data):
    return create_novedad(
        data["id_usuario"],
        data["id_grupo"],
        data["novedad"]
    )
