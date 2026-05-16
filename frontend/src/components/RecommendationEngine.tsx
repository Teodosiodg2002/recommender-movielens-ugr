import type { MovieRecommendation } from '../types/api'

interface RecommendationEngineProps {
  recommendations: MovieRecommendation[]
  loading: boolean
  error: string | null
}

export function RecommendationEngine({ recommendations, loading, error }: RecommendationEngineProps) {
  const rows = recommendations.length
    ? recommendations.map((movie) => (
        <div
          key={movie.movieId}
          className="group grid grid-cols-[80px_1fr_140px_100px_80px] items-center border-b border-border-retro px-3 py-3 text-sm text-text-main transition hover:bg-bg-surface"
        >
          <span className="text-text-muted">{movie.movieId.padStart(4, '0')}</span>
          <span>{movie.title} ({movie.year})</span>
          <span className="text-text-muted">{movie.genre}</span>
          <span className="text-glow-green">{movie.similarity.toFixed(1)}%</span>
          <button type="button" className="text-xs uppercase tracking-[0.2em] text-glow-green">
            [ VER ]
          </button>
        </div>
      ))
    : []

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-4 text-xs uppercase tracking-[0.25em] text-text-muted">RECOMMENDATION ENGINE</div>
      <div className="border border-border-retro bg-bg-surface text-text-main">
        <div className="grid grid-cols-[80px_1fr_140px_100px_80px] border-b border-border-retro px-3 py-3 text-xs uppercase tracking-[0.25em] text-text-muted">
          <span>ID</span>
          <span>TÍTULO</span>
          <span>GÉNERO</span>
          <span>SIMILITUD</span>
          <span>ACCION</span>
        </div>
        {loading ? (
          <div className="border-b border-border-retro px-3 py-4 text-text-main">[ ON HOLD ] [ / ]</div>
        ) : error ? (
          <div className="border-b border-border-retro px-3 py-4 text-text-muted">ERROR: {error}</div>
        ) : rows.length > 0 ? (
          rows
        ) : (
          <div className="border-b border-border-retro px-3 py-4 text-text-muted">No hay recomendaciones disponibles.</div>
        )}
      </div>
    </div>
  )
}
