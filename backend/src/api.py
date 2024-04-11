import json

from flask import Flask
from flask import request

from ItemItemWithKNNRec import ItemItemWithKNNRec
from scraper import extract_titles
from scraper import is_valid_url

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
    json_str = str(request.args.get("data"))
    json_obj = json.loads(json_str)

    input_movie_list = extract_titles(json_obj["users"])
    genres = json_obj["genres"]
    start_end_year = [json_obj["start_year"], json_obj["end_year"]]

    # in the backend backend, use the user's top rated movies for the input (rating >= 4.0)
    # input to recommender will be movie titles from letterbox that is not in correct format
    # call kavin function

    item_item_recommender = ItemItemWithKNNRec()
    movie_rec = item_item_recommender.get_group_recommendation(
        input_movie_list=input_movie_list,
        desired_genres=genres,
        start_end_year=start_end_year
    )

    return {'response': f"{movie_rec}"}
