from flask import Blueprint, request, jsonify, current_app
from flask_cors import cross_origin
import torch
import numpy as np
from PIL import Image

embeddings_bp = Blueprint('get_embeddings', __name__)

@embeddings_bp.route('/get_embeddings', methods=['POST'])
@cross_origin()
def get_embeddings():
    image = request.files['image']
    image = Image.open(image).convert('RGB')
    image_array = np.array(image)
    
    # lock = current_app.config['LOCK']
    # with lock:
    predictor = current_app.config['PREDICTOR']
    predictor.set_image(image_array)

    with torch.no_grad():
        embeddings = predictor.get_image_embedding()
        print(embeddings.shape)

    embeddings_list = embeddings.cpu().numpy().reshape(-1).tolist()
    print(len(embeddings_list))

    return jsonify({
        'message': 'Embeddings generated', 'embeddings': embeddings_list, 'shape': embeddings.shape})
