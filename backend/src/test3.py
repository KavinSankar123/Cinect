import pandas as pd
from collections import defaultdict
from surprise import Dataset, Reader, SVD

# User provided ratings (ideally would be the entire group added into one dataframe)
user_ratings = [
    {"user_id": 1, "movie_name": "Avatar: The Way of Water (2022)", "rating": 3.0},
    {"user_id": 1, "movie_name": "Glass Onion (2022)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Don't Worry Darling (2022)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Nope (2022)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Doctor Strange in the Multiverse of Madness (2022)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Spider-Man: No Way Home (2022)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Eternals (2022)", "rating": 2.5},
    {"user_id": 1, "movie_name": "Dune (2021)", "rating": 2.0},
    {"user_id": 1, "movie_name": "Shang-Chi and the Legend of the Ten Rings (2021)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Black Widow (2021)", "rating": 2.5},
    {"user_id": 1, "movie_name": "Loki (2021)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Holidate (2020)", "rating": 2.0},
    {"user_id": 1, "movie_name": "The Queen's Gambit (2020)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Tenet (2020)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Hamilton (2020)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Extraction (2020)", "rating": 2.5},
    {"user_id": 1, "movie_name": "Star Wars: The Rise of Skywalker (2019)", "rating": 1.5},
    {"user_id": 1, "movie_name": "Knives Out (2019)", "rating": 5.0},
    {"user_id": 1, "movie_name": "Joker (2019)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Ad Astra (2019)", "rating": 3.5},
    {"user_id": 1, "movie_name": "It Chapter Two (2019)", "rating": 3.0},
    {"user_id": 1, "movie_name": "Avengers: Endgame (2019)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Captain Marvel (2019)", "rating": 3.0},
    {"user_id": 1, "movie_name": "Fantastic Beasts: The Crimes of Grindelwald (2018)", "rating": 2.5},
    {"user_id": 1, "movie_name": "Life Itself (2018)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Free Solo (2018)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Mamma Mia! Here We Go Again (2018)", "rating": 3.0},
    {"user_id": 1, "movie_name": "Ocean's Eight (2018)", "rating": 4.0},
    {"user_id": 1, "movie_name": "BlacKkKlansman (2018)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Solo: A Star Wars Story (2018)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Avengers: Infinity War (2018)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Black Panther (2018)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Star Wars: The Last Jedi (2017)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Jumanji: Welcome to the Jungle (2017)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Wonder (2017)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Murder on the Orient Express (2017)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Coco (2017)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Thor: Ragnarok (2017)", "rating": 3.5},
    {"user_id": 1, "movie_name": "Kingsman: The Golden Circle (2017)", "rating": 3.0},
    {"user_id": 1, "movie_name": "It (2017)", "rating": 4.0},
    {"user_id": 1, "movie_name": "Dunkirk (2017)", "rating": 3.0},
    {"user_id": 1, "movie_name": "Spider-Man: Homecoming (2017)", "rating": 4.5},
    {"user_id": 1, "movie_name": "Good Time (2017)", "rating": 3.5}
]

# Load the movies.dat file to map movie names to movie IDs
movies_df = pd.read_csv('movies.dat', sep='::', engine='python', header=None, names=['movieId', 'title', 'genres'], encoding='latin-1')
name_to_id = pd.Series(movies_df.movieId.values, index=movies_df.title).to_dict()

# Convert user ratings movie names to movie IDs
for rating in user_ratings:
    rating['movie_name'] = name_to_id.get(rating['movie_name'], "Unknown")

# Convert user ratings to DataFrame
user_ratings_df = pd.DataFrame(user_ratings)

# Duplicate the user ratings, e.g., 100 times to increase their influence
user_ratings_df = pd.concat([user_ratings_df] * 100, ignore_index=True)

# Load the built-in MovieLens dataset
data = Dataset.load_builtin('ml-1m')

# Prepare the MovieLens data in DataFrame format
ratings = []
for uid, iid, rating, _ in data.raw_ratings:
    ratings.append({'user_id': uid, 'movie_name': iid, 'rating': rating})
movielens_df = pd.DataFrame(ratings)

# Combine your data with the MovieLens data
combined_data = pd.concat([movielens_df, user_ratings_df])

# Define a Reader with the rating scale of the dataset
reader = Reader(rating_scale=(1, 5))

# Load the combined dataset into Surprise
data = Dataset.load_from_df(combined_data[['user_id', 'movie_name', 'rating']], reader)

# Build the full trainset and train the SVD algorithm
trainset = data.build_full_trainset()
algo = SVD()
algo.fit(trainset)

# Function to get the top-N recommendations for each user
def get_top_n(predictions, n=10):
    top_n = defaultdict(list)
    for uid, iid, true_r, est, _ in predictions:
        top_n[uid].append((iid, est))
    
    for uid, user_ratings in top_n.items():
        user_ratings.sort(key=lambda x: x[1], reverse=True)
        top_n[uid] = user_ratings[:n]
    
    return top_n

# Generate predictions for all pairs not in the training set
testset = trainset.build_anti_testset()
predictions = algo.test(testset)
top_n = get_top_n(predictions, n=10)

# Display the top N recommendations
print(f"Top 10 recommendations:")
for movie_id, rating in top_n['1']:
    movie_name = movies_df.loc[movies_df['movieId'] == int(movie_id), 'title'].values[0] if movie_id != "Unknown" else "Unknown Movie"
    print(f"{movie_name}: {rating:.2f}")
