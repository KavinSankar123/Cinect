import sys
import os
import requests

current_dir = os.path.dirname(os.path.abspath(__file__))
scraper_dir = os.path.join(current_dir, '..', 'scraper')
sys.path.append(scraper_dir)

api_read_access_key = "<enter your API key here>"


def get_bearer():
    return {"accept": "application/json", "Authorization": f"Bearer {api_read_access_key}"}


def get_movie(movie_name: str) -> dict:
    url = f"https://api.themoviedb.org/3/search/movie?query={movie_name}"
    response = requests.get(url, headers=get_bearer())
    response.raise_for_status()

    return response.json()


def get_genres() -> dict:
    url = "https://api.themoviedb.org/3/genre/movie/list?language=en"
    response = requests.get(url, headers=get_bearer())
    response.raise_for_status()

    return response.json()['genres']


def get_movie_genre(movie_name: str) -> list:
    movie_info = get_movie(movie_name)
    genre_list_dict = get_genres()

    movie_genre_ids = movie_info['results'][0]['genre_ids']

    associated_genres = []

    for movie_gen_id in movie_genre_ids:
        for genre_id in genre_list_dict:
            if genre_id['id'] == movie_gen_id:
                associated_genres.append(genre_id['name'])

    return associated_genres
