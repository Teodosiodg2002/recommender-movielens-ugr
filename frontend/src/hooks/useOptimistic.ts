import { useState, useCallback } from 'react'

export function useOptimistic<T extends { status: string; movieId: string }>(initial: T[]) {
  const [items, setItems] = useState<T[]>(initial)

  const addOptimistic = useCallback((item: T) => {
    setItems((current) => [item, ...current])
  }, [])

  const replaceStatus = useCallback((movieId: string, status: T['status']) => {
    setItems((current) =>
      current.map((item) =>
        item.movieId === movieId
          ? {
              ...item,
              status,
            }
          : item,
      ),
    )
  }, [])

  return {
    items,
    addOptimistic,
    replaceStatus,
  }
}
