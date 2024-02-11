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

    if len(data['conversation_history']) == 0:
        data['conversation_history'].insert(0, {"user": "system", "content": "You are a useful stylist that helps people plan their clothes along with finding them from pinterest(searching from web) and vectordatabases that are function calls"})

    chatbot_text.conversation_history = data['conversation_history']
    output = chatbot_text.act_on_user_input('userId')
    return json.dumps(output)

@app.route("/wardrobe", methods=["POST"])
def add_image_to_vectordb():
    data = request.get_json()
    user_id = data["userId"]
    image_url = data["imageUrl"]
    name = data["name"]

    try:
        process_uploaded_image(image_url, user_id, name)
    except Exception as e:
        return {"status": "error", "message": str(e)}
    
    return {"status": "success"}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)