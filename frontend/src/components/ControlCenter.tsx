import type { SimilarityAlgorithm, UserMetrics } from '../types/api'

interface ControlCenterProps {
  metrics: UserMetrics | null
  algorithm: SimilarityAlgorithm
  onAlgorithmChange: (next: SimilarityAlgorithm) => void
  onRefresh: () => void
}

const algorithmLabels: Record<SimilarityAlgorithm, string> = {
  pearson: 'PEARSON',
  cosine: 'COSENO',
}

export function ControlCenter({ metrics, algorithm, onAlgorithmChange, onRefresh }: ControlCenterProps) {
  return (
    <div className="w-80 border-r border-border-retro bg-bg-main p-4 text-sm text-text-main">
      <div className="mb-4 font-semibold uppercase tracking-[0.25em]">CONTROL CENTER</div>

      <div className="mb-4">
        <div className="font-semibold uppercase text-text-muted">Métricas del modelo</div>
        <pre className="mt-2 whitespace-pre-wrap border border-border-retro p-3 bg-bg-surface text-text-main">
{`+------------------------------+
| RMSE   | ${metrics?.rmse?.toFixed(2) ?? '--'}     |
| MAE    | ${metrics?.mae?.toFixed(2) ?? '--'}     |
| ALGOR  | ${metrics ? algorithmLabels[metrics.algorithm] : '--'} |
| USR_ID | ${metrics?.activeUserId ?? '--'}      |
+------------------------------+`}
        </pre>
      </div>

      <div className="mb-4">
        <div className="font-semibold uppercase text-text-muted">Comandos</div>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={onRefresh}
            className="border border-border-retro px-3 py-2 text-left font-medium uppercase tracking-[0.25em] text-text-main"
          >
            [ RE-ENTRENAR MODELO ]
          </button>

          <button
            type="button"
            onClick={() => onAlgorithmChange(algorithm === 'pearson' ? 'cosine' : 'pearson')}
            className="border border-border-retro px-3 py-2 text-left font-medium uppercase tracking-[0.25em] text-text-main"
          >
            [ SIMILITUD: {algorithmLabels[algorithm]} ]
          </button>
        </div>
      </div>

      <div className="font-semibold uppercase tracking-[0.15em] text-text-muted">Estado</div>
      <div className="mt-3 border border-border-retro p-3 bg-bg-surface text-text-main">
        <div>Última actualización:</div>
        <div className="mt-2 text-text-muted">{metrics?.lastUpdatedAt ?? 'No disponible'}</div>
      </div>
    </div>
  )
}
