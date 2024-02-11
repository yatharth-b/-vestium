import pickle

with open('./mens-bottoms--1.pickle', 'rb') as file:
    scraped = pickle.load(file)
    for k, v in scraped.items():
        print(k)
        print(v)
        print('====')