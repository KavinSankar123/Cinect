from typing import List
import numpy as np
import pandas as pd
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD
from sklearn.neighbors import NearestNeighbors


class ItemItemWithKNNRec:
    def __init__(self):
        self.ratings = pd.read_csv("ratings.csv")
        self.movies = pd.read_csv("movies.csv")
        self.movie_titles = dict(zip(self.movies['movieId'], self.movies['title']))

        self.X, self.user_mapper, self.movie_mapper, self.user_inv_mapper, self.movie_inv_mapper = self.create_X(
            self.ratings)

        self.svd = TruncatedSVD(n_components=20, n_iter=10)
        self.Q = self.svd.fit_transform(self.X.T)

    def create_X(self, df):
        """
        Generates a sparse matrix from ratings dataframe.

        Args:
            df: pandas dataframe containing 3 columns (userId, movieId, rating)

        Returns:
            X: sparse matrix
            user_mapper: dict that maps user id's to user indices
            user_inv_mapper: dict that maps user indices to user id's
            movie_mapper: dict that maps movie id's to movie indices
            movie_inv_mapper: dict that maps movie indices to movie id's
        """
        M = df['userId'].nunique()
        N = df['movieId'].nunique()

        user_mapper = dict(zip(np.unique(df["userId"]), list(range(M))))
        movie_mapper = dict(zip(np.unique(df["movieId"]), list(range(N))))

        user_inv_mapper = dict(zip(list(range(M)), np.unique(df["userId"])))
        movie_inv_mapper = dict(zip(list(range(N)), np.unique(df["movieId"])))

        user_index = [user_mapper[i] for i in df['userId']]
        item_index = [movie_mapper[i] for i in df['movieId']]

        X = csr_matrix((df["rating"], (user_index, item_index)), shape=(M, N))

        return X, user_mapper, movie_mapper, user_inv_mapper, movie_inv_mapper

    def find_similar_movies(self, movie_id, X, movie_mapper, movie_inv_mapper, k, metric) -> List:
        """
        Finds k-nearest neighbours for a given movie id.

        Args:
            movie_id: id of the movie of interest
            X: user-item utility matrix
            k: number of similar movies to retrieve
            metric: distance metric for kNN calculations

        Output: returns list of k similar movie ID's
        """
        X = X.T
        neighbour_ids = []

        movie_ind = movie_mapper[movie_id]
        movie_vec = X[movie_ind]
        if isinstance(movie_vec, (np.ndarray)):
            movie_vec = movie_vec.reshape(1, -1)
        # use k+1 since kNN output includes the movieId of interest
        kNN = NearestNeighbors(n_neighbors=k + 1, algorithm="auto", metric=metric)
        kNN.fit(X)
        neighbour = kNN.kneighbors(movie_vec, return_distance=False)
        for i in range(0, k):
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
        movies_df = pd.read_csv("movies.csv")
        movie_to_genre_dict = {}

        for row, col in movies_df.iterrows():
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

    def find_group_rec(self, group_movie_list_ids: List[int], desired_genres: set, k: int, metric: str) -> list:
        group_rec = []
        for m_id in group_movie_list_ids:
            output_m_ids = self.find_similar_movies(m_id, self.Q.T, self.movie_mapper, self.movie_inv_mapper, k, metric)
            m_titles = [self.movie_titles[i] for i in output_m_ids]
            group_rec.append(m_titles)

        group_rec = self.filter_movies(initial_recs=group_rec, genres=desired_genres)
        group_rec = self.rank_movie_score(group_rec)

        return group_rec


# desired_genres = {'Adventure'}
# item_item_recommender = ItemItemWithKNNRec()
# group_rec = item_item_recommender.find_group_rec(
#     group_movie_list_ids=[1, 2, 3, 4, 5, 6, 7, 8],
#     desired_genres=desired_genres,
#     k=100,
#     metric="cosine"
# )
#
# print(group_rec)
