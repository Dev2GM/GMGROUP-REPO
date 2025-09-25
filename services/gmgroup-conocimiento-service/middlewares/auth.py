import os
import requests
from functools import wraps
from flask import request, jsonify, g

def authenticate(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        svc_token = request.headers.get("x-service-token")
        if svc_token and svc_token == os.getenv("SERVICE_INTERNAL_TOKEN"):
            return f(*args, **kwargs)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"message": "Token no proporcionado"}), 401

        token = auth_header.split(" ")[1]

        try:
            res = requests.post(
                os.getenv("API_URL") + "/api/auth/verify",
                json={"token": token},
                timeout=5
            )
            if res.status_code == 200 and res.json().get("valid"):
                g.user = res.json().get("user")  # 👈 aquí guardamos el user
                return f(*args, **kwargs)
            else:
                return jsonify({"message": "Token inválido"}), 401
        except Exception as e:
            print("Error validando token:", str(e))
            return jsonify({"message": "Error validando token"}), 401

    return decorated
