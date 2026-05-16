import { Sparkles } from 'lucide-react'
import { RecommendationAlgorithm, RecommendationItem } from '../types/movie'

interface RecommendationPanelProps {
  algorithm: RecommendationAlgorithm
  similarityThreshold: number
  recommendations: RecommendationItem[]
  onAlgorithmChange: (algorithm: RecommendationAlgorithm) => void
  onThresholdChange: (threshold: number) => void
}

export function RecommendationPanel({
  algorithm,
  similarityThreshold,
  recommendations,
  onAlgorithmChange,
  onThresholdChange,
}: RecommendationPanelProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-indigo-700/25 bg-slate-950/80 p-5 shadow-inner">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-indigo-300">Ajustes</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-100">Control de similitud</h3>
          </div>
          <Sparkles className="h-8 w-8 text-indigo-400" />
        </div>

        <div className="grid gap-5">
          <div className="space-y-3 rounded-3xl bg-slate-900/70 p-4">
            <p className="text-sm font-semibold text-slate-100">Algoritmo</p>
            <div className="flex flex-wrap gap-3">
              {(['pearson', 'cosine'] as RecommendationAlgorithm[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onAlgorithmChange(option)}
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                    algorithm === option
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {option === 'pearson' ? 'Pearson' : 'Coseno'}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-900/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-100">Umbral de similitud</p>
              <span className="text-sm text-slate-300">{similarityThreshold.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={similarityThreshold}
              onChange={(event) => onThresholdChange(Number(event.target.value))}
              className="mt-4 w-full accent-indigo-500"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-indigo-700/25 bg-slate-950/80 p-5 shadow-inner">
        <h3 className="text-xl font-semibold text-slate-100">Recomendaciones finales</h3>
        <p className="mt-2 text-sm text-slate-400">
          Estas recomendaciones se filtraron usando tu umbral y el algoritmo seleccionado.
        </p>

        <div className="mt-6 grid gap-4">
          {recommendations.length > 0 ? (
            recommendations.map((item) => (
              <div
                key={item.movieId}
                className="rounded-3xl border border-white/5 bg-slate-900/70 p-4 transition hover:border-indigo-400/40"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-100">{item.title}</h4>
                    <p className="text-sm text-slate-400">ID: {item.movieId}</p>
                  </div>
                  <span className="rounded-2xl bg-indigo-500/20 px-3 py-1 text-sm font-semibold text-indigo-200">
                    {item.score.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/60 p-6 text-center text-slate-400">
              No hay recomendaciones disponibles aún. Completa la votación para obtener resultados.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
