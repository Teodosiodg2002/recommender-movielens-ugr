import { useCallback, useEffect, useState } from 'react'
import type { MovieRecommendation, SimilarityAlgorithm, UserMetrics, RatingPayload } from '../types/api'
import { fetchMetrics, fetchRecommendations, postRating } from '../api/client'

export function useRecommendationData(userId: number, algorithm: SimilarityAlgorithm) {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadMetrics = useCallback(async () => {
    try {
      const data = await fetchMetrics(userId, algorithm)
      setMetrics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [userId, algorithm])

  const loadRecommendations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchRecommendations(userId, algorithm)
      setRecommendations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setRecommendations([])
    } finally {
      setLoading(false)
    }
  }, [userId, algorithm])

  useEffect(() => {
    loadMetrics()
    loadRecommendations()
  }, [loadMetrics, loadRecommendations])

  const refresh = useCallback(async () => {
    await Promise.all([loadMetrics(), loadRecommendations()])
  }, [loadMetrics, loadRecommendations])

  const submitRating = useCallback(
    async (payload: RatingPayload) => {
      await postRating(payload)
      await refresh()
    },
    [refresh],
  )

  return {
    metrics,
    recommendations,
    loading,
    error,
    refresh,
    submitRating,
    refreshMetrics: loadMetrics,
    refreshRecommendations: loadRecommendations,
  }
}
