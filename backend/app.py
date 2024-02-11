from flask import Flask, request
from flask_cors import CORS
from dotenv import load_dotenv
import json
import base64
import openai
from backend.ChatBot import ChatBot
from backend.process_image import process_uploaded_image
import os

app = Flask(__name__)
CORS(app)
load_dotenv()

PORT = os.getenv("PORT")
if PORT is not None:
    PORT = int(PORT)
else:
    PORT = 3001

chatbot_text = ChatBot()

@app.route("/health")
def check_connectivity():
    return {"hello": "world"}

@app.route("/recommend/chat", methods=["POST"])
def chat_gpt_3():
    data = request.get_json()
    output = chatbot_text.act_on_user_input(data['message'])
    return json.dumps(output)

@app.route("/wardrobe", methods=["POST"])
def add_image_to_vectordb():
    data = request.get_json()
    user_id = data["userId"]
    image_url = data["imageUrl"]

    try:
        process_uploaded_image(image_url, user_id)
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    return {"status": "success"}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)