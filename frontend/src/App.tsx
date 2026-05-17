import { useState } from 'react'
import { Topbar } from './components/Topbar'
import { useMovieRecommendations } from './hooks/useMovieRecommendations'
import type { SimilarityAlgorithm } from './types/api'

export default function App() {
  const [userId, setUserId] = useState<number>(101)
  const [algorithm, setAlgorithm] = useState<SimilarityAlgorithm>('pearson')

  const {
    movies,
    recommendations,
    metrics,
    loading,
    error,
    refresh,
    rateMovie,
  } = useMovieRecommendations(userId, algorithm)

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Topbar
        userId={userId}
        algorithm={algorithm}
        onUserChange={setUserId}
        onAlgorithmChange={setAlgorithm}
        onRefresh={refresh}
      />

      <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1320px] flex-col gap-6 px-4 py-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]">
            <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.32em] text-slate-300">
              Películas para puntuar
            </h2>
            <p className="mb-5 text-sm text-slate-400">
              Clasifica 20 títulos aleatorios y deja que el sistema calcule tu vecindario.
            </p>
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                {loading ? (
                  <div className="text-sm text-slate-400">Cargando películas...</div>
                ) : error ? (
                  <div className="text-sm text-rose-400">{error}</div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {movies.map((movie) => (
                      <div key={movie.movieId} className="rounded-2xl border border-slate-800 bg-slate-900 p-4">
                        <div className="mb-2 text-sm font-semibold text-slate-100">{movie.title}</div>
                        <div className="mb-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                          {movie.year} · {movie.genre}
                        </div>
                        <div className="grid gap-2 sm:grid-cols-5">
                          {[1, 2, 3, 4, 5].map((value) => (
                            <button
                              key={value}
                              type="button"
                              onClick={() => rateMovie(movie.movieId, value)}
                              className="rounded-xl border border-slate-800 bg-slate-950 px-2 py-2 text-sm text-slate-200 transition hover:border-slate-500 hover:text-white"
                            >
                              {value}★
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]">
              <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.32em] text-slate-300">
                Recomendaciones principales
              </h2>
              <div className="space-y-3">
                {loading ? (
                  <div className="text-sm text-slate-400">Generando recomendaciones...</div>
                ) : error ? (
                  <div className="text-sm text-rose-400">{error}</div>
                ) : recommendations.length === 0 ? (
                  <div className="text-sm text-slate-400">No hay recomendaciones de 4 o 5 estrellas por ahora.</div>
                ) : (
                  <div className="space-y-3">
                    {recommendations.map((movie) => (
                      <div key={movie.movieId} className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="font-semibold text-slate-100">{movie.title}</div>
                            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
                              {movie.year} · {movie.genre}
                            </div>
                          </div>
                          <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                            {movie.predictedRating.toFixed(1)}★
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-[0_0_0_1px_rgba(148,163,184,0.12)]">
              <h2 className="mb-4 text-base font-semibold uppercase tracking-[0.32em] text-slate-300">
                Métricas del modelo
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">RMSE</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-100">{metrics?.rmse.toFixed(2) ?? '--'}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">MAE</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-100">{metrics?.mae.toFixed(2) ?? '--'}</div>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 sm:col-span-2">
                  <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Última actualización</div>
                  <div className="mt-2 text-sm text-slate-300">{metrics?.lastUpdatedAt ?? 'No disponible'}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
