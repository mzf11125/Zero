import { useState, useEffect } from 'react'

interface Props {
  onKeySet: (key: string) => void
}

export default function ApiKeyInput({ onKeySet }: Props) {
  const [key, setKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = localStorage.getItem('zero-api-key')
    if (existing) {
      setKey(existing)
      setSaved(true)
      onKeySet(existing)
    }
  }, [onKeySet])

  function handleSave() {
    const trimmed = key.trim()
    if (!trimmed) return
    localStorage.setItem('zero-api-key', trimmed)
    setSaved(true)
    onKeySet(trimmed)
  }

  function handleClear() {
    localStorage.removeItem('zero-api-key')
    setKey('')
    setSaved(false)
    onKeySet('')
  }

  return (
    <div className="flex items-center gap-3">
      <input
        type="password"
        value={key}
        onChange={(e) => { setKey(e.target.value); setSaved(false) }}
        placeholder="API key"
        className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm text-gray-200 w-48 focus:outline-none focus:border-purple-600"
      />
      {!saved ? (
        <button
          onClick={handleSave}
          className="text-xs px-3 py-1.5 bg-purple-700 hover:bg-purple-600 text-white rounded transition-colors"
        >
          Set Key
        </button>
      ) : (
        <button
          onClick={handleClear}
          className="text-xs px-3 py-1.5 border border-gray-600 hover:border-red-500 text-gray-400 hover:text-red-400 rounded transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
