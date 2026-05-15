from __future__ import annotations

from typing import Dict, List

from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel

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

ratings, items = load_data()


class RecommendationItem(BaseModel):
    movie_id: int
    title: str
    score: float


class RecommendationsResponse(BaseModel):
    user_id: int
    recommendations: List[RecommendationItem]


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


def compute_recommendations(user_id: int, limit: int, min_similarity: float) -> List[RecommendationItem]:
    if user_id not in ratings:
        raise HTTPException(status_code=404, detail=f"Usuario {user_id} no encontrado")

    if not ratings[user_id]:
        raise HTTPException(status_code=400, detail="El usuario no tiene valoraciones.")

    totals: Dict[int, float] = {}
    sim_sums: Dict[int, float] = {}

    for other_id in ratings:
        if other_id == user_id:
            continue

        similarity = pearson_correlation(user_id, other_id, ratings)
        if similarity <= min_similarity:
            continue

        for movie_id, rating in ratings[other_id].items():
            if movie_id in ratings[user_id]:
                continue

            totals[movie_id] = totals.get(movie_id, 0.0) + rating * similarity
            sim_sums[movie_id] = sim_sums.get(movie_id, 0.0) + similarity

    recommendations: List[RecommendationItem] = []
    for movie_id, total in totals.items():
        weight = sim_sums.get(movie_id, 0.0)
        if weight == 0.0:
            continue
        score = total / weight
        recommendations.append(
            RecommendationItem(
                movie_id=movie_id,
                title=items.get(movie_id, {}).get("title", ""),
                score=score,
            )
        )

    recommendations.sort(key=lambda item: item.score, reverse=True)
    return recommendations[:limit]


@app.get("/recommendations/{user_id}", response_model=RecommendationsResponse)
def recommendations(user_id: int, limit: int = Query(10, gt=0, le=50), min_similarity: float = Query(0.0, ge=0.0, le=1.0)):
    """Obtiene recomendaciones de películas para un usuario dado."""
    recs = compute_recommendations(user_id, limit, min_similarity)
    return RecommendationsResponse(user_id=user_id, recommendations=recs)


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
