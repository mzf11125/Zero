import type { Run, CreateRunRequest } from './types'

function apiKey(): string {
  return localStorage.getItem('zero-api-key') ?? ''
}

function headers(): HeadersInit {
  const h: Record<string, string> = { 'Content-Type': 'application/json' }
  const key = apiKey()
  if (key) h['X-API-Key'] = key
  return h
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { ...headers(), ...init?.headers } })
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText)
    throw new Error(`${res.status}: ${text}`)
  }
  return res.json()
}

export async function createRun(req: CreateRunRequest): Promise<Run> {
  return fetchJSON<Run>('/v1/runs', {
    method: 'POST',
    body: JSON.stringify(req),
  })
}

export async function getRun(id: string): Promise<Run> {
  return fetchJSON<Run>(`/v1/runs/${encodeURIComponent(id)}`)
}

export async function listRuns(): Promise<Run[]> {
  return fetchJSON<Run[]>('/v1/runs')
}

export async function healthCheck(): Promise<{ status: string; service: string }> {
  const res = await fetch('/health')
  return res.json()
}
