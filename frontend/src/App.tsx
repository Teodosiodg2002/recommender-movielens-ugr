import { useState } from 'react'
import { Topbar } from './components/Topbar'
import { ControlCenter } from './components/ControlCenter'
import { Workspace } from './components/Workspace'
import { useOptimistic } from './hooks/useOptimistic'
import { useRecommendationData } from './hooks/useRecommendationData'
import type { OptimisticRating, RatingPayload, SimilarityAlgorithm } from './types/api'

export default function App() {
  const [userId, setUserId] = useState<number>(405)
  const [algorithm, setAlgorithm] = useState<SimilarityAlgorithm>('pearson')
  const { metrics, recommendations, loading, error, refresh, submitRating } = useRecommendationData(userId, algorithm)
  const { items: optimisticRatings, addOptimistic, replaceStatus } = useOptimistic<OptimisticRating>([])

  const handleSubmitRating = async (payload: RatingPayload) => {
    addOptimistic({ ...payload, status: 'SENDING' })
    try {
      await submitRating(payload)
      replaceStatus(payload.movieId, 'CONFIRMED')
    } catch (error) {
      replaceStatus(payload.movieId, 'FAILED')
      throw error
    }
  }

  return (
    <div className="grid h-screen overflow-hidden bg-bg-main text-text-main">
      <Topbar userId={userId} algorithm={algorithm} onUserChange={setUserId} />
      <div className="grid h-[calc(100vh-3rem)] grid-cols-[20rem_1fr] overflow-hidden">
        <ControlCenter
          metrics={metrics}
          algorithm={algorithm}
          onAlgorithmChange={setAlgorithm}
          onRefresh={refresh}
        />
        <Workspace
          recommendations={recommendations}
          loading={loading}
          error={error}
          algorithm={algorithm}
          userId={userId}
          onSubmitRating={handleSubmitRating}
          ratingsCount={optimisticRatings.length}
        />
      </div>
    </div>
  )
}
