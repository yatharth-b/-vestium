from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import json
import base64
import openai
from ChatBot import ChatBot


app = Flask(__name__)
CORS(app)
load_dotenv()

chatbot_text = ChatBot()

@app.route("/health")
def check_connectivity():
    return {"hello": "world"}

@app.route("/recommend/chat_text", methods=["POST"])
def chat_gpt_3():
    data = request.get_json()
    output = chatbot_text.act_on_user_input(data['message'])
    return json.dumps(output)

@app.route("/recommend/chat_image", methods=["POST"])
def chat_vision():
    data = request.get_json()
    