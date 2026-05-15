# Sistema de Recomendación — MovieLens (100k)

## Resumen del proyecto
Este repositorio agrupa los artefactos necesarios para desarrollar un sistema de recomendación colaborativo de tipo usuario-usuario sobre el dataset MovieLens 100k. Está pensado como un trabajo de clase con enfoque didáctico y buenas prácticas de ingeniería: modularidad, trazabilidad de cambios y documentación clara.

## Arquitectura propuesta
- Backend: FastAPI (Python). Exponerá endpoints para obtener recomendaciones, gestionar modelos y servir métricas.
- Frontend: React (SPA). Interfaz para visualización de películas, envío de valoraciones y obtención de recomendaciones.
- Datos: Estructura de ficheros en `backend/data` que contendrá los ficheros originales de MovieLens (`u.data`, `u.item`) y artefactos generados.

Componentes clave:
- `backend/app/core`: implementación de los algoritmos de recomendación y utilidades matemáticas.
- `backend/app/data_loader.py`: funciones para carga y preprocesado de los ficheros MovieLens.
- `frontend`: aplicación React responsable de la UX y consumo de la API.

## Estructura del repositorio
- `backend/` — código servidor, modelos y utilidades.
- `frontend/` — código cliente React.
- `docs/` — documentación del diseño y la API (`architecture.md`, `api.md`).

## Requisitos
- Git
- Python 3.9+
- Node.js 16+ y npm (o pnpm/yarn)

## Instalación (local, entorno de desarrollo)
1. Clonar el repositorio y situarse en él:

```bash
git clone https://github.com/Teodosiodg2002/recommender-movielens-ugr.git
cd recommender-movielens-ugr
```

2. Preparar backend (Python):

```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

3. Preparar frontend (React):

```bash
cd frontend
npm ci
npm run dev
```

4. Datos: descargar MovieLens 100k y colocar los ficheros `u.data` y `u.item` en `backend/data/`.

## Uso básico
- Arrancar backend (desde la raíz del repo):

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

- Acceder a la documentación automática de la API en `http://localhost:8000/docs`.

## Hoja de ruta (milestones)
1. Inicialización: estructura del repositorio, carga de datos y scripts auxiliares.
2. Carga y preprocesado: implementar `load_data()` y generar una matriz de utilidades eficiente.
3. Implementación del algoritmo: similitud (Pearson, Coseno) y generación de recomendaciones.
4. API y frontend: exponer endpoints y construir interfaz mínima funcional.
5. Evaluación y despliegue: tests, métricas de calidad, optimizaciones y empaquetado (Docker).

## Contribuciones y buen uso de VCS
- Realizar commits pequeños y descriptivos por cada cambio lógico (ej.: `feat(data): add load_data skeleton`).
- Abrir ramas por característica y crear PRs para integración.

---

Si quieres que ajuste el texto (más técnico, más breve, o en inglés), indícamelo y lo adapto. Procedo a crear un commit con este cambio si confirmas.
