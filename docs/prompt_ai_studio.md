# Prompt Profesional para Google AI Studio — Generación de Memoria PDF

Copia y pega la totalidad del contenido de este bloque en **Google AI Studio** (preferiblemente usando el modelo **Gemini 1.5 Pro** o **Gemini 1.5 Flash** con temperatura baja, por ejemplo, `0.2` o `0.3`) para obtener una memoria académica impecable en formato Markdown, lista para ser convertida a PDF.

---

```markdown
Actúa como un estudiante de matrícula de honor del Máster en Ingeniería Informática de la Universidad de Granada (UGR). Tu objetivo es redactar la memoria de documentación académica para la asignatura "Gestión de Información en la Web" (GIW), específicamente para la "Práctica 4: Desarrollo de un Sistema de Recomendación basado en Filtrado Colaborativo".

La memoria debe ser redactada en español, con un tono formal, técnico, riguroso y estructurada de forma impecable utilizando formato Markdown, lista para ser impresa en PDF.

A continuación te proporciono el contexto detallado de cómo está construida mi aplicación y las decisiones de diseño tomadas para que las desarrolles en profundidad.

---

### 1. Requisitos de la Práctica (Contexto de Negocio)
El sistema debe desarrollar un recomendador de filtrado colaborativo usuario-usuario utilizando el conjunto de datos MovieLens 100k (100,000 valoraciones, 943 usuarios, 1682 películas):
1. **u.data**: contiene valoraciones en formato (idUser idMovie valoración timestamp).
2. **u.item**: contiene información de películas separado por '|' en codificación 'latin-1' (idMovie | título | género...).
3. La aplicación debe mostrar 20 películas al azar no valoradas por el usuario activo, permitiéndole puntuarlas de 1 a 5 estrellas (*).
4. Al puntuar, el sistema debe calcular el vecindario del usuario activo (los 10 usuarios más parecidos en base a películas comunes).
5. Predecir las calificaciones para todas las películas vistas por los vecinos y no vistas por el usuario activo.
6. Mostrar al usuario en pantalla únicamente las películas recomendadas que tengan predicciones estimadas de 4 o 5 estrellas.

---

### 2. Estructura de mi Proyecto y Código Real

Mi sistema está construido de forma moderna con un desacoplamiento completo de capas (Backend API + Frontend SPA reactiva):

#### A. Backend (FastAPI, Python):
* **Carga de Datos (`backend/app/data_loader.py`)**:
  * Lee `u.data` (UTF-8, delimitado por tabulaciones) y `u.item` (latin-1, separado por '|' y parseando géneros).
  * Estructura interna: utiliza un diccionario de diccionarios en memoria: `ratings: dict[int, dict[int, float]]` -> `{user_id: {movie_id: rating}}` y `items: dict[int, dict[str, str]]` -> `{movie_id: {"title": ..., "year": ..., "genre": ...}}`. Esto permite búsquedas y cruces de películas comunes en coste constante $O(1)$ sin recurrir a matrices densas de memoria ineficiente.
  * Implementa `pearson_correlation(user_id_1, user_id_2, ratings)` sobre películas co-valoradas.
* **API y Recomendación (`backend/app/main.py`)**:
  * Implementa `get_top_neighbors(user_id, algorithm, size=10)` que selecciona los 10 vecinos con correlación positiva más alta.
  * Implementa `predict_rating_from_neighbors(user_id, movie_id, neighbors)` para calcular la media ponderada por similitud de las valoraciones de los vecinos.
  * Implementa `compute_recommendations(user_id, limit, min_rating, algorithm)` para filtrar predicciones estimadas $\ge 4.0$ estrellas en películas no vistas.
  * Endpoints clave: `GET /movies/random`, `POST /rate`, `GET /recommendations`, `GET /metrics`, `GET /similarity/{u1}/{u2}`.

#### B. Frontend (React 18, TypeScript, Vite, Tailwind CSS):
* **Dashboard Premium**: Interfaz fluida basada en diseño *Glassmorphic* oscuro.
* **Selector Dinámico**: Campo de texto numérico interactivo en el Topbar que permite al evaluador probar con **cualquier ID de usuario (1-943)** o ingresar un **ID nuevo (como 944)** para simular un registro inicial en frío.
* **Panel de Puntuación**: Muestra 20 tarjetas de películas aleatorias con botones interactivos `1★` a `5★` para calificar.
* **Resultados en Tiempo Real**: Lista interactiva con las películas sugeridas que cargan una predicción ponderada estimada mayor o igual a 4.0.

---

### 3. Aspectos Innovadores (Puntos extra en la evaluación)
Debes detallar ampliamente estos elementos innovadores que van más allá del guion básico de clase:
1. **Soporte para Nuevos Usuarios y Cold Start**: Si el evaluador escribe un ID inexistente (ej. 944), el backend no falla con un 404. De forma robusta, carga 20 películas del catálogo general y permite empezar a puntuar de cero, recalculando en el momento que registra su primer voto.
2. **Cálculo de Métricas en Tiempo Real (RMSE y MAE)**: Para medir científicamente la calidad del recomendador del usuario activo, el endpoint `/metrics` calcula el **Error Cuadrático Medio** (RMSE) y el **Error Absoluto Medio** (MAE) prediciendo las películas que el usuario activo ya valoró basándose en la opinión de sus vecinos.
3. **Múltiples Mapeos Matemáticos de Similitud**: Interfaz que permite alternar dinámicamente entre la **Correlación de Pearson** y la **Similitud del Coseno** en tiempo real.
4. **Despliegue Portable con Docker Compose**: Envasado en contenedores Docker independientes para Frontend (Nginx) y Backend (Uvicorn).

---

### 4. Resolución del "Dilema de los Archivos JAR" (Muy Importante)
El guion solicita la entrega de "dos ficheros jar, uno para el indexador y otro para el recuperador". Sin embargo, esto es claramente una errata legacy proveniente de las prácticas anteriores de motores de búsqueda con Lucene (donde sí se indexa en Java). 
Redacta una explicación técnica y sumamente profesional que resuelva conceptualmente esta discrepancia para el profesor, detallando que:
* **Equivalente de Indexador**: Corresponde al backend de carga en FastAPI (`data_loader.py` y `main.py`) que lee de forma optimizada la base de datos de MovieLens en caliente a diccionarios O(1).
* **Equivalente de Recuperador**: Corresponde a la SPA en React que consume la API REST recuperando y ordenando las predicciones del vecindario.
* Todo ello se orquesta portablemente bajo **Docker Compose** en lugar de requerir entornos locales Java incompatibles, garantizando un despliegue sin fallos de compilación.

---

### ESTRUCTURA DE LA MEMORIA QUE DEBES GENERAR:
Por favor, genera la memoria completa en español, con gran rigor académico, desglosando fórmulas matemáticas detalladas en LaTeX (como la Correlación de Pearson y la media ponderada del recomendador) y con las siguientes secciones:

1. **PORTADA**: Diseña una portada formal en formato Markdown con el título de la práctica (Desarrollo de un Sistema de Recomendación basado en Filtrado Colaborativo), Curso 2025-2026, Asignatura (Gestión de Información en la Web), espacio para Nombre, DNI y Email del Alumno.
2. **1. RESUMEN Y OBJETIVOS DEL PROYECTO**: Breve introducción conceptual sobre el filtrado colaborativo usuario-usuario y los objetivos académicos cumplidos.
3. **2. ARQUITECTURA Y ESTRUCTURA DEL SISTEMA**: Descripción técnica del desacoplamiento FastAPI + React. Incluye un esquema de bloques en texto estructurado o diagrama de flujo conceptual. Justifica el uso de diccionarios en memoria (`dict[int, dict[int, float]]`) por su eficiencia y rendimiento en costes $O(1)$ frente a matrices dispersas.
4. **3. LOGÍSTICA DE CARGA Y PROCESADO DE DATOS (MovieLens 100k)**: Cómo se leen y transforman los ficheros `u.data` y `u.item` (incluyendo la codificación latin-1 para evitar errores de codificación en caracteres especiales).
5. **4. FUNDAMENTACIÓN MATEMÁTICA Y ALGORITMO DE RECOMENDACIÓN**:
   * **Métrica de Similitud**: Fórmulas detalladas en formato LaTeX para la **Correlación de Pearson** y la **Similitud del Coseno**.
   * **Cálculo del Vecindario**: Cómo se seleccionan los 10 vecinos más cercanos con correlación positiva.
   * **Fórmula de Predicción**: Explicación y fórmula LaTeX de la media ponderada para estimar puntuaciones sobre películas no vistas.
6. **5. ASPECTOS INNOVADORES IMPLEMENTADOS**:
   * Gestión robusta del problema del Arranque en Frío (Cold Start) para nuevos IDs de usuario.
   * Cálculo dinámico de métricas de error de calidad en tiempo real (fórmulas e implementación de RMSE y MAE).
   * Alternancia dinâmica de algoritmos (Pearson vs. Coseno) en caliente.
   * Despliegue industrial portable y estandarizado con contenedores Docker Compose.
7. **6. SOLUCIÓN AL REQUISITO DE ARCHIVOS JAR DE ENTREGA**: Explicación formal y elegante del por qué de la omisión física de archivos `.jar` a favor de una arquitectura moderna basada en microservicios contenerizados de Python y React, estableciendo la analogía conceptual entre el Indexador (FastAPI) y el Recuperador (React SPA).
8. **7. PEQUEÑO MANUAL DE USUARIO**:
   * Pasos de arranque rápido usando Docker: `docker compose up --build`.
   * Pasos de ejecución local sin Docker (Python VirtualEnv y Node.js/npm).
   * Pasos para probar el sistema: cómo introducir un ID de usuario en la barra superior, cómo usar las estrellas `1★`-`5★` para puntuar películas aleatorias, y cómo ver y comparar las recomendaciones.
9. **8. REFERENCIAS BIBLIOGRÁFICAS**: Enlaces al dataset oficial de GroupLens MovieLens 100k, y documentación oficial del stack tecnológico utilizado.

Escribe un reporte sumamente extenso, rico en detalles técnicos, explicaciones de algoritmos y formalismo científico. No utilices resúmenes vagos ni marcadores de posición ("PLACEHOLDERS"). Escribe todo el texto de manera completa.
```
