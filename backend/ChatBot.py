from openai import OpenAI
from dotenv import load_dotenv
import os
import shutil
from pinscrape import pinscrape
from backend.PinterestImageScraper import PinterestImageScraper
import json
from backend.bot_utils import get_photos_from_pinterest, get_rec_from_wardrobe, get_rec_from_web, get_pinterest_similar_pinterest

load_dotenv()

class ChatBot():
    def __init__(self) -> None:
        self.conversation_history = [{"role": "system", "content": "You are a useful stylist that helps people plan their clothes along with finding them from pinterest(searching from web) and vectordatabases that are function calls"}]
        
        self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.keywords = []

        self.tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_photos_from_pinterest",
                    "description": "Give some outfit suggestions on some theme.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                        "theme": {
                            "type": "string", 
                            "description": "The theme user asked the outfit for while preserving gender"
                            }
                        }
                        },
                    "required": ["theme"],
                    },
                },
                {
                    "type": "function",
                    "function": {
                        "name": "get_pinterest_similar_pinterest",
                        "description": "I like some photos, please give some more similar PHOTOS/ ideas",
                        "parameters": {
                            "type": "object",
                            "properties": {
                                "like_list": {
                                    "type": "array",
                                    "items": {
                                        "type": "string",
                                    },
                                    "minItems": 1,
                                    "maxItems": 10,
                                    "description": "list of links that the assistant provided and the user likes"
                                }
                            }
                        }
                    }
                },
            {
                    "type": "function",
                    "function": {
                        "name": "get_anti_pinterest",
                        "description": "I don't like any ideas, please suggest something different",
                        "parameters": {
                            
                        }
                    }
                },
            {
                "type": "function",
                "function": {
                    "name": "get_rec_from_web",
                    "description": "I am happy with the suggestions and would now like to see recommendations from STORE ONLY",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "like_list": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                                "minItems": 1,
                                "maxItems": 10,
                                "description": "list of links that the assistant provided and the user likes"
                            }
                        }
                    }, "required": ["like_list"]
                }
            }, 
             {
                "type": "function",
                "function": {
                    "name": "get_rec_from_wardrobe",
                    "description": "Give outfit recommendations based on these selected outfits that they have (i.e. is in their wardrobe/ closet)",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "like_list": {
                                "type": "array",
                                "items": {
                                    "type": "string",
                                },
                                "minItems": 1,
                                "maxItems": 10,
                                "description": "list of links that the assistant provided and the user likes"
                            }
                        }
                    }, "required": ["like_list"]
                }
            }
        ]
        
    def act_on_user_input(self, uid):

        # message = [{"role": "user", "content": message}]
        # self.conversation_history.extend(message)
        data = self.client.chat.completions.create(
                    model="gpt-3.5-turbo-0125",
                    messages=self.conversation_history,
                    tools=self.tools,
                    )
        return self.act_on_model_output(data, uid)
    
    def get_photos_from_pinterest(self, keyword):
      print(f'keyworded detected: {keyword}')
      self.keywords.append(keyword)
      details = pinscrape.scraper.scrape(f'{",".join(self.keyword)} style fashion', "output", {}, 5, 15)
      # shutil.rmtree("output")
      return details['url_list']
        
    def act_on_model_output(self, data, uid):
        if data.choices[0].finish_reason == 'tool_calls':
            # Some functional call has to happen
            function = data.choices[0].message.tool_calls[0].function
            text = ""
            if function.name == 'get_photos_from_pinterest':
                theme = json.loads(function.arguments)['theme']
                output = get_photos_from_pinterest(theme)
                text = f"Here are some photos on {theme}. Please let me know which ones you like?"
            elif function.name == 'get_rec_from_web':
                like_list = json.loads(function.arguments)['like_list']
                output = get_rec_from_web(like_list)
                text = f"Here are some clothes from online stores."
            elif function.name == 'get_rec_from_wardrobe':
                like_list = json.loads(function.arguments)['like_list']
                output = get_rec_from_wardrobe(like_list, uid)
                text = f"Here are some clothes from your wardrobe that I think will suffice your needs."
            elif function.name == 'get_pinterest_similar_pinterest':
                like_list = json.loads(function.arguments)['like_list']
                next_keyword = get_pinterest_similar_pinterest(like_list)
                output = get_photos_from_pinterest(next_keyword)
                text = f"I see you like {next_keyword}. Please let me know which styles you like?"
            elif function.name == 'get_anti_pinterest':
                text = f"We are sorry to hear about that. Can you please tell what you are looking for?"
                messages = [{"role": "assistant", "content": text}]
                self.conversation_history.extend(messages)
                return {"conversation_history": self.conversation_history, "content": text}
            else:
                print(function.name)
                raise ValueError("Function being called by GPT doesn't exist.")

            if type(output) == dict:
                string_output = str(output)
            else:
                string_output = ', '.join(output)
            
            messages = [{"role": "assistant", "content": string_output}] # Because it is outputting, no need to add history here
            self.conversation_history.extend(messages)
            return {"links": output, "conversation_history": self.conversation_history, "content": text}
        else:
            output = data.choices[0].message.content
            messages = [{"role": "assistant", "content": output}]
            self.conversation_history.extend(messages)
            return {"conversation_history": self.conversation_history, "content": output}