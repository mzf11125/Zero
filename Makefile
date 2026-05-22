.PHONY: proto-gen build-all build-chain build-orchestrator build-gateway build-landing test-gateway dev-up dev-landing spawn-up verified

PROTO_DIR := proto
CHAIN_DIR := services/chain
ORCH_DIR := services/orchestrator
GATEWAY_DIR := services/gateway
LANDING_DIR := services/landing

proto-gen:
	./scripts/gen-proto.sh

build-chain:
	cd $(CHAIN_DIR) && cargo build --release

build-orchestrator:
	cd $(ORCH_DIR) && pnpm install && pnpm run build

build-gateway:
	cd $(GATEWAY_DIR) && go build -o bin/gateway ./cmd/gateway

build-landing:
	cd $(LANDING_DIR) && pnpm install && pnpm run build

dev-landing:
	cd $(LANDING_DIR) && pnpm run dev

test-gateway:
	cd $(GATEWAY_DIR) && go test ./... -count=1

build-all: build-chain build-orchestrator build-gateway build-landing

dev-up:
	./scripts/dev-up.sh

spawn-up:
	@test -f infra/spawn/zero-worker.json
	@test -f infra/spawn/sh/hetzner/zero.sh
	@echo "Spawn config OK. Run: spawn zero hetzner --config infra/spawn/zero-worker.json --headless"

verified:
	@./scripts/check-verified.sh
