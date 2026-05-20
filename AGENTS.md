# AGENTS.md — Zero

## What is Zero

Zero is an autonomous agent built for the [OOBE x Ace Data Cloud bounty](https://superteam.fun/earn/listing/autonomous-agent-bounty-oobe-ace-data-cloud). It competes in **both** categories:

- **General Payment Volume** — SAP escrow create/settle on Solana mainnet via `services/chain` (Rust gRPC).
- **Ace Data Cloud Usage** — >=3 distinct Ace APIs (chat, image, video) paid with **x402** protocol. Hybrid routing: Solana USDC for Ace API calls, Base USDC for platform order top-ups.

## Architecture

```
gateway (Go, :8080)  →  orchestrator (TS, agent logic)  →  chain (Rust, :50051 gRPC)
                         ├── OpenRouter (planner LLM)
                         ├── Ace Data Cloud (x402: chat, image, video)
                         ├── Ace Platform (Base USDC x402 orders)
                         └── Solana RPC (SAP escrow, discovery)
```

| Service | Language | Port | Role |
|---------|----------|------|------|
| `services/chain` | Rust | gRPC :50051 | SAP discovery, Sentinel checks, escrow create/settle |
| `services/orchestrator` | TypeScript (ESM, Node 22) | — | Planner (OpenRouter) + Executor (Ace x402) + HybridPaymentRouter |
| `services/gateway` | Go 1.22 | HTTP :8080 | Demo API: `POST/GET /v1/runs`, auth, rate limiting |

Shared contract: `proto/zero/v1/run.proto` defines the `ChainService` gRPC definition used by all three services.

## Build and dev commands

```bash
# Generate proto stubs for all 3 languages
make proto-gen

# Build everything
make build-all
# or per-service:
make build-chain          # cargo build --release
make build-orchestrator   # pnpm install && pnpm run build
make build-gateway        # go build -o bin/gateway ./cmd/gateway

# Local dev (starts chain + orchestrator)
make dev-up

# One-shot worker
cd services/orchestrator && pnpm run worker

# 24/7 loop
WORKER_LOOP=true pnpm run worker

# Gateway (with API key)
GATEWAY_API_KEY=secret go run ./cmd/gateway

# Pay an Ace platform order (Base USDC x402)
cd services/orchestrator && pnpm run pay-ace-order
```

## Testing

```bash
make test-gateway           # go test ./... -count=1

# Chain (Rust)
cd services/chain && cargo test

# Orchestrator (TypeScript)
cd services/orchestrator && pnpm run test        # vitest (if configured)
cd services/orchestrator && pnpm run typecheck   # tsc --noEmit

# CI checks
make verified               # Fail if VERIFIED.md has no explorer links
```

## Code conventions

### Rust (`services/chain`)

- Framework: **tonic** for gRPC, **tokio** async runtime, **tracing** for logging.
- Error handling: `ChainError` enum in `src/error.rs` with `.into()` conversion to `tonic::Status`.
- gRPC server: `src/grpc/server.rs` (`ChainGrpc` struct implementing generated `ChainService` trait).
- Proto compilation: `build.rs` using `tonic-build`; generated code lands in `src/grpc/mod.rs`.
- Solana: `solana-client` and `solana-sdk` for RPC and instruction building.
- Config: `src/config.rs` reads env vars (`SYNAPSE_RPC_URL`, `SOLANA_KEYPAIR_PATH`, etc.).

### TypeScript (`services/orchestrator`)

- Module system: **ESM** (`"type": "module"` in package.json). Node 22+.
- Proto loading: **`@grpc/proto-loader`** (dynamic, not static codegen). Proto paths resolved relative to `proto/`.
- Validation: **Zod** for all env vars and input validation (`config/env.ts`, `agent/validate.ts`).
- Key packages: `@solana/web3.js`, `ethers` (EVM wallet for Base USDC), `openai` (OpenRouter), `@grpc/grpc-js`.
- State: Append-only JSONL (`state/runsStore.ts`) — never overwrite, always append.
- Entrypoint: `src/entrypoints/worker.ts` — supports one-shot and loop mode (`WORKER_LOOP=true`).

### Go (`services/gateway`)

- Stdlib-only HTTP server (no frameworks). `net/http` with functional middleware pattern.
- Middleware: `WithAPIKey`, `WithRateLimit` (per-IP token bucket).
- Dependency injection: `WorkerTrigger` function type injected into `CreateRunHandler` for testability.
- Package layout: `cmd/gateway/main.go` entry, `internal/server/` for HTTP, `internal/runs/` for store.
- Testing: `internal/server/*_test.go` using `net/http/httptest`.

### Proto contract

- Live at `proto/zero/v1/`. `run.proto` defines the `ChainService` gRPC service.
- **Before changing a proto**, regenerate stubs: `make proto-gen` (runs `scripts/gen-proto.sh`).
- Rust: uses `tonic-build` (build.rs). TypeScript: dynamic loading via `@grpc/proto-loader`. Go: uses `buf generate`.
- Buf config: `buf.yaml` (lint/breaking) and `buf.gen.yaml` (Go codegen).

## Key design patterns

### Planner-Executor
The orchestrator separates **planning** (`agent/planner.ts`, uses OpenRouter LLM to decide Ace steps) from **execution** (`agent/executor.ts`, carries out steps with payment routing).

### Hybrid Payment Router
`payments/hybridRouter.ts` chooses **escrow** (SAP on-chain create/settle) vs **x402** (HTTP 402 pay-per-request) based on estimated value threshold.

### Sentinel Gate
Two-layer content policy check:
1. Rust chain `sap::sentinel_check()` — blocks prompt injection, banned keywords, excessive length.
2. TypeScript `agent/validate.ts` — Zod schemas + prompt injection patterns.

Sentinel must **pass before payment routing** (invariant).

### Append-only state
`state/runsStore.ts` writes to `STATE_DIR/runs.jsonl`. Never overwrites rows. Enables:
- Diversity check: blocks identical back-to-back runs.
- Hourly budget enforcement: `runBudget.ts` caps runs per hour.

### Dependency injection (Go)
Gateway handlers receive a `WorkerTrigger` function type; tests inject a no-op to avoid spawning real subprocesses.

## Environment variables (canonical)

Defined in `services/orchestrator/src/config/env.ts` (Zod-validated). Key vars:

| Variable | Required | Purpose |
|----------|----------|---------|
| `SYNAPSE_RPC_URL` | Yes | Solana RPC endpoint |
| `SOLANA_KEYPAIR_PATH` | Yes | Path to agent keypair JSON |
| `ACEDATA_API_KEY` | Yes | Ace Data Cloud API key |
| `OPENROUTER_API_KEY` | No | OpenRouter API key (planner LLM) |
| `PLANNER_ENABLED` | No | Set `false` to skip planner LLM |
| `GATEWAY_API_KEY` | No | API key for gateway auth |
| `GATEWAY_RATE_LIMIT_RPM` | No | Gateway rate limit (default 30) |
| `WORKER_LOOP` | No | Set `true` for 24/7 loop |
| `WORKER_MAX_RUNS_PER_HOUR` | No | Cap loop spend (default 60) |
| `STATE_DIR` | No | Directory for `runs.jsonl` |
| `CHAIN_GRPC_URL` | No | gRPC endpoint for chain (default `localhost:50051`) |

`.env.example` is the template; `.env.local` is gitignored.

## Source of truth

- Architecture: `docs/ARCHITECTURE.md`
- Runbook: `docs/RUNBOOK.md` (local dev, deployment, security, safeguards)
- Deploy: `docs/SPAWN.md` (headless VM via OpenRouter Spawn)
- PRD template: `docs/PRD-GUIDELINES.md`
- Verified runs: `docs/VERIFIED.md` (must contain mainnet tx links before README claims are trusted)
- Mainnet verification CI: `scripts/check-verified.sh`
- Anti-mock CI: `scripts/anti-mock.sh` (no mock/fake/stub in production source)

## Safeguards checklist

When adding or changing behavior, verify:
- [ ] Sentinel check runs before any Ace API call or on-chain transaction
- [ ] No mock/fake/stub in production source paths (`scripts/anti-mock.sh`)
- [ ] `runs.jsonl` append-only (no overwrites)
- [ ] Hourly run budget enforced in loop mode
- [ ] All new env vars added to `.env.example` and `config/env.ts`
- [ ] Proto regeneration after any `.proto` change (`make proto-gen`)
- [ ] `make verified` passes after mainnet deployment (tx links in `VERIFIED.md`)

## Deploy

Headless VM via [OpenRouterTeam/spawn](https://github.com/OpenRouterTeam/spawn):

```bash
spawn zero hetzner --config infra/spawn/zero-worker.json --headless --fast
```

Bootstrap script at `infra/spawn/sh/hetzner/zero.sh` builds services and installs systemd units for `zero-chain` and `zero-orchestrator`.

Validate config before deploy: `make spawn-up`.
