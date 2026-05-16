import { useMemo, useState } from 'react'
import type { RatingPayload, SimilarityAlgorithm } from '../types/api'
import { useActionState } from '../hooks/useActionState'

interface InteractionConsoleProps {
  algorithm: SimilarityAlgorithm
  userId: number
  onSubmitRating: (payload: RatingPayload) => Promise<void>
  ratingsCount: number
}

const ratingOptions = [1, 2, 3, 4, 5]

export function InteractionConsole({ algorithm, userId, onSubmitRating, ratingsCount }: InteractionConsoleProps) {
  const [movieId, setMovieId] = useState('')
  const [rating, setRating] = useState(5)

  const { status, error, run } = useActionState(async (payload: RatingPayload) => {
    await onSubmitRating(payload)
  })

  const canSubmit = movieId.trim().length > 0 && rating >= 1 && rating <= 5

  const displayStatus = useMemo(() => {
    if (status === 'pending') return '[ SENDING... ]'
    if (status === 'success') return '[ SENT ]'
    if (status === 'error') return '[ FAILED ]'
    return '[ READY ]'
  }, [status])

  const handleSubmit = async () => {
    if (!canSubmit) return

    await run({
      userId,
      movieId: movieId.trim(),
      rating,
    })
  }

  return (
    <div className="h-48 border-t border-border-retro bg-bg-surface p-4 text-sm text-text-main">
      <div className="flex items-center justify-between border-b border-border-retro pb-3 text-xs uppercase tracking-[0.25em] text-text-muted">
        <span>INTERACTION CONSOLE</span>
        <span className="text-glow-amber">{displayStatus}</span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs uppercase tracking-[0.25em] text-text-muted">
        <span>ALGORITMO: {algorithm.toUpperCase()}</span>
        <span>VALORACIONES LOCALES: {ratingsCount}</span>
      </div>

      <div className="mt-4 grid gap-3 text-text-main">
        <label className="flex flex-col gap-2">
          <span className="text-text-muted uppercase tracking-[0.2em]">ID de película / búsqueda</span>
          <input
            value={movieId}
            onChange={(event) => setMovieId(event.target.value)}
            placeholder="Escribir ID o titulo"
            className="terminal-input border border-border-retro bg-bg-main px-3 py-2 text-text-main outline-none"
          />
        </label>

        <div className="grid gap-2">
          <span className="text-text-muted uppercase tracking-[0.2em]">Valoración</span>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setRating(option)}
                className={`border border-border-retro px-3 py-2 uppercase tracking-[0.2em] ${
                  option === rating ? 'text-glow-green' : 'text-text-main'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || status === 'pending'}
            className="border border-border-retro px-4 py-2 uppercase tracking-[0.25em] text-text-main disabled:text-text-muted"
          >
            [ SUBMIT_RATING_TO_BACKEND ]
          </button>
          {error ? <span className="text-glow-amber">{error}</span> : null}
        </div>

        <div className="text-xs text-text-muted">Se envía la valoración a FastAPI para alimentar la recomendación colaborativa.</div>
      </div>
    </div>
  )
}
