from flask import Flask
from flask_cors import CORS
from routes.novedades_routes import novedades_bp
from routes.faq_routes import faq_bp
from routes.conocimiento_bot_routes import conocimiento_bot_bp
from routes.materiales_routes import materiales_bp
import os

app = Flask(__name__)
CORS(app)

# Registrar rutas
app.register_blueprint(novedades_bp, url_prefix="/api/novedades")
app.register_blueprint(faq_bp, url_prefix="/api/faq")
app.register_blueprint(conocimiento_bot_bp, url_prefix="/api/conocimiento_bot")
app.register_blueprint(materiales_bp, url_prefix="/api/materiales")
@app.route("/")
def home():
    return {"message": "Conocimiento Service funcionando 🚀"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT")), debug=os.getenv("DEBUG").title())
