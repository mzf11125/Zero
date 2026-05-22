import type { Run } from '../lib/types'
import RunCard from './RunCard'

interface Props {
  runs: Run[]
  loading: boolean
  onRefresh: () => void
}

export default function RunHistory({ runs, loading, onRefresh }: Props) {
  const sorted = [...runs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-300">
          History ({runs.length})
        </h3>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs px-3 py-1 border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-gray-200 rounded transition-colors disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-600 italic">No runs yet. Create one above.</p>
      ) : (
        <div className="space-y-3">
          {sorted.map((run) => (
            <RunCard key={run.id} run={run} />
          ))}
        </div>
      )}
    </div>
  )
}
