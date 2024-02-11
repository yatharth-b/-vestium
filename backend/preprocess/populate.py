import pickle
import backend.process_image as ip
import sys
from multiprocessing import Pool

def process_cloth(tup):
    i, product_link, outfits_image_links, image_link = tup
    print(i, "started")
    print(product_link, outfits_image_links, image_link)
    ip.process_scraped_image(image_link, outfits_image_links, product_link)
    print(i, "ended")

def process_clothes_pickle(path: str, num_processes: int = 1):
    data = None
    with open(path, "rb") as f:
        data = pickle.load(f)

    inputs = []
    for product_link in data.keys():
        if data[product_link] is not None:
            inputs.append((len(inputs), product_link, data[product_link][0], data[product_link][1]))   
    with Pool(num_processes) as p:
        p.map(process_cloth, inputs)
    
    print(f"Finished processing {len(inputs)} items with {num_processes} processes. {len(data.keys()) - len(inputs)} items were skipped.")

if __name__ == "__main__":
    pickle_file_path = sys.argv[1]
    process_clothes_pickle(pickle_file_path, 10)