export type SimilarityAlgorithm = 'pearson' | 'cosine'

export interface Movie {
  movieId: number
  title: string
  year: string
  genre: string
}

export interface MovieRecommendation extends Movie {
  predictedRating: number
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
  movieId: number
  rating: number
}
