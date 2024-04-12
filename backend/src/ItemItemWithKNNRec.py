import os
from typing import List
import numpy as np
import pandas as pd
import joblib
import datetime
from os import environ
from fuzzywuzzy import fuzz
from google.cloud import firestore
from google.oauth2 import service_account


class ItemItemWithKNNRec:
    def __init__(self):
        self.movies = pd.DataFrame(self.fetch_movie_info())
        # self.movies = pd.read_csv('movies_large.csv')
        self.movie_titles = dict(zip(self.movies['movieId'], self.movies['title']))
        self.k = 100

        self.Q = joblib.load("src/saved_Q.joblib")
        self.user_mapper = joblib.load("src/saved_user_mapper.joblib")
        self.movie_mapper = joblib.load("src/saved_movie_mapper.joblib")
        self.user_inv_mapper = joblib.load("src/saved_user_inv_mapper.joblib")
        self.movie_inv_mapper = joblib.load("src/saved_movie_inv_mapper.joblib")
        self.saved_kNN = joblib.load("src/kNN_model.joblib")

    def fetch_movie_info(self):
        key_file_path = os.getcwd() + '/src/cinectmoviedb-665d236ba447.json'
        print(key_file_path)
        environ['GOOGLE_APPLICATION_CREDENTIALS'] = key_file_path
        project = 'cinectmoviedb'
        client = firestore.Client(project=project, database='cinectdatabase')

        collection_ref = client.collection('movie_info')
        page_size = 50
        query = collection_ref.limit(page_size)
        all_documents = []

        while True:
            docs = query.get()
            for d in docs:
                all_documents.append(d.to_dict())

            if len(docs) < page_size:
                break

            last_doc = docs[-1]
            query = collection_ref.start_after(last_doc)

        return all_documents

    def find_similar_movies(self, movie_id, X, movie_mapper, movie_inv_mapper) -> List:
        """
        Finds k-nearest neighbours for a given movie id.

        Args:
            movie_id: id of the movie of interest
            X: user-item utility matrix

        Output: returns list of k similar movie ID's
        """
        X = X.T
        neighbour_ids = []

        movie_ind = movie_mapper[movie_id]
        movie_vec = X[movie_ind]
        if isinstance(movie_vec, np.ndarray):
            movie_vec = movie_vec.reshape(1, -1)

        neighbour = self.saved_kNN.kneighbors(movie_vec, return_distance=False)
        for i in range(0, self.k):
            n = neighbour.item(i)
            neighbour_ids.append(movie_inv_mapper[n])
        neighbour_ids.pop(0)
        return neighbour_ids

    def rank_movie_score(self, nested_list_of_movies: List[list]):
        movie_freq = {}
        for single_cluster_rec in nested_list_of_movies:
            for movie in single_cluster_rec:
                if movie in movie_freq:
                    movie_freq[movie] += 1
                else:
                    movie_freq[movie] = 1

        highest_freq = sorted(movie_freq.items(), key=lambda x: x[1], reverse=True)
        final_list = []

        for m in highest_freq:
            final_list.append(m[0])
        return final_list

    def filter_movies(self, initial_recs: List[list], genres: set, start_end_year: List[int]):
        def filter_by_genre():
            movie_to_genre_dict = {}

            for row, col in self.movies.iterrows():
                movie_to_genre_dict[col.loc['title']] = set(col.loc['genres'].split('|'))

            filtered_movies = []
            for movie_list in initial_recs:
                temp = []
                for movie in movie_list:
                    intersect = movie_to_genre_dict[movie].intersection(genres)
                    if len(intersect) > 0:
                        temp.append(movie)
                filtered_movies.append(temp)
            return filtered_movies

        def filter_by_year(movie_lists: List[list]):
            if not start_end_year:
                return movie_lists

            final_rec = []
            start_year = min(start_end_year)
            end_year = datetime.datetime.now().year if len(start_end_year) == 1 else max(start_end_year)

            for group in movie_lists:
                temp = []
                for movie_title in group:
                    if not movie_title[-5:-1].isdigit():
                        continue
                    year = int(movie_title[-5:-1])
                    if start_year <= year <= end_year:
                        temp.append(movie_title)
                final_rec.append(temp)
            return final_rec

        filtered_movies = filter_by_genre()
        filtered_movies = filter_by_year(filtered_movies)
        return filtered_movies

    def find_similiar_movie_titles(self, website_titles: List[str]):
        def clean_website_title(title):
            return title.replace("-", " ").lower().strip()

        cleaned_website_titles = [clean_website_title(t) for t in website_titles]

        cleaned_dataset_titles = []
        for row, col in self.movies.iterrows():
            cleaned_dataset_titles.append(col.loc['title'])

        # Matching loop
        best_matched_titles = []
        for website_title in cleaned_website_titles:
            best_match = None
            best_score = -float("inf")
            for dataset_title in cleaned_dataset_titles:
                score = fuzz.ratio(website_title, dataset_title)
                if score > best_score:
                    best_match = dataset_title
                    best_score = score

            best_matched_titles.append(best_match)
        return best_matched_titles

    def movie_titles_to_ids(self, input_movie_list: List[str]) -> List[int]:
        title_to_id = self.movies.set_index('title')['movieId'].to_dict()

        m_ids = []
        for title in input_movie_list:
            m_ids.append(title_to_id[title])
        return m_ids

    def get_group_recommendation(self, input_movie_list: List[str], desired_genres: set, start_end_year: List[int]) -> list:
        formatted_titles = self.find_similiar_movie_titles(input_movie_list)
        group_movie_list_ids = self.movie_titles_to_ids(formatted_titles)

        print("Clustering...")
        group_rec = []
        for m_id in group_movie_list_ids:
            output_m_ids = self.find_similar_movies(m_id, self.Q.T, self.movie_mapper, self.movie_inv_mapper)
            m_titles = [self.movie_titles[i] for i in output_m_ids]
            group_rec.append(m_titles)

        print("Filtering movies...")
        group_rec = self.filter_movies(initial_recs=group_rec, genres=desired_genres, start_end_year=start_end_year)
        print("Ranking movies...")
        group_rec = self.rank_movie_score(group_rec)
        return group_rec


