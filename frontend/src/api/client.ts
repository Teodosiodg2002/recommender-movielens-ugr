import type { MovieRecommendation, RatingPayload, UserMetrics, SimilarityAlgorithm } from '../types/api'

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8000'

const jsonHeaders = {
  'Content-Type': 'application/json',
}

export async function fetchMetrics(userId: number, algorithm: SimilarityAlgorithm): Promise<UserMetrics> {
  const response = await fetch(`${BASE_URL}/metrics?userId=${userId}&algorithm=${algorithm}`)
  if (!response.ok) {
    throw new Error('Error al obtener métricas')
  }
  return response.json()
}

export async function fetchRecommendations(
  userId: number,
  algorithm: SimilarityAlgorithm,
): Promise<MovieRecommendation[]> {
  const response = await fetch(`${BASE_URL}/recommendations?userId=${userId}&algorithm=${algorithm}`)
  if (!response.ok) {
    throw new Error('Error al obtener recomendaciones')
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
