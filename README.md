Vestium is your new AI-powered fashion and shopping assistant.

# The problem Vestium solves
Have you ever felt like you want to get an outfit that looks ‘casual yet smart’ but can’t exactly find what you want online? We've got you covered. Vestium is your AI-powered styling assistant and mood-board. Simply describe the vibe and kind of outfit you would like to buy or match, and it’ll scour the web for you. Try out prompts like _‘normcore casualwear’_, _‘mafia-themed party’_ or _‘ethnic dresses’_ and Vestium provides you plenty of options and even generates new ideas from Pinterest. Chat with the assistant and narrow down your search until something catches your eye, and pick yourself the perfect outfit. You’ll get matches that link to available items on online clothing stores, or ask Vestium to check your existing wardrobe for a match. Our app returns a carefully compiled, AI-matched mood-board of clothes pairings from across the internet so you don't have to spend hours looking at every brand’s website to shop for new clothes.

All in all, Vestium is the faster way to search for new clothes, as well as ideate when you may not know ‘exactly’ what you want.


# Challenges we ran into
One of our biggest challenges was data collection - no dataset could describe clothes as well as their best recommendations and link them to where a user could access them. A ground truth of what is fashionable was also difficult to formalize. To overcome this, we scraped websites along with product links. We also incorporated Pinterest as a Retrieval-Augmented Generation (RAG) technique as it is widely used as an ideation board.

Another challenge was in balancing user conversation and vector lookups - it is a challenge to know when the user wants to discuss and ideate, and when they would like to finalize their choice and initiate a lookup. This brainstorming was made possible by utilizing GPT functionals allowing us to integrate different processes between a basic chatbot.

We learnt to index and perform vector similarity searches with Pinecone, and manipulate information given out by the GPT Vision API. We also learned the use of vector embeddings to compare text descriptions effectively and objectively, to identify patterns in matching outfits.


# Technologies we used
We used OpenAI API, GPT functional agents, LLaVa model, Pinecone vector database, Flask, Typescript, Next.js and Selenium.

We utilized **requests_html** to get links to various products on different brand market pages. We then used **Selenium** to visit these links and get individual product images with their links. We also utilized a Pinterest scraper so that we could search and present images based on relevant keywords. 

The main glitter of this project was **OpenAI’s chat GPT**, **functional agents**, **LLaVa’s vision GPT** and the **Pinecone vector database**. Through the combination of these, we analyse key points in distinct images and find the most top recommendations.

Finally, we used **flask** and **typescript** to create our website.

# Video demo

https://www.loom.com/share/6e3a5c8d25094fa1b32ef34a303a4e80?sid=2a502d06-b911-4e08-a2e8-1b7dec15a130
