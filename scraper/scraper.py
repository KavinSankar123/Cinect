from utility_functions import stars2val
from bs4 import BeautifulSoup
from bs4.element import Tag
import requests

_domain = 'https://letterboxd.com/'

def scrape_list(letterboxd_username: str) -> list:
    list_url = username_to_url(letterboxd_username)
    list_films = []

    while True:
        page_soup = get_page(list_url)
        page_films = scrape_page(page_soup)
        list_films.extend(page_films)

        # Check if there is another page of ratings and if yes, continue to that page
        next_button = page_soup.find('a', class_='next')
        if next_button is None:
            break
        else:
            list_url = _domain + next_button['href']
    
    return list_films

def username_to_url(letterboxd_username: str) -> str:
    return _domain + letterboxd_username + "/films/"

def get_page(list_url: str) -> BeautifulSoup:
    page_response = requests.get(list_url)
    
    # Check to see page was downloaded correctly
    if page_response.status_code != 200:
        return print("Error: Could not load page.")

    return BeautifulSoup(page_response.content, 'lxml')

def scrape_page(page_soup: BeautifulSoup) -> list:
    page_films = []
    
    # Grab the main film grid
    table = page_soup.find('ul', class_='poster-list')
    if table is None:
        return
    
    films = table.find_all('li')
    if films == []:
        return 
    
    # Iterate through films
    for film in films:
        film_dict = scrape_film(film)    
        page_films.append(film_dict)

    return page_films
        
def scrape_film(film_html: Tag) -> dict:
    film_dict = {}
    film_dict["title"] = film_html.find("div", {"class" : "poster"}).attrs['data-film-slug']

    starval = film_html.select('span[class*="rating"]')[-1].get_text()
    film_dict["rating"] = stars2val(starval)
    
    return film_dict
