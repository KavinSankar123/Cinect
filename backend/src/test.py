import pandas as pd
from surprise import Dataset, Reader, SVD

movies_df = pd.read_csv('movie_nonnull.csv')

user_ratings = [
    {'user_id': '1', 'movie_name': 'Cult of Chucky', 'rating': 5},
    {'user_id': '1', 'movie_name': 'Knives Out', 'rating': 4},
    {'user_id': '1', 'movie_name': 'Lost Sun', 'rating': 1},
    {'user_id': '1', 'movie_name': 'The Beirut Apt', 'rating': 1}
]

ratings_df = pd.DataFrame(user_ratings)

# Convert the ratings DataFrame into a Surprise dataset
reader = Reader(rating_scale=(1, 5))  # Adjust rating_scale according to your ratings
data = Dataset.load_from_df(ratings_df[['user_id', 'movie_name', 'rating']], reader)

# Train a recommendation model using the SVD algorithm
trainset = data.build_full_trainset()
algo = SVD()
algo.fit(trainset)

user_id = '1'  # The user ID to make a prediction for

movies_not_rated_by_user = set(movies_df['name']) - set(ratings_df[ratings_df['user_id'] == user_id]['movie_name'])
ratings = []
for movie in movies_not_rated_by_user:
    rating = algo.predict(user_id, movie).est
    ratings.append((movie, rating))

# Sort movies based on predicted rating
recommendations = sorted(ratings, key=lambda x: x[1], reverse=True)

# Recommend the top movie (or top N movies)
top_recommendation = recommendations[0]
print(f"Recommendations {recommendations}")
print(f"Top recommendation for user {user_id}: {top_recommendation[0]} with estimated rating of {top_recommendation[1]}")
