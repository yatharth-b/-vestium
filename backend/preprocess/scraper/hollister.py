from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from collections import defaultdict
from selenium.webdriver.chrome.options import Options
from requests_html import HTMLSession
import os

import pickle

'''
Creates a pickle file such that it is a dictionary that maps link to product: ([list of outfits image], product image link)
'''

chrome_options = Options()
chrome_options.add_argument('--headless=new')

session = HTMLSession()
product_list = []

scraped = defaultdict(list)

type_of_cloth = 'womens-bottoms--1'
company_name = 'abercrombie'


r = session.get(f'https://www.{company_name}.com/shop/us/{type_of_cloth}?filtered=true&rows=90&start=90')
product_list = [i for i in list(r.html.links) if i.startswith("/shop/us/p/")][:51]

def get_rec_images(url):
    try:
        driver = webdriver.Chrome(options=chrome_options)
        driver.get(url)

        element = WebDriverWait(driver, 20).until(EC.presence_of_element_located((By.ID, "stylitics-widget")))
        temp = driver.find_elements(By.CLASS_NAME, "stylitics-card")
        links = []
        for i in range(1, len(temp) + 1):
            xpath_link = f"/html/body/main/section[1]/div[2]/section/div/div/div/div[1]/div/div[{i}]/div/div[3]/div/img"
            inner_outfit_image_link = (driver.find_element('xpath', xpath_link))
            inner_outfit_image_link = inner_outfit_image_link.get_attribute("src")
            # inner_outfit_image_link = driver.find_element('xpath', xpath_link)['src']
            links.append(f'{inner_outfit_image_link}')
            
        meta_tag = driver.find_element('css selector', 'meta[property="og:image"]')

        # Get the content attribute value
        og_image_content = meta_tag.get_attribute("content")
        return links, og_image_content
    except Exception as e:
        print(e)

j = 0



for i in product_list:
    file_no = j // 90
    url = f'https://www.{company_name}.com{i}'
    print(f'url: {url}')
    x = get_rec_images(url)
    scraped[f'https://www.{company_name}.com{i}'] = x
    if not os.path.exists(f"final_data/{company_name}"):
        os.makedirs(f"final_data/{company_name}")
    with open(f"final_data/{company_name}/{type_of_cloth}.pickle", 'wb') as file:
        pickle.dump(scraped, file)
        
    print(j)
    j += 1
    

print(f'Items saved to {type_of_cloth}.pickle')