# Zero Architecture

Zero is an autonomous agent for the OOBE × Ace Data Cloud bounty: SAP mainnet registration, hybrid payments (x402 + escrow), Sentinel checks, and Ace service discovery.

## Services

| Service | Path | Role |
|---------|------|------|
| **chain** | `services/chain` (Rust) | gRPC server `:50051` — SAP discovery, Sentinel, escrow txs |
| **orchestrator** | `services/orchestrator` (TypeScript) | Planner (OpenRouter) + executor (Ace x402) + `hybridRouter.ts` |
| **gateway** | `services/gateway` (Go) | HTTP API `:8080` — `POST/GET /v1/runs`, CORS, static serving |
| **landing** | `services/landing` (React + Vite) | SPA dashboard + public landing page |

Fase 0–3: orchestrator calls chain directly. Gateway + landing introduced in Fase 4.

## Flow

```text
Browser (landing) → Gateway (:8080) → Orchestrator (worker.ts)
  Orchestrator → Planner (OpenRouter) → Executor → hybridRouter
    → gRPC Sentinel + discovery + escrow (Rust)
    → Ace x402 (chat, image, video)
    → runs.jsonl state
```

## Deploy

Headless VM via [OpenRouter Spawn](https://github.com/OpenRouterTeam/spawn): see [SPAWN.md](./SPAWN.md).
