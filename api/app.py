from flask import Flask, send_from_directory, request, make_response, jsonify
import os
import requests
import json
from requests.auth import HTTPBasicAuth
import boto3
from botocore.client import ClientError
import subprocess
import sys
from natsort import natsorted
import cv2
import numpy as np
from utils import subprocess_check_output, s3_download_file, s3_upload_folder, s3_download_folder
import random
import base64
import png
import wquantiles
from PIL import Image
from io import BytesIO
import ast
from fpdf import FPDF
import datetime
from werkzeug.utils import secure_filename
import random
import pathlib
# load_dotenv('.env')

MAX_UNDO = 20
TRANSPARENCY_THRESH = 235
root_dir = os.path.dirname(os.getcwd())
thispath = os.path.dirname(os.path.abspath(__file__))
outerpath = os.path.dirname(thispath)
outerouterpath = os.path.dirname(outerpath)

UPLOAD_FOLDER = os.path.join(thispath, 'uploads')
ALLOWED_EXTENSIONS = {'mp4', 'mp3', 'avi', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__, static_folder='../build')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
flask_env = os.environ.get('FLASK_ENV', 'development')
s3_bucket = os.environ.get('S3_BUCKET', '')

s3 = boto3.client('s3')
s3_resource = boto3.resource('s3')
        
# API ROUTING

@app.route('/api/<path:path>', methods=['GET', 'POST', 'PUT', 'PATCH'])
def api(path):
    res = {}
    status_code = 200
    method = request.method
    query_params_str = request.query_string.decode()
    body = {}
    try:
        body = request.get_json(force=True)
    except:
        pass
    if path == 'upload':
        file = request.files['file']
        print(file)
        # return make_response({'data': res}, status_code)
        return upload(file)
    return make_response({'data': res}, status_code)

def upload(file):
    try:
        # file_name = f'test.mp4'
        file_name = secure_filename(file.filename)
        extension = ''.join(pathlib.Path(file_name).suffixes)
        basename = file_name.split('.')[0]
        file_name = f'{basename}_{random.randint(100, 999)}{extension}'
        print(file_name)
        path = os.path.join(app.config['UPLOAD_FOLDER'], file_name)

        if file:
            file.save(path)
            return jsonify({'success': True , 'fileName': file_name})
    except Exception as ex:
        return jsonify({'success': False, 'message': ex})

def download(name):
    return send_from_directory(app.config['UPLOAD_FOLDER'], name, as_attachment=True)

# STATIC ROUTING
@app.route('/')
def dex():
    return app.send_static_file('index.html')

@app.route('/manifest.json')
def manifest():
    return app.send_static_file('manifest.json')

@app.route('/favicon.ico')
def favicon():
    return app.send_static_file('favicon.ico')

@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(root_dir, 'build', 'static'), filename)

@app.route('/<path:path>')
def index(path):
    return app.send_static_file('index.html')
