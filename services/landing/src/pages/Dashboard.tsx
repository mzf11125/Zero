import { useState, useEffect, useCallback } from 'react'
import type { Run } from '../lib/types'
import { listRuns } from '../lib/api'
import ApiKeyInput from '../components/ApiKeyInput'
import RunForm from '../components/RunForm'
import RunHistory from '../components/RunHistory'

export default function Dashboard() {
  const [runs, setRuns] = useState<Run[]>([])
  const [loading, setLoading] = useState(false)
  const [apiKeyReady, setApiKeyReady] = useState(false)

  const fetchRuns = useCallback(async () => {
    setLoading(true)
    try {
      const data = await listRuns()
      setRuns(data)
    } catch {
      // server may be down
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (apiKeyReady) fetchRuns()
  }, [apiKeyReady, fetchRuns])

  // Poll every 5 seconds for status updates
  useEffect(() => {
    if (!apiKeyReady) return
    const interval = setInterval(fetchRuns, 5000)
    return () => clearInterval(interval)
  }, [apiKeyReady, fetchRuns])

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-100">Dashboard</h2>
        <ApiKeyInput onKeySet={(key) => setApiKeyReady(key.length > 0)} />
      </div>

      {!apiKeyReady && (
        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-4 text-sm text-amber-400">
          Set your API key above to interact with Zero.
        </div>
      )}

      {apiKeyReady && (
        <>
          <RunForm onRunCreated={fetchRuns} />
          <RunHistory runs={runs} loading={loading} onRefresh={fetchRuns} />
        </>
      )}
    </div>
  )
}
