import replicate
from dotenv import load_dotenv

load_dotenv()

def llava_image_to_text_single_item(image_url: str):
    res = replicate.run(
        "yorickvp/llava-v1.6-34b:41ecfbfb261e6c1adf3ad896c9066ca98346996d7c4045c5bc944a79d430f174",
        input={
            "image": image_url,
            "top_p": 0.7,
            "prompt": """Talk about the clothing item in detail in atmost 50 words. \
                Talk about the clothing item without any other context, please.""",
            "max_tokens": 1024,
            "temperature": 0.2,
        },
    )
    text = "".join([i for i in res])
    return text

def llava_image_to_text_multiple_items(image_url: str):
    res = replicate.run(
        "yorickvp/llava-v1.6-34b:41ecfbfb261e6c1adf3ad896c9066ca98346996d7c4045c5bc944a79d430f174",
        input={
            "image": image_url,
            "top_p": 0.7,
            "prompt": """Talk about the clothing items in this image in detail. \
                Please only talk about the clothing items and don't describe anything else, without \
                any other context.""",
            "max_tokens": 1024,
            "temperature": 0.2,
        },
    )
    text = "".join([i for i in res])
    return text

if __name__ == "__main__":
    print(llava_image_to_text_single_item("https://i.pinimg.com/564x/ec/45/72/ec45726defa0be585be75de9d444876a.jpg"))