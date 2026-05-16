# Sistema de Recomendación — MovieLens (100k)

## Resumen del proyecto

Este repositorio agrupa los artefactos necesarios para desarrollar un sistema de recomendación colaborativo de tipo usuario-usuario sobre el dataset MovieLens 100k. Está pensado como un trabajo de clase con enfoque didáctico y buenas prácticas de ingeniería: modularidad, trazabilidad de cambios y documentación clara.

## Arquitectura propuesta

- Backend: FastAPI (Python). Exponerá endpoints para obtener recomendaciones, gestionar modelos y servir métricas.
- Frontend: React (SPA). Interfaz para visualización de películas, envío de valoraciones y obtención de recomendaciones.
- Datos: estructura de ficheros en `backend/data` con los datos de MovieLens y artefactos generados.

Componentes clave:

- `backend/app/core`: implementación de los algoritmos de recomendación y utilidades matemáticas.
- `backend/app/data_loader.py`: funciones para carga y preprocesado de los ficheros MovieLens.
- `frontend`: aplicación React responsable de la UX y consumo de la API.

## Estructura del repositorio

- `backend/` — código servidor, modelos y utilidades.
- `frontend/` — código cliente React.
- `docs/` — documentación del diseño, API y despliegue.

## Documentación disponible

- `docs/architecture.md` — diseño del sistema.
- `docs/api.md` — descripción de los endpoints.
- `docs/deployment.md` — guía de instalación y despliegue local.

## Hoja de ruta

1. Inicialización: estructura del repositorio, carga de datos y scripts auxiliares.
1. Carga y preprocesado: implementar `load_data()` y generar una matriz de utilidades eficiente.
1. Implementación del algoritmo: similitud (Pearson, Coseno) y generación de recomendaciones.
1. API y frontend: exponer endpoints y construir interfaz mínima funcional.
1. Evaluación y despliegue: tests, métricas de calidad, optimizaciones y empaquetado (Docker).

## Contribuciones y buen uso de VCS

- Realizar commits pequeños y descriptivos por cada cambio lógico (ej.: `feat(data): add load_data skeleton`).
- Abrir ramas por característica y crear PRs para integración.
