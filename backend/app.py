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

@app.route("/health")
def check_connectivity():
    return {"hello": "world"}

@app.route("/recommend/chat", methods=["POST"])
def chat_gpt_3():
    data = request.get_json()

    conversation_history = data["conversation_history"] if "conversation_history" in data else None
    keywords = data["keywords"] if "keywords" in data else None
    user_id = data["userId"] if "userId" in data else ""
    chatbot_text = ChatBot(conversation_history, keywords)
    output = chatbot_text.act_on_user_input(user_id)
    return json.dumps(output)

@app.route("/wardrobe", methods=["POST"])
def add_image_to_vectordb():
    data = request.get_json()
    user_id = data["userId"]
    image_url = data["imageUrl"]
    name = data["name"]

    try:
        print("here1")
        process_uploaded_image(image_url, user_id, name)
        print("here2")
    except Exception as e:
        print("ERROR", e)
        return {"status": "error", "message": str(e)}
    
    return {"status": "success"}

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=PORT)