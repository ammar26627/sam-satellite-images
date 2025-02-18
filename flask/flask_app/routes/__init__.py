from flask import Blueprint
from flask_app.routes.embeddings import embeddings_bp

main_bp = Blueprint("main", __name__)

main_bp.register_blueprint(embeddings_bp, url_prefix="/api")
