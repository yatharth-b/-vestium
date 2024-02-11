from pinscrape import pinscrape
from openai import OpenAI
import os
import shutil
from dotenv import load_dotenv
from backend.process_image import recommend_items

load_dotenv()
client = OpenAI()

def get_photos_from_pinterest(keyword):
  print(f'keyworded detected: {keyword}')
  details = pinscrape.scraper.scrape(f'{keyword} style fashion', "output", {}, 10, 15)
  shutil.rmtree("output")
  return details['url_list']

def get_rec_from_web(links):
  return recommend_items(links, only_store=True)

def get_rec_from_wardrobe(links, user_id):
  return recommend_items(links, user_id, only_store=False)

def get_pinterest_similar_pinterest(links):
  descriptions = []
  for link in links:
    response = client.chat.completions.create(
      model="gpt-4-vision-preview",
      messages=[
        {
          "role": "system",
          "content": "As a fashion enthusiast, please describe the clothes and styles in the photo. \
            Please do not talk about the person or surroundings and only concentrate in the styling.",
        },
        {
          "role": "user",
          "content": [
            {
              "type": "image_url",
              "image_url": {
                "url": link,
              },
            },
          ],
        }
      ],
      max_tokens=300,
    )

    descriptions.append(response.choices[0].message.content)
  description_string = ' ;'.join(descriptions)
  
  response = client.chat.completions.create(
        model="gpt-4-0125-preview",
        messages=[
            {"role": "system", "content": "As a fashion stylist of 20 years of experience, please tell the keywords that describe the \
              similarities between the following descriptions of fashion items that are unique to this group and are generally \
            not present in generic fashion items in 2 words."},
            {
                "role": "user",
                "content": description_string,
            },
        ],
        temperature=0.4,
    )
  
  return response.choices[0].message.content
