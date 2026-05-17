# Despliegue e instalación

## Requisitos previos

- Git
- Docker y Docker Compose
- Python 3.9+ (solo para desarrollo local si no se usa Docker)
- Node.js 16+ y npm (solo para desarrollo local si no se usa Docker)

## Preparación local sin Docker

### 1. Clonar el repositorio

```bash
git clone https://github.com/Teodosiodg2002/recommender-movielens-ugr.git
cd recommender-movielens-ugr
```

### 2. Preparar backend

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

### 3. Preparar frontend

```bash
cd frontend
npm ci
```

## Datos de MovieLens

Descarga el dataset MovieLens 100k y coloca los ficheros `u.data` y `u.item` en `backend/data/`.

## Ejecución local sin Docker

### Backend

```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
npx serve dist
```

## Ejecución con Docker Compose

### 1. Construir y arrancar los servicios

```bash
docker compose up --build
```

### 2. Acceso

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Documentación automática de la API: `http://localhost:8000/docs`

## Notas

- El frontend se construye como una aplicación estática y se sirve desde Nginx.
- El backend expone la API FastAPI en el puerto `8000`.
- El volumen `backend/data` se monta como lectura para que los datos de MovieLens permanezcan disponibles.
