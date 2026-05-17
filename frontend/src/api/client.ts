import type { Movie, MovieRecommendation, RatingPayload, SimilarityAlgorithm, UserMetrics } from '../types/api'

const BASE_URL = (import.meta.env.VITE_API_URL as string) || '/api'

const jsonHeaders = {
  'Content-Type': 'application/json',
}

function parseMovie(movie: any): Movie {
  return {
    movieId: Number(movie.movieId),
    title: movie.title ?? '',
    year: movie.year ?? 'N/A',
    genre: movie.genre ?? 'Unknown',
  }
}

function parseRecommendation(movie: any): MovieRecommendation {
  return {
    ...parseMovie(movie),
    predictedRating: Number(movie.predictedRating) || 0,
  }
}

export async function fetchRandomMovies(userId: number, count = 20): Promise<Movie[]> {
  const response = await fetch(`${BASE_URL}/movies/random?userId=${userId}&count=${count}`)
  if (!response.ok) {
    throw new Error('Error al obtener películas')
  }

  const data = await response.json()
  return data.map((movie: any) => parseMovie(movie))
}

export async function fetchRecommendations(
  userId: number,
  algorithm: SimilarityAlgorithm,
): Promise<MovieRecommendation[]> {
  const response = await fetch(`${BASE_URL}/recommendations?userId=${userId}&algorithm=${algorithm}&minRating=4`)
  if (!response.ok) {
    throw new Error('Error al obtener recomendaciones')
  }

  const data = await response.json()
  return data.map((movie: any) => parseRecommendation(movie))
}

export async function fetchMetrics(userId: number, algorithm: SimilarityAlgorithm): Promise<UserMetrics> {
  const response = await fetch(`${BASE_URL}/metrics?userId=${userId}&algorithm=${algorithm}`)
  if (!response.ok) {
    throw new Error('Error al obtener métricas')
  }
  return response.json()
}

export async function postRating(payload: RatingPayload): Promise<void> {
  const response = await fetch(`${BASE_URL}/rate`, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error('Error al enviar valoración')
  }
}
