import { useMemo } from 'react'
import { Movie, RecommendationAlgorithm, RecommendationItem, Step } from '../types/movie'

interface RecommendationFlowArgs {
  movies: Movie[]
  ratings: Record<number, number>
  algorithm: RecommendationAlgorithm
  threshold: number
  step: Step
}

export function useRecommendationFlow({
  movies,
  ratings,
  algorithm,
  threshold,
  step,
}: RecommendationFlowArgs) {
  return useMemo<RecommendationItem[]>(() => {
    if (step !== 'results') {
      return []
    }

    const movieRatings = movies.map((movie) => ({
      ...movie,
      rating: ratings[movie.id] ?? 0,
    }))

    const baseScore = movieRatings.map((movie) => {
      const normalized = movie.rating / 5
      const algorithmBonus = algorithm === 'cosine' ? 0.08 : 0.0
      const thresholdPenalty = Math.max(0, threshold - normalized) * -0.2
      return {
        movieId: movie.id,
        title: movie.title,
        score: Math.max(0, normalized + algorithmBonus + thresholdPenalty),
      }
    })

    return baseScore
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
  }, [movies, ratings, algorithm, threshold, step])
}
