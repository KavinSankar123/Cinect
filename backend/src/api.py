import json

from flask import Flask, jsonify
from flask import request
from flask_cors import CORS, cross_origin

from ItemItemWithKNNRec import ItemItemWithKNNRec
from scraper import extract_titles
from scraper import is_valid_url

from flask_cors import cross_origin

app = Flask(__name__)
cors = CORS(app, origins=["https://dynamic-tolerant-boa.ngrok-free.app", "https://cinect-run-6bhdfkg7yq-ul.a.run.app"])
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/")
@cross_origin()
def root():
  return "Connected to backend!"

# verify whether a username is valid
# /verifyUser?user=<username>
@app.route('/verifyUser')
@cross_origin()
def verify_user():
    letterboxd_username = request.args.get("user")
    result = is_valid_url(letterboxd_username)
    return {'response': result}


# return a movie recommendation (or potentially list of movie recs??? not sure yet)
# /getRecommendation?data={'users': string[], 'genres': string[], 
# 'streaming_platforms': string[], 'start_year': int, 'end_year': int}
@app.route('/getRecommendation')
@cross_origin()
def get_recommendation():
    json_str = str(request.args.get("data"))
    json_obj = json.loads(json_str)
    input_movie_list = extract_titles(json_obj["users"])
    genres = json_obj["genres"]
    try:
        start_end_year = [int(json_obj["start_year"]), int(json_obj["end_year"])]
    except:
        start_end_year = [1824, 2024]

    print(input_movie_list)
    print(genres)
    print(start_end_year)

    # in the backend backend, use the user's top rated movies for the input (rating >= 4.0)
    # input to recommender will be movie titles from letterbox that is not in correct format
    # call kavin function

    item_item_recommender = ItemItemWithKNNRec()
    movie_rec = item_item_recommender.get_group_recommendation(
        input_movie_list=input_movie_list,
        desired_genres=genres,
        start_end_year=start_end_year
    )
    print({'response': movie_rec})
    return jsonify({'response': movie_rec})
