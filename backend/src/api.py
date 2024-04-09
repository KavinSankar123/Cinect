import time
from flask import request
from flask import Flask
from scraper import is_valid_url
from json import loads

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
    # for each user call scrape_list()
    genres = json["genres"]
    # filter the list by genre
    # transform movie names to movie ids, cluster each remaining movie and then run kavin's algorithm
    start_year = json["start_year"]
    end_year = json["end_year"]
    # filter by year
    return {'response': f"Barbie"}
