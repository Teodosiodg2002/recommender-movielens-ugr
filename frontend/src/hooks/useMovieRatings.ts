import { useMemo, useState } from 'react'

export function useMovieRatings() {
  const [ratings, setRatings] = useState<Record<number, number>>({})

  const ratedCount = useMemo(() => Object.keys(ratings).length, [ratings])

  const rateMovie = (movieId: number, value: number) => {
    setRatings((current) => ({
      ...current,
      [movieId]: value,
    }))
  }

  return {
    ratings,
    ratedCount,
    rateMovie,
  }
}
