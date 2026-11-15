import os
import time
import requests
from concurrent.futures import ThreadPoolExecutor
from itertools import combinations
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import Client, create_client

# ==========================================
# 1. CONFIGURATION & INITIALIZATION
# ==========================================
load_dotenv()
API_KEY = os.getenv("TMDB_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

app = FastAPI(title="Absolute Cinema API")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# 2. CONSTANTS & MAPPINGS
# ==========================================
IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500"
CACHE: dict = {}

GENRE_MAP = {
    28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
    80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
    14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
    9648: "Mystery", 10749: "Romance", 878: "Sci-Fi", 53: "Thriller"
}

PROVIDER_MAP = {
    "Netflix": "netflix",
    "Disney Plus": "disney",
    "Disney+": "disney",
    "Disney+ Hotstar": "disney",
    "Amazon Prime Video": "prime",
    "Prime Video": "prime",
    "Max": "hbo",
    "HBO Max": "hbo",
    "HBO Go": "hbo",
    "Apple TV Plus": "apple",
    "Apple TV+": "apple",
    "Viu": "viu",
    "iQIYI": "iqiyi",
    "WeTV": "wetv",
}

# ==========================================
# 3. PYDANTIC MODELS (สำหรับรับข้อมูลจาก React)
# ==========================================
class MoviePayload(BaseModel):
    id: str
    title: str
    poster: Optional[str] = ""
    backdrop: Optional[str] = ""
    year: Optional[int] = 2026
    runtime: Optional[int] = 120
    voteAverage: Optional[float] = 0.0
    releaseDate: Optional[str] = None
    ageRating: Optional[str] = "15+"
    tagline: Optional[str] = ""
    overview: Optional[str] = ""
    providers: List[str] = []

class UserMovieRequest(BaseModel):
    user_id: str
    movie: MoviePayload

class BoxMovieRequest(BaseModel):
    schedule_id: str
    movie: MoviePayload

# ==========================================
# 4. HELPER FUNCTIONS (ฟังก์ชันช่วยจัดการข้อมูล)
# ==========================================
def format_movie_for_react(item: dict):
    movie_id = item.get("id")
    media_type = item.get("media_type", "movie")
    poster = item.get("poster_path")
    backdrop = item.get("backdrop_path")
    genre_ids = item.get("genre_ids", [])
    genres = [GENRE_MAP[g] for g in genre_ids if g in GENRE_MAP] or ["Movie"]

    runtime = 120
    tagline = ""
    providers = []

    if movie_id:
        try:
            detail_url = f"https://api.themoviedb.org/3/{media_type}/{movie_id}?api_key={API_KEY}&language=th-TH&append_to_response=watch/providers"
            detail_res = requests.get(detail_url, timeout=12).json()
            
            if detail_res.get("runtime"):
                runtime = detail_res["runtime"]
            elif detail_res.get("episode_run_time"):
                runtime = detail_res["episode_run_time"][0]
            if detail_res.get("tagline"):
                tagline = detail_res["tagline"]

            th_providers = detail_res.get("watch/providers", {}).get("results", {}).get("TH", {})
            for p in th_providers.get("flatrate", []):
                p_name = p.get("provider_name", "")
                if p_name in PROVIDER_MAP:
                    mapped_id = PROVIDER_MAP[p_name]
                    if mapped_id not in providers:
                        providers.append(mapped_id)
        except Exception:
            pass

    vote_avg = round(item.get("vote_average", 0), 1)
    poster_url = f"{IMAGE_BASE_URL}{poster}" if poster else "https://via.placeholder.com/500x750?text=No+Poster"
    release_date = item.get("release_date") or item.get("first_air_date") or ""

    return {
        "id": str(movie_id),
        "title": item.get("title") or item.get("name") or "ไม่ระบุชื่อเรื่อง",
        "poster": poster_url,
        "backdrop": f"https://image.tmdb.org/t/p/w780{backdrop}" if backdrop else poster_url,
        "rating": vote_avg,
        "voteAverage": vote_avg,
        "year": (release_date or "2026")[:4],
        "releaseDate": release_date,
        "runtime": runtime,
        "tagline": tagline,
        "genres": genres[:3],
        "providers": providers,
        "overview": item.get("overview") or "ไม่มีเรื่องย่อภาษาไทย",
    }
def fetch_and_cache(cache_key: str, tmdb_url: str):
    now = time.time()
    if cache_key in CACHE and now < CACHE[cache_key]["expires_at"]:
        return CACHE[cache_key]["data"]

    res = requests.get(tmdb_url).json()
    raw_movies = res.get("results", [])

    with ThreadPoolExecutor(max_workers=10) as executor:
        formatted_movies = list(executor.map(format_movie_for_react, raw_movies))

    CACHE[cache_key] = {"data": formatted_movies, "expires_at": now + 600}
    return formatted_movies

def ensure_movie_in_db(movie: MoviePayload):
    """บันทึกข้อมูลหนังลง movies และอัปเดตค่ายสตรีมมิ่งล่าสุดใน movie_providers"""
    movie_data = {
        "id": movie.id,
        "title": movie.title,
        "poster_url": movie.poster,
        "backdrop_url": movie.backdrop,
        "year": int(movie.year) if movie.year else None,
        "runtime": movie.runtime,
        "vote_average": movie.voteAverage,
        "release_date": movie.releaseDate if movie.releaseDate else None,
        "age_rating": movie.ageRating,
        "tagline": movie.tagline,
        "overview": movie.overview,
    }
    supabase.table("movies").upsert(movie_data).execute()

    # ลบค่ายเก่าของหนังเรื่องนี้ออกก่อน เพื่อไม่ให้ค่ายที่หมดลิขสิทธิ์แล้วค้างอยู่
    supabase.table("movie_providers").delete().eq("movie_id", movie.id).execute()

    if movie.providers:
        provider_rows = [{"movie_id": movie.id, "provider_id": p_id} for p_id in movie.providers]
        supabase.table("movie_providers").insert(provider_rows).execute()

# ==========================================
# 5. ENDPOINTS: TMDB DISCOVERY & SEARCH
# ==========================================
@app.get("/api/movies/trending")
def get_trending_movies():
    url = f"https://api.themoviedb.org/3/trending/movie/week?api_key={API_KEY}&language=th-TH"
    return fetch_and_cache("trending", url)

@app.get("/api/movies/genre/{genre_id}")
def get_movies_by_genre(genre_id: int):
    url = f"https://api.themoviedb.org/3/discover/movie?api_key={API_KEY}&language=th-TH&with_genres={genre_id}&sort_by=popularity.desc"
    return fetch_and_cache(f"genre_{genre_id}", url)

@app.get("/api/movies/search")
def search_movies(q: str):
    if not q.strip():
        return []

    url = "https://api.themoviedb.org/3/search/multi"
    res_th = requests.get(url, params={"api_key": API_KEY, "language": "th-TH", "query": q, "include_adult": "false"}).json().get("results", [])
    res_en = requests.get(url, params={"api_key": API_KEY, "language": "en-US", "query": q, "include_adult": "false"}).json().get("results", [])

    merged = {}
    for item in res_th + res_en:
        # เอาเฉพาะภาพยนตร์และซีรีส์ (ตัด person ออก)
        if item.get("media_type") not in ("movie", "tv"):
            continue
        key = f"{item['media_type']}_{item['id']}"
        if key not in merged:
            merged[key] = item
        elif item.get("title") or item.get("name"):
            merged[key]["english_title"] = item.get("title") or item.get("name") or ""

    raw_items = list(merged.values())
    raw_items.sort(key=lambda x: x.get("popularity", 0), reverse=True)

    with ThreadPoolExecutor(max_workers=10) as executor:
        results = list(executor.map(format_movie_for_react, raw_items[:12]))

    for formatted, raw in zip(results, raw_items[:12]):
        formatted["originalTitle"] = raw.get("english_title") or raw.get("original_title") or raw.get("original_name") or ""

    return results

# ==========================================
# 6. ENDPOINTS: WATCHLIST, BOOKMARK & BOX
# ==========================================
@app.post("/api/watchlist/toggle")
def toggle_watchlist(req: UserMovieRequest):
    """กดปุ่มหัวใจ: เพิ่ม/ลบ หนังใน watchlist_items"""
    existing = supabase.table("watchlist_items").select("*").eq("user_id", req.user_id).eq("movie_id", req.movie.id).execute()

    if existing.data:
        supabase.table("watchlist_items").delete().eq("user_id", req.user_id).eq("movie_id", req.movie.id).execute()
        return {"status": "removed", "movie_id": req.movie.id}
    
    ensure_movie_in_db(req.movie)
    supabase.table("watchlist_items").insert({"user_id": req.user_id, "movie_id": req.movie.id}).execute()
    return {"status": "added", "movie_id": req.movie.id}

@app.post("/api/bookmark/toggle")
def toggle_bookmark(req: UserMovieRequest):
    """กดปุ่ม Bookmark: เพิ่ม/ลบ หนังใน saved_movies"""
    existing = supabase.table("saved_movies").select("*").eq("user_id", req.user_id).eq("movie_id", req.movie.id).execute()

    if existing.data:
        supabase.table("saved_movies").delete().eq("user_id", req.user_id).eq("movie_id", req.movie.id).execute()
        return {"status": "removed", "movie_id": req.movie.id}
    
    ensure_movie_in_db(req.movie)
    supabase.table("saved_movies").insert({"user_id": req.user_id, "movie_id": req.movie.id}).execute()
    return {"status": "added", "movie_id": req.movie.id}

@app.post("/api/box/add-movie")
def add_movie_to_box(req: BoxMovieRequest):
    """เพิ่มหนังเข้า Box (watch_schedule_movies)"""
    ensure_movie_in_db(req.movie)
    supabase.table("watch_schedule_movies").upsert({
        "schedule_id": req.schedule_id,
        "movie_id": req.movie.id
    }).execute()
    return {"status": "added_to_box", "schedule_id": req.schedule_id, "movie_id": req.movie.id}

# ==========================================
# 7. ENDPOINT: SUBSCRIPTION COST CALCULATOR
# ==========================================
@app.get("/api/calculate/{user_id}")
def calculate_best_deal(user_id: str, schedule_id: str | None = None):
    from itertools import combinations

    # 1. ดึงรายการ movie_ids ของ user (จาก Box หรือ Watchlist)
    if schedule_id:
        res = supabase.table("watch_schedule_movies").select("movie_id").eq("schedule_id", schedule_id).execute()
    else:
        res = supabase.table("watchlist_items").select("movie_id").eq("user_id", user_id).execute()

    movie_ids = list({str(row["movie_id"]) for row in (res.data or [])})
    if not movie_ids:
        return {"recommendations": []}

    providers_data = supabase.table("providers").select("*").execute().data or []
    mp_data = supabase.table("movie_providers").select("*").in_("movie_id", movie_ids).execute().data or []

    provider_movies: dict[str, set[str]] = {p["id"]: set() for p in providers_data}
    for row in mp_data:
        pid = row["provider_id"]
        if pid in provider_movies:
            provider_movies[pid].add(str(row["movie_id"]))

    active_providers = [p for p in providers_data if len(provider_movies.get(p["id"], set())) > 0]
    total_movies = len(movie_ids)
    all_combos = []

    max_r = min(len(active_providers), 4)
    for r in range(1, max_r + 1):
        for combo in combinations(active_providers, r):
            covered = set()
            for p in combo:
                covered |= provider_movies[p["id"]]

            covered_count = len(covered)
            if covered_count == 0:
                continue
            if r > 1:
                is_redundant = False
                for i in range(r):
                    sub_covered = set()
                    for j, p in enumerate(combo):
                        if i != j:
                            sub_covered |= provider_movies[p["id"]]
                    if len(sub_covered) == covered_count:
                        is_redundant = True
                        break
                if is_redundant:
                    continue
            total_price = sum(float(p.get("monthly_price") or 0) for p in combo)
            combo_key = "+".join(sorted(p["id"] for p in combo))

            all_combos.append({
                "combo_id": combo_key,
                "tier_count": r,
                "providers": [
                    {
                        "id": p["id"],
                        "name": p["name"],
                        "monthly_price": float(p.get("monthly_price") or 0),
                    }
                    for p in combo
                ],
                "covered_movie_ids": list(covered),
                "covered_count": covered_count,
                "total_movies": total_movies,
                "coverage_percent": round((covered_count / total_movies) * 100),
                "total_monthly_price": total_price,
                "price_per_movie": round(total_price / covered_count, 2),
            })

    all_combos.sort(key=lambda x: (x["price_per_movie"], -x["covered_count"], x["total_monthly_price"]))

    return {"recommendations": all_combos}

class ScheduleCreateRequest(BaseModel):
    user_id: str
    title: str
    movie_ids: List[str] = []

class ScheduleUpdateRequest(BaseModel):
    title: str

class ScheduleAddMoviesRequest(BaseModel):
    movie_ids: List[str]

def format_db_movie_for_react(m: dict) -> dict:
    """แปลงข้อมูลหนังจากคอลัมน์ใน Supabase (poster_url) ให้ตรงกับ Type ของ React (poster)"""
    poster = m.get("poster") or m.get("poster_url") or ""
    if poster and not poster.startswith("http"):
        poster = f"{IMAGE_BASE_URL}{poster}"
    if not poster or "example.jpg" in poster:
        poster = "https://via.placeholder.com/500x750?text=No+Poster"

    backdrop = m.get("backdrop") or m.get("backdrop_url") or poster
    if backdrop and not backdrop.startswith("http"):
        backdrop = f"https://image.tmdb.org/t/p/w780{backdrop}"

    vote_avg = float(m.get("vote_average") or m.get("voteAverage") or 0.0)
    providers = [p["provider_id"] for p in m.get("movie_providers", [])]

    return {
        "id": str(m["id"]),
        "title": m.get("title") or "ไม่ระบุชื่อเรื่อง",
        "poster": poster,
        "backdrop": backdrop,
        "rating": vote_avg,
        "voteAverage": vote_avg,
        "year": str(m.get("year") or "2026"),
        "releaseDate": m.get("release_date") or "",
        "runtime": int(m.get("runtime") or 120),
        "tagline": m.get("tagline") or "",
        "genres": m.get("genres") or ["Movie"],
        "providers": providers,
        "overview": m.get("overview") or "",
    }

@app.get("/api/user/{user_id}/data")
def get_user_data(user_id: str):
    """ดึงข้อมูล Watchlist, Saved และ Boxes ทั้งหมดของ User ตอน Login"""
    wl_res = supabase.table("watchlist_items").select("movie_id, movies(*, movie_providers(provider_id))").eq("user_id", user_id).execute()
    watchlist = [format_db_movie_for_react(item["movies"]) for item in (wl_res.data or []) if item.get("movies")]

    sv_res = supabase.table("saved_movies").select("movie_id, movies(*, movie_providers(provider_id))").eq("user_id", user_id).execute()
    saved = [format_db_movie_for_react(item["movies"]) for item in (sv_res.data or []) if item.get("movies")]

    sc_res = supabase.table("watch_schedules").select("*, watch_schedule_movies(movie_id, movies(*, movie_providers(provider_id)))").eq("user_id", user_id).execute()
    schedules = []
    for sc in (sc_res.data or []):
        box_movies = [
            format_db_movie_for_react(sm["movies"])
            for sm in sc.get("watch_schedule_movies", [])
            if sm.get("movies")
        ]
        schedules.append({
            "id": str(sc["id"]),
            "title": sc["title"],
            "movies": box_movies,
            "createdAt": (sc.get("created_at") or "")[:10],
        })

    return {
        "watchlist": watchlist,
        "saved": saved,
        "schedules": schedules,
    }

# ==========================================
# 8. ENDPOINTS: MANAGE BOXES (WATCH SCHEDULES)
# ==========================================
@app.post("/api/schedules")
def create_schedule(req: ScheduleCreateRequest):
    res = supabase.table("watch_schedules").insert({
        "user_id": req.user_id,
        "title": req.title,
    }).execute()
    created = res.data[0]
    sched_id = created["id"]

    if req.movie_ids:
        rows = [{"schedule_id": sched_id, "movie_id": str(mid)} for mid in req.movie_ids]
        supabase.table("watch_schedule_movies").upsert(rows).execute()

    return {"id": str(sched_id), "title": created["title"]}

@app.post("/api/schedules/{schedule_id}/movies")
def add_movies_to_schedule(schedule_id: str, req: ScheduleAddMoviesRequest):
    if req.movie_ids:
        rows = [{"schedule_id": schedule_id, "movie_id": str(mid)} for mid in req.movie_ids]
        supabase.table("watch_schedule_movies").upsert(rows).execute()
    return {"status": "added"}

@app.patch("/api/schedules/{schedule_id}")
def update_schedule_title(schedule_id: str, req: ScheduleUpdateRequest):
    supabase.table("watch_schedules").update({"title": req.title}).eq("id", schedule_id).execute()
    return {"status": "updated"}

@app.delete("/api/schedules/{schedule_id}")
def delete_schedule(schedule_id: str):
    supabase.table("watch_schedules").delete().eq("id", schedule_id).execute()
    return {"status": "deleted"}

@app.delete("/api/schedules/{schedule_id}/movies/{movie_id}")
def remove_movie_from_schedule(schedule_id: str, movie_id: str):
    supabase.table("watch_schedule_movies").delete().eq("schedule_id", schedule_id).eq("movie_id", movie_id).execute()
    return {"status": "removed"}

@app.delete("/api/watchlist/{user_id}/clear")
def clear_watchlist(user_id: str):
    """ล้างรายการกดหัวใจทั้งหมดของ User (ใช้ตอนย้ายหนังเข้า Box)"""
    supabase.table("watchlist_items").delete().eq("user_id", user_id).execute()
    return {"status": "cleared"}