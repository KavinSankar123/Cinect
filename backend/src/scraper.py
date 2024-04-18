import requests
from bs4 import BeautifulSoup
from bs4.element import Tag
from typing import List

from utility_functions import stars2val

_domain = 'https://letterboxd.com/'


# return true if the username represents a user on the site
def is_valid_url(letterboxd_username: str) -> bool:
    list_url = username_to_url(letterboxd_username)
    page_response = requests.get(list_url)
    return page_response.ok


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
    print(page_response)
    # Check to see page was downloaded correctly
    page_response.raise_for_status()

    return BeautifulSoup(page_response.content, 'lxml')


def scrape_page(page_soup: BeautifulSoup) -> list:
    page_films = []

    films = page_soup.find_all('li', {'class': 'poster-container'})
    if not films:
        return []

    # Iterate through films
    for film in films:
        film_dict = scrape_film(film)
        page_films.append(film_dict)

    return page_films


def scrape_film(film_html: Tag) -> dict:
    try:
        film_dict = {}
        film_dict["title"] = film_html.find("div", {"class": "poster"}).attrs['data-film-slug']
        starval = film_html.select('span[class*="rating"]')[-1]
        film_dict["rating"] = stars2val(starval.text)
        return film_dict
    except:
        return {}


def extract_titles(users: List[str]) -> List[str]:
    movies = []
    for user in users:
        movies.extend(scrape_list(user))

    input_movie_set = set()
    for title in movies:
        if len(title) > 0 and title["rating"] >= 4.0:
            input_movie_set.add(title["title"])
    return list(input_movie_set)
