from typing import List
from backend.ai.replicate_utils import llava_image_to_text_single_item, llava_image_to_text_multiple_items
from backend.ai.openai_utils import filter_image_description
from backend.vectordb.pinecone_utils import insert_uploaded_item, insert_scraped_item

def process_scraped_image(image_link: str, outfit_links: List[str], product_link: str):
    item_description = llava_image_to_text_single_item(image_link)
    insert_scraped_item(item_description, image_link, outfit_links, product_link)

def process_uploaded_image(image_url: str, user_id: str):
    image_description = llava_image_to_text_multiple_items(image_url)
    
    # image_description = """
    # In the image, there is a person standing in front of a wall with various paintings. The person is wearing a white sleeveless top, which appears to be a tank top or a sleeveless vest. The top is loose-fitting and has a ribbed texture. The person is also wearing white pants that are straight-legged and appear to be made of a lightweight fabric, possibly cotton or linen. The pants are full-length and are cuffed at the bottom. The person is wearing beige slip-on shoes that have a low-top design and a simple, flat sole. The overall style of the clothing suggests a casual, relaxed look, suitable for warm weather or a laid-back setting."""
    # image_description = """In the image, there is a man standing on a cobblestone street. \
    # He is wearing a light green, short-sleeved button-up shirt with a collar. \
    # The shirt appears to be made of a lightweight fabric, suitable for a warm climate or casual setting. \
    
    # He has paired the shirt with white shorts, which are a classic summer choice. \
    # The shorts are knee-length and have a simple design, complementing the shirt well. \
    # On his feet, he is wearing white sneakers, which are a versatile and comfortable choice for walking around. \
    # The sneakers have a low-top design, which is practical for everyday wear. \
    
    # The man is also wearing a watch on his left wrist, which adds a touch of sophistication to his outfit. \
    # The watch has a dark face and a strap that matches the color of his shorts, creating a cohesive look. \
    # Overall, the man's outfit is casual and summery, with a color palette that is harmonious and relaxed. \s
    # The clothing items are well-chosen for the setting and the weather, suggesting that he is dressed \
        # for a leisurely day out in a warm climate."""
       
    # print("Original:") 
    # print(image_description)
    filtered_description = filter_image_description(image_description)
    # print("\nFiltered:")
    # print(filtered_description)
    item_descriptions = filtered_description.split("\n")
    for item in item_descriptions:
        insert_uploaded_item(item, image_url, user_id)

if __name__ == "__main__":
    print(process_uploaded_image("https://img.abercrombie.com/is/image/anf/KIC_139-3446-1203-100_prod1?policy=product-medium&wid=350&hei=438"))