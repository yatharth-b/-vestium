import pickle
import backend.image_process as ip
import sys

def process_clothes_pickle(path: str):
    data = None
    with open(path, "rb") as f:
        data = pickle.load(f)

    for product_link, [outfits_image_links, image_link] in data.items():
        print(product_link, outfits_image_links, image_link)
        ip.process_scraped_image(image_link, outfits_image_links, product_link)
    
    return data

if __name__ == "__main__":
    pickle_file_path = sys.argv[1]
    process_clothes_pickle(pickle_file_path)