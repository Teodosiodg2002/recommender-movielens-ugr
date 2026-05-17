# Documentación de la API

## Propósito

Esta API REST permite al frontend cargar películas de evaluación, enviar valoraciones, consultar recomendaciones de filtrado colaborativo y revisar métricas del modelo.

## Endpoints definidos

### `GET /movies/random`

Devuelve una selección aleatoria de películas no vistas por el usuario activo.

#### Parámetros
- `userId` (query): identificador del usuario.
- `count` (query, opcional): número de películas aleatorias a devolver (por defecto 20).

#### Respuesta
- `200 OK`
  - Lista de objetos con `movieId`, `title`, `year`, `genre`.

### `POST /rate`

Registra una valoración del usuario sobre una película.

#### Cuerpo
- `user_id`: identificador del usuario.
- `movie_id`: identificador de la película.
- `rating`: valor entre 1 y 5.

#### Respuesta
- `200 OK` si la valoración se procesa correctamente.

### `GET /recommendations`

Genera recomendaciones basadas en filtrado colaborativo usuario-usuario.

#### Parámetros
- `userId` (query): identificador del usuario.
- `algorithm` (query): `pearson` o `cosine`.
- `minRating` (query): umbral mínimo de predicción (por defecto 4.0).
- `limit` (query): número máximo de recomendados.

#### Respuesta
- `200 OK`
  - Lista de objetos con `movieId`, `title`, `year`, `genre`, `predictedRating`.

### `GET /metrics`

Devuelve métricas de predicción del usuario activo.

#### Parámetros
- `userId` (query): identificador del usuario.
- `algorithm` (query): `pearson` o `cosine`.

#### Respuesta
- `200 OK`
  - `activeUserId`, `algorithm`, `rmse`, `mae`, `lastUpdatedAt`.

### `GET /users/{user_id}/ratings`

Devuelve las valoraciones conocidas de un usuario.

#### Parámetros
- `user_id` (ruta): identificador del usuario.

#### Respuesta
- `200 OK`
  - `user_id`, `ratings`.

### `GET /movies/{movie_id}`

Devuelve metadatos básicos de una película.

#### Parámetros
- `movie_id` (ruta): identificador de la película.

#### Respuesta
- `200 OK`
  - `movie_id`, `title`, `year`, `genre`.

## Errores y códigos de estado

- `404 Not Found`: usuario o película no encontrado.
- `400 Bad Request`: parámetro inválido.
- `500 Internal Server Error`: error interno en el servidor.

## Notas de implementación

- La API está implementada con FastAPI.
- La selección aleatoria de 20 películas usa `/movies/random` para que el usuario evalúe títulos nuevos.
- Las recomendaciones devuelven películas predichas con rating mínimo de 4 estrellas según el vecindario más cercano.
