import { useMemo, useState } from 'react'
import { MovieCard } from './components/MovieCard'
import { RecommendationPanel } from './components/RecommendationPanel'
import { Stepper } from './components/Stepper'
import { Movie, RecommendationAlgorithm, RecommendationItem, Step } from './types/movie'
import { getRandomMovies } from './utils/random'
import { useMovieRatings } from './hooks/useMovieRatings'
import { useRecommendationFlow } from './hooks/useRecommendationFlow'

const STEP_LABELS: Record<Step, string> = {
  vote: 'Votación',
  results: 'Resultados',
}

export default function App() {
  const [step, setStep] = useState<Step>('vote')
  const [algorithm, setAlgorithm] = useState<RecommendationAlgorithm>('pearson')
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.65)

  const movies = useMemo<Movie[]>(() => getRandomMovies(20), [])
  const { ratings, ratedCount, rateMovie } = useMovieRatings()
  const recommendations = useRecommendationFlow({
    movies,
    ratings,
    algorithm,
    threshold: similarityThreshold,
    step,
  })

  const canProceed = ratedCount >= 5
  const votedMagnet = ratedCount > 0 ? `${ratedCount} / 20` : '0 / 20'

  const handlePrimaryAction = () => {
    if (step === 'vote' && canProceed) {
      setStep('results')
    }

    if (step === 'results') {
      setStep('vote')
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-8 p-6 lg:px-12">
        <header className="rounded-[2rem] border border-indigo-700/30 bg-slate-900/95 p-8 shadow-[0_32px_120px_rgba(99,102,241,0.12)]">
          <p className="text-sm uppercase tracking-[0.4em] text-indigo-300">MovieLens Recommender</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-50">Vota, compara y descubre películas</h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300">
            Paso 1: valora un conjunto de películas con estrellas. Paso 2: ajusta la similitud y revisa las recomendaciones que mejor se ajustan a tu perfil.
          </p>
        </header>

        <Stepper currentStep={step} labels={STEP_LABELS} />

        <main className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <section className="space-y-6 rounded-[2rem] border border-indigo-700/15 bg-slate-900/80 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-200">Estado de votación</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-100">{STEP_LABELS[step]}</h2>
              </div>
              <div className="rounded-3xl bg-indigo-600/15 px-4 py-3 text-sm font-semibold text-indigo-100">
                {votedMagnet} valoradas
              </div>
            </div>

            {step === 'vote' ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    rating={ratings[movie.id] ?? 0}
                    onRate={rateMovie}
                  />
                ))}
              </div>
            ) : (
              <RecommendationPanel
                algorithm={algorithm}
                similarityThreshold={similarityThreshold}
                recommendations={recommendations}
                onAlgorithmChange={setAlgorithm}
                onThresholdChange={setSimilarityThreshold}
              />
            )}

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-3xl bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={handlePrimaryAction}
                disabled={step === 'vote' && !canProceed}
              >
                {step === 'vote' ? 'Ir a resultados' : 'Volver a votar'}
              </button>
              <p className="text-sm text-slate-400">
                {step === 'vote'
                  ? 'Necesitas valorar al menos 5 películas para continuar.'
                  : 'Ajusta el algoritmo y los umbrales para ver recomendaciones distintas.'}
              </p>
            </div>
          </section>

          <aside className="space-y-6 rounded-[2rem] border border-indigo-700/15 bg-slate-900/85 p-6 shadow-[0_20px_80px_rgba(15,23,42,0.45)]">
            <div className="rounded-[1.75rem] bg-slate-950/75 p-6">
              <h2 className="text-xl font-semibold text-slate-50">Resumen rápido</h2>
              <p className="mt-3 text-slate-300">
                Esta interfaz te permite experimentar cómo cambia una recomendación según el perfil de usuario y el algoritmo elegido.
              </p>
              <ul className="mt-5 space-y-3 text-slate-300">
                <li>• Vota películas con estrellas para entrenar tu perfil.</li>
                <li>• Compara dos métricas de similitud: Pearson y Coseno.</li>
                <li>• Revisa recomendaciones ordenadas en un panel limpio.</li>
              </ul>
            </div>
            <div className="rounded-[1.75rem] bg-slate-950/75 p-6">
              <h3 className="text-lg font-semibold text-slate-100">Consejo</h3>
              <p className="mt-3 text-slate-300">
                Si buscas resultados más relevantes, prioriza 4 y 5 estrellas en las películas que realmente te gusten.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
