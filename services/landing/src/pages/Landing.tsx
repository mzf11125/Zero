import { Link } from 'react-router-dom'

const features = [
  {
    title: 'Autonomous Planning',
    desc: 'OpenRouter-powered LLM plans multi-step Ace API workflows. No human in the loop — the agent decides what to call and how to pay.',
  },
  {
    title: 'Hybrid Payments',
    desc: 'Routes payments through SAP escrow (Solana USDC) for high-value jobs or x402 (HTTP 402 pay-per-request) for micro-transactions.',
  },
  {
    title: 'Sentinel Gate',
    desc: 'Two-layer content policy check before any API call or on-chain transaction. Blocks prompt injection, banned keywords, and excessive length.',
  },
  {
    title: 'Multi-API Orchestration',
    desc: 'Coordinates >=3 distinct Ace Data Cloud APIs (chat, image, video) in a single run. Service discovery via on-chain SAP registry.',
  },
  {
    title: 'Append-Only Audit',
    desc: 'Every run is recorded in an append-only JSONL log. Budget enforcement, diversity checks, and full traceability.',
  },
  {
    title: 'Deploy Anywhere',
    desc: 'Headless VM deployment via OpenRouter Spawn. Three services (Go gateway, TypeScript orchestrator, Rust chain) run as systemd units.',
  },
]

export default function Landing() {
  return (
    <div>
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-4">
          <span className="text-purple-400">Zero</span>
          <span className="text-gray-400"> — Autonomous Agent</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          An AI agent that autonomously discovers, pays for, and orchestrates
          Ace Data Cloud APIs using on-chain SAP escrow and x402 micro-payments on Solana.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Open Dashboard
            <span aria-hidden="true">&rarr;</span>
          </Link>
          <a
            href="https://github.com/nyokokarmanugroho/Zero"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 rounded-lg font-medium transition-colors"
          >
            GitHub
          </a>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-12 text-gray-200">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-12">
          {['Gateway\n(Go)', 'Orchestrator\n(TypeScript)', 'Chain\n(Rust)'].map((label, i) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-36 h-20 rounded-lg border border-gray-700 bg-gray-900 flex items-center justify-center text-sm text-gray-300 whitespace-pre text-center leading-tight">
                {label}
              </div>
              {i < 2 && (
                <div className="text-gray-600 text-lg md:rotate-0 rotate-90">&rarr;</div>
              )}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            ['Solana RPC', 'SAP escrow create/settle'],
            ['Ace Data Cloud', 'Chat, image, video APIs'],
            ['Ace Platform', 'Base USDC order top-ups'],
            ['OpenRouter', 'Planner LLM inference'],
            ['Sentinel', 'Content policy enforcement'],
            ['JSONL Store', 'Append-only run history'],
          ].map(([name, desc]) => (
            <div key={name} className="border border-gray-800 rounded-lg p-4 bg-gray-900/50">
              <div className="font-medium text-sm text-purple-400">{name}</div>
              <div className="text-xs text-gray-500 mt-1">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-gray-800">
        <h2 className="text-2xl font-semibold text-center mb-12 text-gray-200">Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="border border-gray-800 rounded-lg p-5 bg-gray-900/50">
              <h3 className="font-medium text-gray-200 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
