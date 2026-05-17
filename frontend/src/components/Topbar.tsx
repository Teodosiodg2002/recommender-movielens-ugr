import type { SimilarityAlgorithm } from '../types/api'

interface TopbarProps {
  userId: number
  algorithm: SimilarityAlgorithm
  onUserChange: (nextUserId: number) => void
  onAlgorithmChange: (next: SimilarityAlgorithm) => void
  onRefresh: () => void
}

export function Topbar({ userId, algorithm, onUserChange, onAlgorithmChange, onRefresh }: TopbarProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-950/90 px-4 py-3 shadow-sm shadow-slate-950/10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 text-sm text-slate-200">
        <div>
          <div className="text-xs uppercase tracking-[0.35em] text-slate-500">MovieLens Recommender</div>
          <div className="mt-1 text-lg font-semibold text-white">Filtrado colaborativo para 100k valoraciones</div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100">
            Usuario ID
            <input
              type="number"
              min="1"
              max="9999"
              value={userId}
              onChange={(event) => {
                const val = Number(event.target.value);
                if (val > 0) onUserChange(val);
              }}
              className="w-16 bg-transparent text-slate-100 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-center font-semibold"
            />
          </label>

          <label className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900 px-3 py-2 text-slate-100">
            Algoritmo
            <select
              value={algorithm}
              onChange={(event) => onAlgorithmChange(event.target.value as SimilarityAlgorithm)}
              className="bg-transparent text-slate-100 outline-none"
            >
              <option value="pearson">Pearson</option>
              <option value="cosine">Cosine</option>
            </select>
          </label>

          <button
            type="button"
            onClick={onRefresh}
            className="rounded-2xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
          >
            Refrescar datos
          </button>
        </div>
      </div>
    </header>
  )
}
