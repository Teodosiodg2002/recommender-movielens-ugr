import pytest
from fastapi.testclient import TestClient

import backend.app.main as main


client = TestClient(main.app)


def test_similarity_endpoint():
    main.ratings = {
        1: {10: 4.0, 20: 3.0},
        2: {10: 5.0, 20: 4.0},
    }
    main.items = {10: {"title": "Movie A"}, 20: {"title": "Movie B"}}

    response = client.get("/similarity/1/2")
    assert response.status_code == 200
    body = response.json()
    assert body["user_id_1"] == 1
    assert body["user_id_2"] == 2
    assert body["shared_movie_count"] == 2
    assert body["pearson"] == pytest.approx(1.0, abs=1e-9)


def test_recommendations_endpoint():
    main.ratings = {
        1: {10: 4.0, 20: 3.0},
        2: {10: 5.0, 20: 4.0, 30: 5.0},
    }
    main.items = {
        10: {"title": "Movie A"},
        20: {"title": "Movie B"},
        30: {"title": "Movie C"},
    }

    response = client.get("/recommendations/1?limit=1")
    assert response.status_code == 200
    body = response.json()
    assert isinstance(body, list)
    assert len(body) == 1
    assert body[0]["movieId"] == "30"
    assert body[0]["title"] == "Movie C"
