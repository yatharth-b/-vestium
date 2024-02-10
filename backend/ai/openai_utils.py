from typing import List, Dict
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

def get_text_embedding(text: str) -> List[float]:
    response = client.embeddings.create(model="text-embedding-ada-002", input=text)
    return response.data[0].embedding

def filter_image_description(description: str) -> str:
    response = client.chat.completions.create(
        model="gpt-4-0125-preview",
        messages=[
            {"role": "system", "content": "You are a data cleaner that helps \
                extract detailed clothing item descriptions from textual data. \
                Your job is to split descriptions of outfits into detailed descriptions of individual clothes \
                without losing much information present in the original description. \
                The new description for each item should retain most of its original description. \
                You should talk only about clothing items and not accessories. \
                Please seperate each extracted item with a new line character, and nothing extra."},
                    # The description of each item should NOT mention other items, the person wearing it, \
                    # or the outfit. For example, the description of pants should not mention anything related to shirts. \
                    # Do not make up information on your own. \
                    # There should be no duplicates in the clothing items. \
                    # Return the final result in the following format and nothing extra: \n \
                    #     [{ \"item\": \"clothing item\", \"description\": \"detailed description from the text\" }]",
            {
                "role": "user",
                "content": description,
            },
        ],
        temperature=0.5,
    )
    return response.choices[0].message.content
