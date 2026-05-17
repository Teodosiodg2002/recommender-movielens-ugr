# Sistema de Recomendación — MovieLens (100k)

## Resumen del proyecto

Aplicación de recomendación de películas basada en filtrado colaborativo usuario-usuario usando MovieLens 100k.

- Backend: FastAPI en Python.
- Frontend: React + Vite con una UI limpia tipo dashboard.
- Deploy: Docker Compose con frontend estático servido por Nginx y backend FastAPI.

## Qué hace

- Carga 20 películas aleatorias no vistas por el usuario activo.
- Permite puntuar cada película de 1 a 5 estrellas.
- Calcula el vecindario de los 10 usuarios más similares.
- Predice valoraciones de películas no vistas y muestra recomendaciones con predicción de 4 o 5 estrellas.
- Muestra métricas de calidad como RMSE y MAE.

## Estructura del repositorio

- `backend/`: servidor FastAPI, lógica de recomendación y datos.
- `frontend/`: SPA React con dashboard minimalista.
- `docs/`: documentación de arquitectura, API y despliegue.
- `docker-compose.yml`: despliegue local simple para backend y frontend.

## Cómo ejecutar

### Con Docker Compose

```bash
docker compose up --build
```

Visita:

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Swagger: `http://localhost:8000/docs`

### Sin Docker

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
cd frontend
npm ci
cd ..
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

En otra terminal:

```bash
cd frontend
npm run build
npx serve dist
```

## Endpoints principales

- `GET /movies/random?userId=...&count=20`
- `POST /rate`
- `GET /recommendations?userId=...&algorithm=pearson&minRating=4`
- `GET /metrics?userId=...&algorithm=pearson`
- `GET /users/{user_id}/ratings`
- `GET /movies/{movie_id}`

## Notas importantes

- Coloca `u.data` y `u.item` en `backend/data/` antes de arrancar el backend.
- El frontend usa `VITE_API_URL=http://backend:8000` en el despliegue Docker.
- El backend utiliza un vecindario fijo de 10 usuarios para el cálculo colaborativo.
