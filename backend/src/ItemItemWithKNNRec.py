from typing import List
import numpy as np
import pandas as pd
import joblib
from os import environ
from google.cloud import firestore


class ItemItemWithKNNRec:
    def __init__(self):
        self.movies = pd.DataFrame(self.fetch_movie_info())
        self.movie_titles = dict(zip(self.movies['movieId'], self.movies['title']))
        self.k = 100

        self.Q = joblib.load("saved_Q.joblib")
        self.user_mapper = joblib.load("saved_user_mapper.joblib")
        self.movie_mapper = joblib.load("saved_movie_mapper.joblib")
        self.user_inv_mapper = joblib.load("saved_user_inv_mapper.joblib")
        self.movie_inv_mapper = joblib.load("saved_movie_inv_mapper.joblib")
        self.saved_kNN = joblib.load("kNN_model.joblib")

    def fetch_movie_info(self):
        key_file_path = 'cinectmoviedb-665d236ba447.json'.format(environ['HOME'])
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
        return highest_freq

    def filter_movies(self, initial_recs: List[list], genres: set):
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

    def find_group_rec(self, group_movie_list_ids: List[int], desired_genres: set) -> list:
        group_rec = []
        for m_id in group_movie_list_ids:
            output_m_ids = self.find_similar_movies(m_id, self.Q.T, self.movie_mapper, self.movie_inv_mapper)
            m_titles = [self.movie_titles[i] for i in output_m_ids]
            group_rec.append(m_titles)

        group_rec = self.filter_movies(initial_recs=group_rec, genres=desired_genres)
        group_rec = self.rank_movie_score(group_rec)
        return group_rec


desired_genres = {'Adventure', 'Action', 'Thriller', 'Romance'}
item_item_recommender = ItemItemWithKNNRec()

group_rec = item_item_recommender.find_group_rec(
    group_movie_list_ids=[1, 2, 3, 4, 5, 6, 7, 8],
    desired_genres=desired_genres
)

print(group_rec)
