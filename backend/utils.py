from pinscrape import pinscrape

def get_photos_from_pinterest(keyword):
  print(f'keyworded detected: {keyword}')
  details = pinscrape.scraper.scrape(keyword, "output", {}, 10, 15)
  return details['url_list']

def get_rec_from_web(description):
  print(description)
  return ["https://content.stylitics.com/images/collage/7b2c87c8a33b31c0d62cf980d549856ecbb25f88ba71c0?png=true"]

def get_rec_from_wardrobe(description):
  return ["link to image in wardrobe"]