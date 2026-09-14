import requests
from collections import Counter
from supabase import create_client, Client 
# "https://image.tmdb.org/t/p/w500/{poster_path}" หารูปโปรเตอร์

API_KEY = "a8b1b1c755f65614db2feaf47d025c14"
SUPABASE_URL = "https://igzbpbusinlqqjioeobs.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlnemJwYnVzaW5scXFqaW9lb2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDQ5NzcsImV4cCI6MjEwMzU4MDk3N30.gLpKMTPCFnyQUf2CtpCXyH11odjff53MuEu-mOx1PBs"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

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
    
    # print(apps)
    # print(f"My Watchlist:")
    # for i in range(len(watchlist)):
    #     print(watchlist[i].name)
    

main()