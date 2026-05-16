export type SimilarityAlgorithm = 'pearson' | 'cosine'

export interface MovieRecommendation {
  movieId: string
  title: string
  year: string
  genre: string
  similarity: number
}

export interface UserMetrics {
  rmse: number
  mae: number
  algorithm: SimilarityAlgorithm
  lastUpdatedAt?: string
  activeUserId: number
}

export interface RatingPayload {
  userId: number
  movieId: string
  rating: number
}

export interface OptimisticRating extends RatingPayload {
  status: 'SENDING' | 'CONFIRMED' | 'FAILED'
}
