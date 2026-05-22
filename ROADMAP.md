# Zero Roadmap

## Fase 0 — Scaffold (done)
- [x] `services/chain` — Rust gRPC server, Solana RPC integration, proto contract
- [x] `services/orchestrator` — TypeScript agent: planner (OpenRouter) + executor (Ace x402)
- [x] `services/gateway` — Go HTTP API: `POST/GET /v1/runs`
- [x] `proto/zero/v1/` — shared contract across all three services
- [x] Append-only `runs.jsonl` state, hourly budget enforcement, diversity checks

## Fase 1 — Core Agent Loop (done)
- [x] Worker one-shot + 24/7 loop mode
- [x] OpenRouter LLM planner integration
- [x] Ace Data Cloud x402 calls (chat, image, video — >=3 distinct APIs)
- [x] SAP escrow create/settle via Rust chain (Solana USDC)

## Fase 2 — Sentinel & Safeguards (done)
- [x] Two-layer content policy: Rust `sap::sentinel_check()` + TypeScript `validate.ts`
- [x] Prompt injection blocking, banned keywords, excessive length
- [x] Sentinel gate enforced before all payments and API calls
- [x] Anti-mock CI (`scripts/anti-mock.sh`)

## Fase 3 — Payment Routing (done)
- [x] Hybrid router: escrow vs x402 based on value threshold
- [x] Solana USDC for Ace API calls, Base USDC for platform order top-ups
- [x] SAP on-chain discovery and agent registration

## Fase 4 — Gateway Dashboard (done)
- [x] CORS middleware on Go gateway
- [x] `GET /v1/runs` list endpoint
- [x] Static file serving for production (serves built landing)
- [x] `services/landing` — React + Vite + Tailwind SPA
- [x] Public landing page explaining Zero
- [x] Dashboard: create runs, view status/history, polling
- [x] `make build-landing`, `make dev-landing` targets

## Fase 5 — Finesse (next)
- [ ] SAP `registerAgent` full instruction wiring in Rust (currently stub/discovery-only)
- [ ] Real-time run status via SSE or WebSocket (replace polling)
- [ ] Dashboard: tx explorer links, Ace response previews
- [ ] Dark/light theme toggle
- [ ] Mobile responsive pass
- [ ] `AGENTS.md` auto-generated docs link

## Fase 6 — Production Hardening (future)
- [ ] TLS termination on gateway
- [ ] Proper auth (OAuth / API key rotation)
- [ ] Database-backed run store (sqlite or postgres)
- [ ] Metrics and alerting (Prometheus + Grafana)
- [ ] CI/CD pipeline (GitHub Actions: test, build, deploy)
- [ ] Mainnet verification dashboard
- [ ] Bounty submission artifacts

## Fase 7 — Ecosystem (future)
- [ ] Public REST API docs (OpenAPI)
- [ ] SDK for third-party orchestrator plugins
- [ ] Multi-agent coordination (multiple workers, shared state)
- [ ] Ace Data Cloud service registry UI
- [ ] Community landing page with live stats
