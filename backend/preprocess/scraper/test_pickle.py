import pickle

with open('./women_tops.pickle', 'rb') as file:
    scraped = pickle.load(file)
    for k, v in scraped.items():
        print(k)
        print(v)
        print('====')