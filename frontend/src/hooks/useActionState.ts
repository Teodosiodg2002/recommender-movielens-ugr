import { useCallback, useState } from 'react'

export type ActionStatus = 'idle' | 'pending' | 'success' | 'error'

export function useActionState<Args extends unknown[], Result>(action: (...args: Args) => Promise<Result>) {
  const [status, setStatus] = useState<ActionStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (...args: Args) => {
      setStatus('pending')
      setError(null)

      try {
        const result = await action(...args)
        setStatus('success')
        return result
      } catch (err) {
        setStatus('error')
        setError(err instanceof Error ? err.message : String(err))
        throw err
      }
    },
    [action],
  )

  return {
    status,
    error,
    run,
  }
}
