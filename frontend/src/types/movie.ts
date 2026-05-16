export type Step = 'vote' | 'results'

export type RecommendationAlgorithm = 'pearson' | 'cosine'

export interface Movie {
  id: number
  title: string
  genre: string
  year: string
}

export interface RecommendationItem {
  movieId: number
  title: string
  score: number
}
