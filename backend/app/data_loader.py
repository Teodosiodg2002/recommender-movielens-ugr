"""Carga y preprocesado básico para los ficheros MovieLens 100k.

Proporciona la función `load_data()` que lee `u.data` y `u.item` y devuelve
una estructura de datos en memoria adecuada para cálculos de similitud.

Estructura devuelta:
 - ratings: dict[int, dict[int, float]] -> {user_id: {movie_id: rating}}
 - items: dict[int, dict] -> {movie_id: {"title": ..., "genres": ...}}

Notas sobre diseño:
- Un diccionario de diccionarios (`ratings`) permite acceso O(1) a la
  calificación de un usuario por una película concreta: `ratings[u][i]`.
  Esta representación es eficiente para algoritmos usuario-usuario porque
  permite iterar las películas comunes entre parejas de usuarios consultando
  rápidamente las claves internas sin escaneos lineales completos.
- Para el cálculo de la correlación de Pearson (o similaridad basada en pares),
  necesitaremos obtener las valoraciones compartidas entre dos usuarios. Con
  `ratings[u]` y `ratings[v]` podemos iterar sobre la menor de las dos claves
  y comprobar presencia en la otra; esto minimiza coste y evita construir
  matrices densas innecesarias para datasets relativamente dispersos.

"""
from __future__ import annotations

from typing import Dict, Set, Tuple
import math
import os

GENRE_LABELS = [
    'Unknown',
    'Action',
    'Adventure',
    'Animation',
    "Children's",
    'Comedy',
    'Crime',
    'Documentary',
    'Drama',
    'Fantasy',
    'Film-Noir',
    'Horror',
    'Musical',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
    'War',
    'Western',
]


def load_data(data_dir: str = None, udata: str = 'u.data', uitem: str = 'u.item') -> Tuple[Dict[int, Dict[int, float]], Dict[int, Dict[str, str]]]:
    """Carga `u.data` (valoraciones) y `u.item` (metadatos de películas).

    Parámetros:
    - data_dir: ruta al directorio que contiene los ficheros. Si es None,
      se asume `backend/data` relativo al directorio actual del repositorio.
    - udata: nombre del fichero de valoraciones (por defecto 'u.data').
    - uitem: nombre del fichero de ítems (por defecto 'u.item').

    Devuelve una tupla `(ratings, items)` donde:
    - `ratings` es un dict de dicts con la forma {user_id: {movie_id: rating}}
    - `items` es un dict con metadatos de película: {movie_id: {'title': ..., 'raw': ...}}

    Observaciones:
    - `u.data` está separado por tabuladores: user_id\titem_id\trating\ttimestamp
    - `u.item` tiene campos separados por '|' y puede contener caracteres en
      latin-1; se abre con encoding 'latin-1' para preservar acentos.
    """

    # Determinar ruta por defecto relativa al repo
    if data_dir is None:
        base = os.path.dirname(__file__)
        # Desde backend/app, subir un nivel a backend y acceder a backend/data
        data_dir = os.path.normpath(os.path.join(base, '..', 'data'))

    ratings: Dict[int, Dict[int, float]] = {}
    items: Dict[int, Dict[str, str]] = {}

    udata_path = os.path.join(data_dir, udata)
    uitem_path = os.path.join(data_dir, uitem)

    # Cargar u.data
    if os.path.exists(udata_path):
        with open(udata_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split('\t')
                if len(parts) < 3:
                    continue
                try:
                    user_id = int(parts[0])
                    movie_id = int(parts[1])
                    rating = float(parts[2])
                except ValueError:
                    # ignorar líneas malformadas
                    continue

                ratings.setdefault(user_id, {})[movie_id] = rating

    else:
        raise FileNotFoundError(f"No se encontró {udata_path}. Coloca 'u.data' en {data_dir}.")

    # Cargar u.item (opcionalmente extraer título)
    if os.path.exists(uitem_path):
        with open(uitem_path, 'r', encoding='latin-1') as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                parts = line.split('|')
                try:
                    movie_id = int(parts[0])
                except (ValueError, IndexError):
                    continue
                title = parts[1] if len(parts) > 1 else ''
                year = 'N/A'
                if title.endswith(')') and '(' in title:
                    candidate = title.rsplit('(', 1)[1]
                    if candidate.endswith(')'):
                        year = candidate[:-1]

                genres = []
                if len(parts) >= 24:
                    flags = parts[5:24]
                    genres = [GENRE_LABELS[i] for i, flag in enumerate(flags) if flag == '1']
                items[movie_id] = {
                    'title': title,
                    'year': year,
                    'genre': genres[0] if genres else 'Unknown',
                    'raw': line,
                }

    # Retornar las estructuras
    return ratings, items


def get_shared_movie_ids(user_id_1: int, user_id_2: int, ratings: Dict[int, Dict[int, float]]) -> Set[int]:
    """Devuelve el conjunto de películas valoradas por ambos usuarios.

    La función elige iterar sobre el usuario con menos valoraciones, lo que
    reduce el coste en tiempo cuando los perfiles tienen tamaños muy distintos.
    Esto es importante en datasets dispersos como MovieLens, donde cada usuario
    valora solo una fracción de las películas disponibles.
    """

    if user_id_1 not in ratings or user_id_2 not in ratings:
        return set()

    ratings_1 = ratings[user_id_1]
    ratings_2 = ratings[user_id_2]

    if len(ratings_1) <= len(ratings_2):
        smaller, larger = ratings_1, ratings_2
    else:
        smaller, larger = ratings_2, ratings_1

    return {movie_id for movie_id in smaller if movie_id in larger}


def pearson_correlation(user_id_1: int, user_id_2: int, ratings: Dict[int, Dict[int, float]]) -> float:
    """Calcula la correlación de Pearson entre dos usuarios usando películas compartidas.

    Retorna un valor entre -1 y 1. Si no hay suficientes películas compartidas o
    si las puntuaciones son constantes, devuelve 0.0 para indicar que no se
    puede establecer una similitud estadísticamente significativa.
    """

    shared_movie_ids = get_shared_movie_ids(user_id_1, user_id_2, ratings)
    if len(shared_movie_ids) < 2:
        return 0.0

    ratings_1 = ratings[user_id_1]
    ratings_2 = ratings[user_id_2]
    values_1 = [ratings_1[movie_id] for movie_id in shared_movie_ids]
    values_2 = [ratings_2[movie_id] for movie_id in shared_movie_ids]

    mean_1 = sum(values_1) / len(values_1)
    mean_2 = sum(values_2) / len(values_2)

    numerator = sum((x - mean_1) * (y - mean_2) for x, y in zip(values_1, values_2))
    sum_sq_1 = sum((x - mean_1) ** 2 for x in values_1)
    sum_sq_2 = sum((y - mean_2) ** 2 for y in values_2)

    denominator = math.sqrt(sum_sq_1 * sum_sq_2)
    if denominator == 0.0:
        return 0.0

    return numerator / denominator


if __name__ == '__main__':
    # Prueba rápida si se ejecuta directamente
    try:
        r, i = load_data()
        print(f"Usuarios cargados: {len(r)}; Películas en metadatos: {len(i)}")
    except FileNotFoundError as e:
        print(e)
