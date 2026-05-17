import { useCallback, useEffect, useState } from 'react'
import type { Movie, MovieRecommendation, RatingPayload, SimilarityAlgorithm, UserMetrics } from '../types/api'
import { fetchMetrics, fetchRandomMovies, fetchRecommendations, postRating } from '../api/client'

export function useMovieRecommendations(userId: number, algorithm: SimilarityAlgorithm) {
  const [movies, setMovies] = useState<Movie[]>([])
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([])
  const [metrics, setMetrics] = useState<UserMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadMovies = useCallback(async () => {
    const data = await fetchRandomMovies(userId)
    setMovies(data)
  }, [userId])

  const loadRecommendations = useCallback(async () => {
    const data = await fetchRecommendations(userId, algorithm)
    setRecommendations(data)
  }, [userId, algorithm])

  const loadMetrics = useCallback(async () => {
    const data = await fetchMetrics(userId, algorithm)
    setMetrics(data)
  }, [userId, algorithm])

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([loadMovies(), loadRecommendations(), loadMetrics()])
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }, [loadMovies, loadRecommendations, loadMetrics])

  useEffect(() => {
    refresh()
  }, [refresh])

  const rateMovie = useCallback(
    async (movieId: number, rating: number) => {
      setLoading(true)
      setError(null)
      try {
        await postRating({ userId, movieId, rating })
        await refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        setLoading(false)
      }
    },
    [refresh, userId],
  )

  return {
    movies,
    recommendations,
    metrics,
    loading,
    error,
    refresh,
    rateMovie,
  }
}
