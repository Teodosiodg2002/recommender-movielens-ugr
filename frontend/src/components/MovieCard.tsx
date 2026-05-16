import { useState } from 'react'
import { Star } from 'lucide-react'
import { Movie } from '../types/movie'

export interface MovieCardProps {
  movie: Movie
  rating: number
  onRate: (movieId: number, value: number) => void
}

export function MovieCard({ movie, rating, onRate }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleStarClick = (value: number) => {
    onRate(movie.id, value)
  }

  return (
    <article
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 p-5 transition duration-300 ${
        isHovered ? 'shadow-[0_28px_90px_rgba(99,102,241,0.18)]' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-indigo-300">Película</p>
          <h3 className="mt-3 text-lg font-semibold text-slate-100">{movie.title}</h3>
          <p className="mt-2 text-sm text-slate-400">{movie.genre} · {movie.year}</p>
        </div>
      </div>

      <div className="mb-5"> 
        <p className="text-sm font-semibold text-slate-200">Valora esta película</p>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 5 }, (_, index) => {
            const value = index + 1
            const isActive = value <= rating
            return (
              <button
                key={value}
                type="button"
                onClick={() => handleStarClick(value)}
                className={`rounded-2xl p-2 transition ${
                  isActive
                    ? 'bg-indigo-500 text-white shadow-lg'
                    : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-indigo-300'
                }`}
                aria-label={`Valorar ${value} estrella${value > 1 ? 's' : ''}`}
              >
                <Star className="h-5 w-5" />
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-[1.5rem] bg-slate-900/70 p-4 text-sm text-slate-300">
        <p className="font-medium text-slate-100">
          {rating > 0 ? `Tu valoración: ${rating} estrella${rating > 1 ? 's' : ''}` : 'Aún no has votado esta película.'}
        </p>
      </div>
    </article>
  )
}
