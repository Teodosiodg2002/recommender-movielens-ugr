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

from typing import Dict, Tuple
import os


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
                items[movie_id] = {'title': title, 'raw': line}

    # Retornar las estructuras
    return ratings, items


if __name__ == '__main__':
    # Prueba rápida si se ejecuta directamente
    try:
        r, i = load_data()
        print(f"Usuarios cargados: {len(r)}; Películas en metadatos: {len(i)}")
    except FileNotFoundError as e:
        print(e)
