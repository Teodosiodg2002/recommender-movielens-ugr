# Arquitectura del sistema de recomendación

## Visión general

El sistema se compone de tres capas principales:

1. **Carga y preprocesado de datos**: lee los ficheros de MovieLens, construye la estructura de valoraciones y prepara los datos para el cálculo de similitudes.
2. **Capa de lógica de recomendación**: calcula similitudes entre usuarios y genera recomendaciones a partir de los vectores de valoraciones compartidas.
3. **Interfaz**: cliente React y API REST que exponen las recomendaciones y permiten la interacción con el sistema. El frontend actual es un dashboard minimalista que carga 20 películas aleatorias para valoración y muestra recomendaciones con predicción de 4 o 5 estrellas.

## Componentes backend

### `backend/app/data_loader.py`

- `load_data()`: lee `backend/data/u.data` y `backend/data/u.item`.
- Retorna dos estructuras:
  - `ratings`: `dict[int, dict[int, float]]` con valoraciones por usuario.
  - `items`: metadatos de películas.
- Esta representación es eficiente para cálculos de similitud porque permite acceso directo a las valoraciones de un usuario y la identificación rápida de películas comunes entre pares.

### Similitud y recomendación

La etapa de similitud se basa en:

- `get_shared_movie_ids(user_id_1, user_id_2, ratings)`: determina qué películas han valorado ambos usuarios.
- `pearson_correlation(user_id_1, user_id_2, ratings)`: calcula la correlación de Pearson sobre las valoraciones compartidas.

La correlación de Pearson normaliza diferencias en escala de puntuación y detecta patrones lineales entre dos perfiles de usuario.

## Flujo de datos

1. El backend carga `u.data` y `u.item` con `load_data()`.
2. Para dos usuarios, se identifican las películas compartidas.
3. Se calcula la similitud con Pearson sobre esas películas.
4. Con los usuarios más similares, se generan recomendaciones de películas no valoradas por el usuario destino.

## Estructura del repositorio

- `backend/`: lógica de servidor, cálculo de recomendación y datos.
- `backend/app/core`: espacio reservado para implementar el algoritmo de recomendación y utilidades.
- `backend/app/data_loader.py`: carga de datos y calculadoras de similitud.
- `backend/data/`: ficheros MovieLens y artefactos de datos.
- `frontend/`: aplicación React para consumo de la API.
- `docs/`: documentación de diseño y API.

## Consideraciones de diseño

- La arquitectura separa claramente la carga de datos de la lógica de recomendación, lo que facilita pruebas unitarias y extensibilidad.
- Usar estructuras basadas en diccionarios evita la necesidad de construir matrices densas, adecuado para datasets dispersos como MovieLens 100k.
- La API REST será responsable de exponer la capa de recomendación sin acoplarla a la interfaz de usuario.
