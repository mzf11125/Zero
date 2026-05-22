import type { Run } from '../lib/types'

const statusColors: Record<string, string> = {
  pending: 'bg-gray-600',
  running: 'bg-amber-500 animate-pulse',
  succeeded: 'bg-teal-500',
  failed: 'bg-red-500',
}

function ago(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export default function RunCard({ run }: { run: Run }) {
  return (
    <div className="border border-gray-800 rounded-lg p-4 bg-gray-900/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColors[run.status] ?? 'bg-gray-600'}`} />
          <span className="text-sm font-medium text-gray-200">{run.status}</span>
          {run.route && (
            <span className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded">{run.route}</span>
          )}
        </div>
        <span className="text-xs text-gray-600 font-mono">{run.id.slice(0, 8)}</span>
      </div>

      <p className="text-sm text-gray-300">{run.query}</p>

      {run.txSignatures.length > 0 && (
        <div className="text-xs text-gray-500">
          <span className="text-gray-600">Txs: </span>
          {run.txSignatures.map((sig, i) => (
            <span key={sig} className="font-mono text-teal-500">
              {sig.slice(0, 8)}...{i < run.txSignatures.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      )}

      {run.aceServiceIds.length > 0 && (
        <div className="text-xs text-gray-500">
          <span className="text-gray-600">Ace APIs: </span>
          {run.aceServiceIds.join(', ')}
        </div>
      )}

      {run.errorMessage && (
        <p className="text-xs text-red-400 bg-red-950/30 rounded px-2 py-1">{run.errorMessage}</p>
      )}

      <div className="text-xs text-gray-600">{ago(run.updatedAt)}</div>
    </div>
  )
}
