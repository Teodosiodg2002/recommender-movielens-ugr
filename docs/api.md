# Documentación de la API

## Propósito

Esta API REST permitirá consultar recomendaciones de películas, obtener información de usuarios y películas, y gestionar la carga de datos.

## Endpoints definidos

### `GET /recommendations/{user_id}`

Devuelve recomendaciones para un usuario concreto en función de las similitudes con otros usuarios.

#### Parámetros
- `user_id` (ruta): identificador del usuario.
- `limit` (query, opcional): número máximo de recomendaciones.

#### Respuesta
- `200 OK`
  - `user_id`: id del usuario de destino.
  - `recommendations`: lista ordenada de películas recomendadas.
  - `source_user_id`: id del usuario más similar que generó cada recomendación.

```json
{
  "user_id": 1,
  "recommendations": [
    {"movie_id": 50, "title": "Toy Story", "score": 0.82},
    {"movie_id": 100, "title": "Sleepless in Seattle", "score": 0.76}
  ]
}
```

### `GET /movies/{movie_id}`

Devuelve metadatos de una película.

#### Parámetros
- `movie_id` (ruta): identificador de la película.

#### Respuesta
- `200 OK`
  - `movie_id`, `title`, y campos adicionales según metadatos.

### `GET /users/{user_id}/ratings`

Devuelve las valoraciones de un usuario.

#### Parámetros
- `user_id` (ruta): identificador del usuario.

#### Respuesta
- `200 OK`
  - `user_id`: identificador consultado.
  - `ratings`: lista de pares `movie_id` y `rating`.

### `POST /reload-data`

Recarga los datos desde los ficheros `u.data` y `u.item` sin reiniciar el servidor.

#### Respuesta
- `200 OK` si la recarga es correcta.
- `500 Internal Server Error` en caso de fallo de lectura.

## Errores y códigos de estado

- `404 Not Found`: usuario o película no encontrado.
- `400 Bad Request`: parámetro inválido.
- `500 Internal Server Error`: error interno en el servidor.

## Notas de implementación

- La API será implementada con FastAPI en el backend.
- La respuesta principal de recomendaciones incluirá un `score` de similitud para ordenar los resultados.
- En una versión posterior, el endpoint podrá aceptar parámetros adicionales como `min_common_ratings` o filtros de género.
