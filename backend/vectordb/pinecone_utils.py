from typing import List
from dotenv import load_dotenv
import uuid

from pinecone import Pinecone
from backend.ai.openai_utils import get_text_embedding

load_dotenv()
pinecone_client = Pinecone()

# image_link, product_link
# scraped_data: { [product_link]: ([ outfits_image_links ], image_link)]}

def insert_item(item_description: str, image_link: str, source: str, **metadata):
    text_embedding = get_text_embedding(item_description)
    index = pinecone_client.Index("image-embeddings")
    res = index.upsert(
        [(
            image_link,
            text_embedding,
            {"image_link": image_link, "source": source, **metadata},
        )]
    )


def insert_uploaded_item(item_description: str, image_link: str, user_id: str, name: str):
    insert_item(item_description, image_link, "User", user_id=user_id, name=name)


def insert_scraped_item(
    item_description: str, image_link: str, outfit_links: List[str], product_link: str
):
    insert_item(
        item_description,
        image_link,
        "Scraped",
        outfit_links=outfit_links,
        product_link=product_link,
    )


def query_item(item_description: str, filter, top_k: int = 3, min_confidence: float | None = None):
    text_embedding = get_text_embedding(item_description)
    index = pinecone_client.Index("image-embeddings")
    results = index.query(vector=text_embedding, top_k=top_k, filter=filter, include_metadata=True,)["matches"]
    
    if min_confidence is not None:
        results = [res for res in results if res['score'] >= min_confidence]
    return results
