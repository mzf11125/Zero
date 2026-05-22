export type RunStatus = 'pending' | 'running' | 'succeeded' | 'failed'
export type JobType = 'ace-research' | 'ace-demo'

export interface Run {
  id: string
  status: RunStatus
  type: JobType
  query: string
  route: string
  txSignatures: string[]
  aceServiceIds: string[]
  errorMessage: string
  createdAt: string
  updatedAt: string
}

export interface CreateRunRequest {
  query: string
  type: JobType
  estimatedValueUsd: number
}
