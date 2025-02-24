from flask import Flask, Blueprint
from flask_cors import CORS
import os, sys, torch, torchvision, threading
from flask_app.routes import main_bp as bp

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
ROOT_DIR = os.path.abspath(os.path.join(BASE_DIR, '..'))
ASSETS_DIR = os.path.join(ROOT_DIR, 'assets')

sys.path.append(os.path.join(ROOT_DIR, 'segment-anything'))

from segment_anything import sam_model_registry, SamPredictor


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"*": {"origins": "*"}})
    SAM_CHECKPOINT = os.path.join(ASSETS_DIR, "sam_vit_h_4b8939.pth")
    MODEL_TYPE = "vit_h"

    device = 'cuda' if torch.cuda.is_available() else 'cpu'

    app.config['SAM'] = sam_model_registry[MODEL_TYPE](checkpoint=SAM_CHECKPOINT).to(device)
    app.config['PREDICTOR'] = SamPredictor(app.config['SAM'])

    app.config['LOCK'] = threading.Lock()


    app.register_blueprint(bp)
    return app