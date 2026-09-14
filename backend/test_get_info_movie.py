import requests
import os
from collections import Counter
from supabase import create_client, Client 

from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
# "https://image.tmdb.org/t/p/w500/{poster_path}" หารูปโปรเตอร์
class Movie:
    def __init__(self, id, title, original_title, poster_path):
        self.id = id
        self.name = title
        self.original_name = original_title
        self.poster = poster_path
        self.providers = []

def get_trending_movies():
    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={API_KEY}&language=th-TH"
    response = requests.get(url).json()
    return response.get("results", [])

def search_movies(query):
    url = f"https://api.themoviedb.org/3/search/movie?query={query}&api_key={API_KEY}&language=th-TH"
    response = requests.get(url)
    if response.status_code == 200:
        movies = []
        info_movies = response.json()
        for movie in info_movies.get("results", []):
            id_a_movie = movie["id"]
            name_a_movie = movie["title"]
            original_name = movie["original_title"]
            poster_path = movie["poster_path"]
            movies.append(Movie(id_a_movie, name_a_movie, original_name, poster_path))
            
        if len(movies) == 0:
            print("Not Found")
            # movies.append({"title": name_a_movie, "id": id_a_movie})
            return None
    else:
        print("Non found this movie.")
    
    return movies

def get_watch_providers(movie_id):
    
    url = f"https://api.themoviedb.org/3/movie/{movie_id}/watch/providers?api_key={API_KEY}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        th_data = data.get("results", {}).get("TH", {})
        providers = th_data.get("flatrate", [])
        app_names = [app["provider_name"] for app in providers]
        return app_names
        
    return []

def find_most_frequent_app(watchlist):
    all_app = []
    for movie in watchlist:
        all_app.extend(movie.providers)
    
    if len(all_app) == 0:
        return [], 0
        
    app_scores = Counter(all_app)

    top_app = app_scores.most_common(1)[0]
    movie_count = top_app[1]

    best_app_name = []
    for app,count in app_scores.items():
        if count == movie_count:
            best_app_name.append(app)

    return best_app_name, movie_count

def login_account():

    print("Please log in before use.")
    print("=" * 30)
    
    while True:
        email = input("Email: ")
        password = input("Password: ")
        
        try:
           
            res = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })
            print(f"\nLogin successful! Welcome!{res.user.email}\n")
            return res.user.id  
            
        except Exception as e:
            print(f"Error from Supabase: {e}") 
            
def save_watchlist_to_supabase(user_id, watchlist):
    for movie in watchlist:
        try:
            supabase.table("movies").upsert({
                "id": movie.id,
                "title": movie.name,
                "poster_url": movie.poster
                }).execute()
        except Exception as e:
            print(f"Error: {e}")

        try:
            supabase.table("favorite_movies").insert({
                "user_id": user_id,
                "movie_id": movie.id
            }).execute()
        except Exception as e:
            print(f"Error: {e}")
            

def main():
    print("ระบบค้นหาแหล่งสตรีมมิ่ง")
    user_id = login_account()

    """ค้าหาและสร้างwatchlist"""
    watchlist = []
    while True:
        search_text = input("พิมพ์ชื่อภาพยนตร์ที่ต้องการค้นหา(Q to qiut): ")
        if search_text != "Q":
            movies_list = search_movies(search_text)
            if movies_list != None:
                print("-" * 10)
                for i, info in enumerate(movies_list, start=1):
                    print(f"{i}. {info.name}")

                select_movie = int(input("เลือกเรื่องที่คุณต้องการ(1, 2, 10): "))
                watchlist.append(movies_list[select_movie - 1])
                
        else:
            break
    
    """หาว่าอยู่แอปไหน"""
    apps = [] 
    print("=" * 10) 
    for movie in watchlist:
        movie.providers = get_watch_providers(movie.id)
        apps.append(movie.providers)
        
        if len(movie.providers) > 0:
            apps_text = ", ".join(movie.providers) 
            print(f"- {movie.name} -> ดูได้ที่: {apps_text}")
        else:
            print(f"- {movie.name} ยังไม่มีให้บริการสตรีมมิ่งในไทยตอนนี้")

    """find_most_frequent_app"""
    best_app_name, movie_count = find_most_frequent_app(watchlist)
    print(f"สมัคร {best_app_name} คุ้มสุด ดูได้ {movie_count}เรื่อง")
    print("=" * 10)
    save_watchlist_to_supabase(user_id, watchlist)

main()