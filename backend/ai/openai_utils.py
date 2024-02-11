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
            {
                "role": "user",
                "content": description,
            },
        ],
        temperature=0.5,
    )
    return response.choices[0].message.content

def gpt_vision_item_description(image_link: str) -> List[str]:
    response = client.chat.completions.create(
        model="gpt-4-vision-preview",
        messages=[
            {"role": "system", "content": "You are a data extractor that helps \
extract detailed clothing item descriptions from images of outfits. Your job is to talk about ALL clothing items \
in this image in detail without describing anything else. You should talk only about clothing items and not accessories. \
Each item description should be of at most 40 words. Please seperate each extracted item description \
with two new line characters, and provide nothing extra."},
            {
                "role": "user",
                "content": [{
                    "type": "image",
                    "image_url": image_link,
                }],
            },
        ],
        temperature=0.5,
        max_tokens=1736,
    )
    
    message = response.choices[0].message.content
    items = [desc for desc in message.split("\n") if desc]
    return items


if __name__ == "__main__":
    # embedding = get_text_embedding("These are casual pants with a natural, leafy print, featuring various shades of green and white. The pants have an elastic waistband for a comfortable fit and likely a drawstring for adjustment. The leg hems also appear to have elastic, providing a snug fit around the ankles. The fabric looks soft and lightweight, suitable for relaxed wear.")
    # print(embedding)
    
    print(gpt_vision_item_description("https://i.pinimg.com/564x/9a/c0/4c/9ac04cfef297d15a5310394f14f67796.jpg"))
    # print(gpt_vision_item_description("https://i.pinimg.com/originals/94/e5/9b/94e59bbe4341bb6f73ffdd2216063f2a.jpg"))
    
    
# The description of each item should NOT mention other items, the person wearing it, \
# or the outfit. For example, the description of pants should not mention anything related to shirts. \
# Do not make up information on your own. \
# There should be no duplicates in the clothing items. \
# Return the final result in the following format and nothing extra: \n \
#     [{ \"item\": \"clothing item\", \"description\": \"detailed description from the text\" }]",