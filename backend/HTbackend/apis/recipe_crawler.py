import requests
from bs4 import BeautifulSoup
import json

def ingredientsFromURL(url):
    r = requests.get(url)
    soup = BeautifulSoup(r.content, 'html5lib')

    instructions_data = []
    instructions = soup.find('section', attrs={'id': 'section--instructions_1-0'}).div
    if instructions.div.ol:
        for step in instructions.div.ol.findAll('li'):
            heading = step.div.span.text
            text = "".join(p.text + '\n' for p in step.findAll('p'))
            instructions_data.append({
                "heading":heading,
                "text":text
            })
    else:
        for step in instructions.div.ul.findAll('li'):
            heading = step.div.span.text
            text = "".join(p.text + '\n' for p in step.findAll('p'))
            instructions_data.append({
                "heading":heading,
                "text":text
            })

    ingredients = soup.find('ul', attrs={'class': 'structured-ingredients__list'})
    ingredients_data = []

    if ingredients:

        for ingredient in ingredients.findAll('li'):

            quantity = unit = name = None
            try:
                quantity = ingredient.find('span', {'data-ingredient-quantity':'true'}).text
                unit = ingredient.find('span', {'data-ingredient-unit':'true'}).text
                name = ingredient.find('span', {'data-ingredient-name':'true'}).text

                ingredients_data.append({
                    "quantity": quantity,
                    "unit": unit,
                    "name": name
                })

            except AttributeError:
                pass


    return instructions_data, ingredients_data


def getRecipes(search_query):
    print(search_query)
    URL = "https://www.simplyrecipes.com/search?q="
    search_url = URL + search_query

    r = requests.get(search_url)

    soup = BeautifulSoup(r.content, 'html5lib')

    data = []

    i = 0
    for div in soup.findAll('div', attrs = {'class': 'comp card-list__item mntl-block'}):
        footer = div.find('div', attrs={'class': 'loc card__footer'})
        try:
            name = div.find('span', attrs={'class': 'card__title'}).span.text.strip()
            timeRequired = footer.span.span.text.strip()
            url = div.find('a')['href']
            imageUrl = div.find('img')['data-src']

            instructions_data, ingredients_data = ingredientsFromURL(url)

            if ingredients_data == []:
                continue
            
            
            data.append({
                "name": name,
                "timeRequired": timeRequired,
                "url": url,
                "imageUrl": imageUrl,
                "instructions": instructions_data,
                "ingredients" : ingredients_data
            })

            if i < 7:
                i += 1
                print(i)
            else:
                break

        except AttributeError:
            pass

    return data

# getRecipes("pizza")

# SAVE DATA AS JSON
# tags = ["pizza", "sandwiches", "burgers", "fries"]
# data = []
# for tag in tags:
#     tag_data = getRecipes(tag)
#     for d in tag_data:
#         d["tag"] = tag
#         data.append(d)
#
# json_data = json.dumps(data, indent=2)
# print(json_data)
#
# with open("recipes.json", "w") as recipe_file:
#     recipe_file.write(json_data)