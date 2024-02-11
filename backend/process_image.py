from typing import List
from backend.ai.replicate_utils import llava_image_to_text_single_item, llava_image_to_text_multiple_items
from backend.ai.openai_utils import gpt_vision_item_description, extract_unique_items
from backend.vectordb.pinecone_utils import insert_uploaded_item, insert_scraped_item, query_item
import random

def process_scraped_image(image_link: str, outfit_links: List[str], product_link: str):
    item_description = llava_image_to_text_single_item(image_link)
    insert_scraped_item(item_description, image_link, outfit_links, product_link)

def process_uploaded_image(image_link: str, user_id: str):
    image_description = llava_image_to_text_multiple_items(image_link)   
    insert_uploaded_item(image_description, image_link, user_id)
    
def recommend_items(image_links: List[str], user_id: str, only_store: bool = True):
    chosen_link = random.sample(image_links, 1)
    
    # item_descriptions = gpt_vision_item_description(chosen_link[0])
    item_descriptions = ['Vertical striped shirt, blue and white, with a relaxed fit, short sleeves, and an open collar.', 'White shorts, knee-length, with a tailored fit and a flat front design.', 'White slide sandals with a wide strap over the foot.']
    print(item_descriptions)
    # filtered_descriptions = extract_unique_items(item_descriptions)
    
    # all_item_descriptions = []
    # for image_link in image_links:
    #     item_descriptions = gpt_vision_item_description(image_link)
    #     all_item_descriptions.extend(item_descriptions)
    
    # all_item_descriptions = "\n\n".join(all_item_descriptions)
    
    # print(all_item_descriptions)
    # filtered_descriptions = extract_unique_items(all_item_descriptions)
    # print(filtered_descriptions)
    
    for desc in item_descriptions:
        if only_store:
            a = query_item(desc, { "source": "Scraped" }, top_k=3)
            print("here9", len(a))
        else:
            a = query_item(desc, { "source": "User", "user_id": user_id }, top_k=3, min_confidence=0.8)
            print("here8", len(a))
            if len(a) < 3:
                a.extend(query_item(desc, { "source": "Scraped" }, top_k=3 - len(a)))
            print("here7", len(a))
        print("here6", a[0])
        print("here5", desc)
    print(chosen_link[0])

if __name__ == "__main__":
    # print(process_uploaded_image("https://img.abercrombie.com/is/image/anf/KIC_139-3446-1203-100_prod1?policy=product-medium&wid=350&hei=438", ""))
    recommend_items([
        "https://i.pinimg.com/564x/62/7c/ef/627cef7342f04f22c7a0aef496cb028f.jpg",
        "https://i.pinimg.com/564x/f2/78/72/f278729c5fc48b2cb577fb595212a39b.jpg",
        "https://i.pinimg.com/564x/9a/c0/4c/9ac04cfef297d15a5310394f14f67796.jpg"
    ], "")
    
    
# image_description = """
    # In the image, there is a person standing in front of a wall with various paintings. The person is wearing a white sleeveless top, which appears to be a tank top or a sleeveless vest. The top is loose-fitting and has a ribbed texture. The person is also wearing white pants that are straight-legged and appear to be made of a lightweight fabric, possibly cotton or linen. The pants are full-length and are cuffed at the bottom. The person is wearing beige slip-on shoes that have a low-top design and a simple, flat sole. The overall style of the clothing suggests a casual, relaxed look, suitable for warm weather or a laid-back setting."""
    # image_description = """In the image, there is a man standing on a cobblestone street. \
    # He is wearing a light green, short-sleeved button-up shirt with a collar. \
    # The shirt appears to be made of a lightweight fabric, suitable for a warm climate or casual setting. \
    # 
    # He has paired the shirt with white shorts, which are a classic summer choice. \
    # The shorts are knee-length and have a simple design, complementing the shirt well. \
    # On his feet, he is wearing white sneakers, which are a versatile and comfortable choice for walking around. \
    # The sneakers have a low-top design, which is practical for everyday wear. \
    # 
    # The man is also wearing a watch on his left wrist, which adds a touch of sophistication to his outfit. \
    # The watch has a dark face and a strap that matches the color of his shorts, creating a cohesive look. \
    # Overall, the man's outfit is casual and summery, with a color palette that is harmonious and relaxed. \s
    # The clothing items are well-chosen for the setting and the weather, suggesting that he is dressed \
        # for a leisurely day out in a warm climate."""