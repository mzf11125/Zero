import { useState } from 'react'
import type { JobType } from '../lib/types'
import { createRun } from '../lib/api'

interface Props {
  onRunCreated: () => void
}

export default function RunForm({ onRunCreated }: Props) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<JobType>('ace-research')
  const [value, setValue] = useState(0.001)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSubmitting(true)
    setError('')
    try {
      await createRun({ query: query.trim(), type, estimatedValueUsd: value })
      setQuery('')
      onRunCreated()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-gray-800 rounded-lg p-5 bg-gray-900/50 space-y-4">
      <h3 className="text-sm font-medium text-gray-300">New Run</h3>
      <div>
        <label className="block text-xs text-gray-500 mb-1">Query</label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What should Zero do?"
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-purple-600 resize-none"
          required
        />
      </div>
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-xs text-gray-500 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as JobType)}
            className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-600"
          >
            <option value="ace-research">Ace Research</option>
            <option value="ace-demo">Ace Demo</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">Est. Value (USD)</label>
          <input
            type="number"
            min={0}
            max={10}
            step={0.001}
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            className="w-28 bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 focus:outline-none focus:border-purple-600"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={submitting || !query.trim()}
            className="px-5 py-1.5 bg-purple-700 hover:bg-purple-600 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded text-sm font-medium transition-colors"
          >
            {submitting ? 'Submitting...' : 'Run'}
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </form>
  )
}