# genres = {'Adventure', 'Action'}
# input_movie_list = ['solo-a-star-wars-story', 'murder-on-the-orient-express-2017', '8-mile', 'avengers-infinity-war', 'kung-fu-panda', 'spider-man-no-way-home', 'toy-story', 'captain-america-civil-war', 'the-dark-knight-rises', 'life-itself-2018', 'coraline', 'the-shining', 'ratatouille', 'the-queens-gambit', 'shang-chi-and-the-legend-of-the-ten-rings', 'blackkklansman', 'spider-man-homecoming', 'train-to-busan', 'ant-man', 'up', 'star-wars-the-last-jedi', 'moonrise-kingdom', 'good-will-hunting', 'nope', 'joker-2019', 'batman-begins', 'the-matrix', 'wonder-2017', 'hidden-figures', 'holes', 'mulan', 'home-alone', 'doctor-strange-2016', 'zootopia', 'inception', 'despicable-me', 'star-wars', 'the-lion-king', 'the-dark-knight', 'the-hunger-games', 'interstellar', 'the-martian', 'quiz-show', 'school-of-rock', 'elf', 'oceans-eleven-2001', 'back-to-the-future-part-ii', 'harry-potter-and-the-goblet-of-fire', 'knives-out-2019', 'la-la-land', 'hamilton-2020', 'jumanji-welcome-to-the-jungle', 'black-panther', 'oceans-eight', 'harry-potter-and-the-chamber-of-secrets', 'harry-potter-and-the-order-of-the-phoenix', 'dont-worry-darling', 'superbad', 'back-to-the-future', 'big-hero-6', 'walle', 'coco-2017', 'lion', 'inside-man', 'rogue-one-a-star-wars-story', 'it-2017', 'were-the-millers', 'tenet', 'the-truman-show', '42']
# start_end_year = []
# item_item_recommender = ItemItemWithKNNRec()
# movie_rec = item_item_recommender.get_group_recommendation(
#     input_movie_list=input_movie_list,
#     desired_genres=genres,
#     start_end_year=start_end_year
# )
#
# print(movie_rec)
