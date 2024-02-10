import pickle

with open('./womens-accessories.pickle', 'rb') as file:
    scraped = pickle.load(file)
    for k, v in scraped.items():
        print(k)
        print(v)
        print('====')