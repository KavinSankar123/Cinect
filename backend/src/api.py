import time
from flask import request
from flask import Flask
from scraper import is_valid_url
from json import loads
from scraper import scrape_list

app = Flask(__name__)

# verify whether a username is valid
# /verifyUser?user=<username>
@app.route('/verifyUser')
def verify_user():
    letterboxd_username = request.args.get("user")
    result = is_valid_url(letterboxd_username)
    return {'response': result}

# return a movie recommendation (or potentially list of movie recs??? not sure yet)
# /getRecommendation?data={'users': string[], 'genres': string[], 
# 'streaming_platforms': string[], 'start_year': int, 'end_year': int}
@app.route('/getRecommendation')
def get_recommendation():
    json_str=str(request.args.get("data"))
    json = loads(json_str)
    users = json["users"]
    movies = [scrape_list(user) for user in users]
    genres = json["genres"]
    start_end_year = [json["start_year"], json["end_year"]]
    # in the backend backend, use the user's top rated movies for the input (rating >= 4.0)
    # input to recommender will be movie titles from letterbox that is not in correct format
    # call kavin function
    return {'response': f"Barbie"}
