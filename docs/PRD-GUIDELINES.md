# PRD Guidelines — Zero

A Product Requirements Document (PRD) for Zero translates a feature idea into a concrete, testable, deployable plan that respects the project's multi-service architecture, payment routing invariants, and safeguard requirements.

## When to write a PRD

Write a PRD before starting any non-trivial change that touches:

- A new gRPC endpoint or proto message in `proto/zero/v1/`
- A new service or a new language in an existing service
- A new payment flow (escrow variant, new chain, new x402 target)
- A change to the Sentinel policy or safeguard layer
- A new external integration (new Ace API type, new RPC provider, new LLM)
- A new deployment target or infrastructure shape
- Gateway API surface changes (`POST/GET /v1/runs` morphology)

Trivial changes (bug fixes, log lines, README updates, env var renames) do not need a PRD.

---

## PRD Template

Copy this structure and fill each section.

### 1. Meta

```markdown
- **PRD**: SHORT-TITLE
- **Status**: draft | review | approved | in-progress | done
- **Phase**: (Fase 0–5, or "infra")
- **Bounty alignment**: General Payment Volume | Ace Data Cloud Usage | Both | Neither
- **Author**:
- **Date**:
```

### 2. Summary

One to two sentences. What are you building, and why?

> Example: *"Add a `/v1/agents` endpoint to the gateway that returns discovered SAP agents from the chain gRPC. Unblocks the Fase 5 landing dashboard."*

### 3. Problem / Motivation

- What user need or bounty requirement does this serve?
- What can't be done today without this change?
- Link to related GitHub issues or prior PRDs.

### 4. Architecture Impact

List every service and artifact touched:

| Component | Change |
|-----------|--------|
| `proto/zero/v1/` | New RPC / message / field |
| `services/chain` | New gRPC handler, new SAP instruction, etc. |
| `services/orchestrator` | New step type, new payment route, new client |
| `services/gateway` | New HTTP handler, middleware, run store field |
| `infra/spawn/` | Systemd unit change, bootstrap script change |
| `docs/` | Updated ARCHITECTURE.md, RUNBOOK.md, README |

If applicable, include a before/after data flow diagram.

### 5. Design

#### 5.1 Proto contract (if applicable)

New messages, enums, or RPCs. Show the relevant proto snippet.

#### 5.2 Data flow

```text
Gateway → orchestrator → chain gRPC → Solana RPC
```

Describe the happy path step-by-step, plus error paths.

#### 5.3 Error handling

- What errors can occur at each layer?
- How are errors surfaced to the caller (gRPC status codes, HTTP status codes)?
- Are there retries, timeouts, or circuit breakers?

#### 5.4 New environment variables

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|

Remember: every new env var must be added to `.env.example` and `services/orchestrator/src/config/env.ts`.

### 6. Payment Routing (if payment-related)

If the feature involves a payment, answer:

- **Escrow or x402?** What threshold decides the route?
- **Which chain / token?** (Solana USDC, Base USDC, other)
- **Which Ace endpoint?** (`api.acedata.cloud` or `platform.acedata.cloud`)
- **Who pays?** (agent keypair, user, platform wallet)
- **Settle condition?** What triggers escrow settlement?

### 7. Safeguards

Check each box or explain why it does not apply:

- [ ] Sentinel runs before payment / API call
- [ ] No mock/fake/stub in production source paths
- [ ] `runs.jsonl` remains append-only
- [ ] Hourly run budget enforced (loop mode)
- [ ] Organic jitter applied between steps
- [ ] Diversity check prevents identical back-to-back runs
- [ ] Prompt injection patterns updated in `validate.ts` (if new parseable input)
- [ ] `anti-mock.sh` passes

### 8. Test Plan

| Layer | Test type | Command |
|-------|-----------|---------|
| Rust chain | Unit + integration | `cargo test` |
| TS orchestrator | Unit (vitest) + typecheck | `pnpm run test`, `pnpm run typecheck` |
| Go gateway | Unit | `go test ./... -count=1` |
| End-to-end | Manual smoke | `make dev-up` + curl |
| CI | Verification | `make verified` |

Describe any new test cases to add and the expected behavior.

### 9. Deployment

- [ ] `infra/spawn/zero-worker.json` updated (if new env vars or ports)
- [ ] `infra/spawn/sh/hetzner/zero.sh` updated (if new deps or build steps)
- [ ] Systemd units updated (if new services)
- [ ] `make spawn-up` passes validation
- [ ] `Dockerfile` / `docker-compose.yml` updated (if new services or ports)

### 10. Success Criteria

- [ ] All tests pass (per-service + CI)
- [ ] `make verified` passes with at least one mainnet tx link in `VERIFIED.md` (if on-chain)
- [ ] Feature works end-to-end in local dev
- [ ] No regression in existing flows
- [ ] All new env vars documented in `.env.example`

---

## PRD Review Checklist

Before implementing, the author and at least one reviewer must confirm:

1. [ ] Architecture impact is fully enumerated (all 3 services checked)
2. [ ] Proto contract changes are backward-compatible (or `buf breaking` passes)
3. [ ] Payment routing decision is explicit (escrow vs x402, chain, token, settle trigger)
4. [ ] Sentinel gate is invoked before every Ace API call and on-chain transaction
5. [ ] All safeguard invariants are preserved
6. [ ] New env vars are Zod-validated (`config/env.ts`) and listed in `.env.example`
7. [ ] Test plan covers each service and the integration path
8. [ ] Deploy config is validated (`make spawn-up`)
9. [ ] `make verified` path is clear (which tx link goes in VERIFIED.md)

---

## Example: Fase 4 Gateway Dashboard PRD Skeleton

```markdown
## PRD: GATEWAY-DASHBOARD

- **Status**: draft
- **Phase**: Fase 4
- **Bounty alignment**: Neither (infra/demo)

### Summary
Add a `/v1/runs/{id}` HTML dashboard that renders run receipts from the gateway store.

### Architecture Impact
| Component | Change |
|-----------|--------|
| gateway | New `GET /v1/runs/{id}?format=html` handler |
| None | No proto, chain, or orchestrator changes |

### Safeguards
- [x] No mock/fake/stub (gateway is Go stdlib)
- [x] Hourly budget N/A (read-only endpoint)
- [x] Sentinel N/A (no AI or tx path)
```
