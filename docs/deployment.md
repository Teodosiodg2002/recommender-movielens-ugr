# Despliegue e instalación

## Requisitos previos

- Git
- Python 3.9+
- Node.js 16+ y npm

## Preparación del entorno

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

## Ejecución local

### Backend

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm run dev
```

## Acceso

- Frontend: `http://localhost:5173`
- API: `http://localhost:8000`
- Documentación automática de la API: `http://localhost:8000/docs`
