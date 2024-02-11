import pickle
import backend.image_process as ip
import sys
from multiprocessing import Pool

def process_clothes_pickle(path: str, num_processes: int = 1):
    data = None
    with open(path, "rb") as f:
        data = pickle.load(f)

    def process_image(product_link):
        outfits_image_links, image_link = data[product_link]
        print(product_link, outfits_image_links, image_link)
        ip.process_scraped_image(image_link, outfits_image_links, product_link)
        
    with Pool(num_processes) as p:
        p.map(process_image, data.keys())

if __name__ == "__main__":
    pickle_file_path = sys.argv[1]
    process_clothes_pickle(pickle_file_path, 10)