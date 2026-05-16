import type { MovieRecommendation, SimilarityAlgorithm } from '../types/api'
import { RecommendationEngine } from './RecommendationEngine'
import { InteractionConsole } from './InteractionConsole'

interface WorkspaceProps {
  recommendations: MovieRecommendation[]
  loading: boolean
  error: string | null
  algorithm: SimilarityAlgorithm
  userId: number
  onSubmitRating: (payload: { userId: number; movieId: string; rating: number }) => Promise<void>
  ratingsCount: number
}

export function Workspace({
  recommendations,
  loading,
  error,
  algorithm,
  userId,
  onSubmitRating,
  ratingsCount,
}: WorkspaceProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-bg-main">
      <RecommendationEngine recommendations={recommendations} loading={loading} error={error} />
      <InteractionConsole
        algorithm={algorithm}
        userId={userId}
        onSubmitRating={onSubmitRating}
        ratingsCount={ratingsCount}
      />
    </div>
  )
}
