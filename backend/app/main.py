from __future__ import annotations

import math
import random
from datetime import datetime
from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .data_loader import (
    get_shared_movie_ids,
    load_data,
    pearson_correlation,
)

app = FastAPI(
    title="MovieLens Recommendation API",
    description="API para obtener recomendaciones de películas basadas en similitudes de usuario usando MovieLens 100k.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

ratings, items = load_data()


class RecommendationItem(BaseModel):
    movieId: str
    title: str
    year: str
    genre: str
    predictedRating: float


class SimilarityResponse(BaseModel):
    user_id_1: int
    user_id_2: int
    pearson: float
    shared_movie_count: int


class UserRatingsResponse(BaseModel):
    user_id: int
    ratings: Dict[int, float]


class MovieResponse(BaseModel):
    movie_id: int
    title: str
    year: Optional[str] = None
    genre: Optional[str] = None


class RatingPayload(BaseModel):
    user_id: int = Field(..., alias='userId')
    movie_id: int = Field(..., alias='movieId')
    rating: float

    class Config:
        allow_population_by_field_name = True


class MetricsResponse(BaseModel):
    activeUserId: int
    algorithm: str
    rmse: float
    mae: float
    lastUpdatedAt: str


def predict_rating(user_id: int, movie_id: int, algorithm: str) -> float:
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")

    weighted_sum = 0.0
    similarity_sum = 0.0

    for other_user_id, other_ratings in ratings.items():
        if other_user_id == user_id or movie_id not in other_ratings:
            continue

        similarity = compute_similarity(user_id, other_user_id, algorithm)
        if similarity <= 0:
            continue

        weighted_sum += similarity * other_ratings[movie_id]
        similarity_sum += abs(similarity)

    if similarity_sum == 0:
        return 0.0

    return weighted_sum / similarity_sum


def compute_metrics(user_id: int, algorithm: str) -> MetricsResponse:
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")

    squared_errors: List[float] = []
    absolute_errors: List[float] = []

    neighbors = get_top_neighbors(user_id, algorithm)
    for movie_id, actual_rating in ratings[user_id].items():
        predicted = predict_rating_from_neighbors(user_id, movie_id, neighbors)
        if predicted == 0:
            continue

        squared_errors.append((predicted - actual_rating) ** 2)
        absolute_errors.append(abs(predicted - actual_rating))

    if not squared_errors:
        rmse = 0.0
        mae = 0.0
    else:
        rmse = math.sqrt(sum(squared_errors) / len(squared_errors))
        mae = sum(absolute_errors) / len(absolute_errors)

    return MetricsResponse(
        activeUserId=user_id,
        algorithm=algorithm,
        rmse=round(rmse, 3),
        mae=round(mae, 3),
        lastUpdatedAt=datetime.utcnow().isoformat() + 'Z',
    )


def cosine_similarity(user_id_1: int, user_id_2: int, ratings: Dict[int, Dict[int, float]]) -> float:
    shared_ids = get_shared_movie_ids(user_id_1, user_id_2, ratings)
    if not shared_ids:
        return 0.0

    ratings_1 = ratings[user_id_1]
    ratings_2 = ratings[user_id_2]
    dot_product = sum(ratings_1[movie_id] * ratings_2[movie_id] for movie_id in shared_ids)
    norm_1 = math.sqrt(sum(ratings_1[movie_id] ** 2 for movie_id in shared_ids))
    norm_2 = math.sqrt(sum(ratings_2[movie_id] ** 2 for movie_id in shared_ids))
    if norm_1 == 0.0 or norm_2 == 0.0:
        return 0.0
    return dot_product / (norm_1 * norm_2)


def compute_similarity(user_id: int, other_id: int, algorithm: str) -> float:
    if algorithm == 'cosine':
        return cosine_similarity(user_id, other_id, ratings)
    return pearson_correlation(user_id, other_id, ratings)


def parse_movie_metadata(raw: dict[str, str]) -> tuple[str, str]:
    title = raw.get('title', '')
    year = 'N/A'
    if title.endswith(')') and '(' in title:
        parts = title.rsplit('(', 1)
        if len(parts) == 2:
            year = parts[1][:-1]
    return title, year


def get_top_neighbors(user_id: int, algorithm: str, size: int = 10) -> List[tuple[int, float]]:
    scores: List[tuple[int, float]] = []
    for other_id in ratings:
        if other_id == user_id:
            continue
        similarity = compute_similarity(user_id, other_id, algorithm)
        if similarity > 0:
            scores.append((other_id, similarity))
    scores.sort(key=lambda item: item[1], reverse=True)
    return scores[:size]


def predict_rating_from_neighbors(user_id: int, movie_id: int, neighbors: List[tuple[int, float]]) -> float:
    numerator = 0.0
    denominator = 0.0
    for neighbor_id, similarity in neighbors:
        neighbor_rating = ratings.get(neighbor_id, {}).get(movie_id)
        if neighbor_rating is None:
            continue
        numerator += similarity * neighbor_rating
        denominator += abs(similarity)
    return numerator / denominator if denominator != 0 else 0.0


def compute_recommendations(user_id: int, limit: int, min_rating: float, algorithm: str) -> List[RecommendationItem]:
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")

    if not ratings[user_id]:
        raise HTTPException(status_code=400, detail="El usuario no tiene valoraciones.")

    neighbors = get_top_neighbors(user_id, algorithm)
    unseen = [movie_id for movie_id in items if movie_id not in ratings[user_id]]

    recommendations: List[RecommendationItem] = []
    for movie_id in unseen:
        predicted = predict_rating_from_neighbors(user_id, movie_id, neighbors)
        if predicted < min_rating:
            continue

        title, year = parse_movie_metadata(items.get(movie_id, {}))
        recommendations.append(
            RecommendationItem(
                movieId=str(movie_id),
                title=title,
                year=year,
                genre=items.get(movie_id, {}).get('genre', 'Unknown'),
                predictedRating=round(predicted, 1),
            )
        )

    recommendations.sort(key=lambda item: item.predictedRating, reverse=True)
    return recommendations[:limit]


@app.get("/recommendations/{user_id}", response_model=List[RecommendationItem])
def recommendations(user_id: int, limit: int = Query(10, gt=0, le=50), min_rating: float = Query(4.0, ge=1.0, le=5.0)):
    """Obtiene recomendaciones de películas para un usuario dado."""
    return compute_recommendations(user_id, limit, min_rating, 'pearson')


@app.get("/recommendations", response_model=List[RecommendationItem])
def recommendations_query(
    user_id: int = Query(..., alias="userId"),
    algorithm: str = Query('pearson'),
    min_rating: float = Query(4.0, ge=1.0, le=5.0, alias='minRating'),
    limit: int = Query(20, gt=0, le=50),
):
    return compute_recommendations(user_id, limit, min_rating, algorithm)


@app.get("/movies/random", response_model=List[RecommendationItem])
def random_movies(
    user_id: int = Query(..., alias='userId'),
    count: int = Query(20, ge=1, le=50),
):
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")

    unseen = [movie_id for movie_id in items if movie_id not in ratings[user_id]]
    selected = random.sample(unseen, min(count, len(unseen)))

    movies: List[RecommendationItem] = []
    for movie_id in selected:
        title, year = parse_movie_metadata(items.get(movie_id, {}))
        movies.append(
            RecommendationItem(
                movieId=str(movie_id),
                title=title,
                year=year,
                genre=items.get(movie_id, {}).get('genre', 'Unknown'),
                predictedRating=0.0,
            )
        )
    return movies


@app.get("/metrics", response_model=MetricsResponse)
def metrics(
    user_id: int = Query(..., alias="userId"),
    algorithm: str = Query('pearson'),
):
    """Obtiene métricas de recomendación para un usuario dado."""
    return compute_metrics(user_id, algorithm)


@app.post("/rate")
def rate_rating(payload: RatingPayload):
    if payload.user_id not in ratings:
        ratings[payload.user_id] = {}

    ratings[payload.user_id][payload.movie_id] = payload.rating
    return {
        "status": "ok",
        "user_id": payload.user_id,
        "movie_id": payload.movie_id,
        "rating": payload.rating,
    }


@app.get("/similarity/{user_id_1}/{user_id_2}", response_model=SimilarityResponse)
def similarity(user_id_1: int, user_id_2: int):
    """Expone la similaridad de Pearson entre dos usuarios."""
    if user_id_1 not in ratings or user_id_2 not in ratings:
        raise HTTPException(status_code=404, detail="Alguno de los usuarios no existe")

    pearson = pearson_correlation(user_id_1, user_id_2, ratings)
    shared_movie_count = len(get_shared_movie_ids(user_id_1, user_id_2, ratings))
    return SimilarityResponse(
        user_id_1=user_id_1,
        user_id_2=user_id_2,
        pearson=pearson,
        shared_movie_count=shared_movie_count,
    )


@app.get("/users/{user_id}/ratings", response_model=UserRatingsResponse)
def user_ratings(user_id: int):
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")
    return UserRatingsResponse(user_id=user_id, ratings=ratings[user_id])


@app.get("/movies/{movie_id}", response_model=MovieResponse)
def movie_detail(movie_id: int):
    if movie_id not in items:
        raise HTTPException(status_code=404, detail=f"Película {movie_id} no encontrada")
    return MovieResponse(movie_id=movie_id, title=items[movie_id].get("title", ""))
