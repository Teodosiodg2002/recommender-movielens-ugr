import type { SimilarityAlgorithm } from '../types/api'

interface TopbarProps {
  userId: number
  algorithm: SimilarityAlgorithm
  onUserChange: (nextUserId: number) => void
}

const userIds = [101, 205, 305, 405, 512]

export function Topbar({ userId, algorithm, onUserChange }: TopbarProps) {
  return (
    <div className="h-12 flex items-center justify-between border-b border-border-retro px-4 text-sm text-text-main">
      <div className="font-semibold uppercase tracking-[0.25em]">[ SYSTEM: MOVIELENS_v1.0 ]</div>

      <div className="flex items-center gap-3 text-text-muted">
        <span>CONNECTED_TO_FASTAPI_API:</span>
        <span className="flex items-center gap-2 font-medium text-glow-green">
          <span className="h-2 w-2 rounded-none bg-glow-green" /> OK
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-text-muted">[ USER_ID:</span>
        <select
          value={userId}
          onChange={(event) => onUserChange(Number(event.target.value))}
          className="bg-bg-main border border-border-retro px-2 py-1 text-text-main outline-none appearance-none"
        >
          {userIds.map((id) => (
            <option key={id} value={id} className="bg-bg-main text-text-main">
              {id}
            </option>
          ))}
        </select>
        <span className="text-text-muted">▼ ]</span>
      </div>
    </div>
  )
}
