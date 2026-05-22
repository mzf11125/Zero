import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Code2, Zap, Shield, Cpu, BarChart3, Cloud, Layers } from 'lucide-react'
import StaggeredText from '@/components/react-bits/staggered-text'

const SilkWaves = lazy(() => import('@/components/react-bits/silk-waves'))
const AuroraBlur = lazy(() => import('@/components/react-bits/aurora-blur'))

const features = [
  {
    icon: Cpu,
    title: 'Autonomous Planning',
    desc: 'OpenRouter-powered LLM plans multi-step Ace API workflows. No human in the loop, the agent decides what to call and how to pay.',
  },
  {
    icon: Zap,
    title: 'Hybrid Payments',
    desc: 'Routes payments through SAP escrow (Solana USDC) for high-value jobs or x402 micro-payments for every API request.',
  },
  {
    icon: Shield,
    title: 'Sentinel Gate',
    desc: 'Two-layer content policy check before any API call or on-chain transaction. Blocks prompt injection and banned keywords.',
  },
  {
    icon: Layers,
    title: 'Multi-API Orchestration',
    desc: 'Coordinates 3+ distinct Ace Data Cloud APIs (chat, image, video) in a single run. On-chain SAP service discovery.',
  },
  {
    icon: BarChart3,
    title: 'Append-Only Audit',
    desc: 'Every run is recorded in an append-only JSONL log. Budget enforcement, diversity checks, and full traceability.',
  },
  {
    icon: Cloud,
    title: 'Deploy Anywhere',
    desc: 'Headless VM deployment via OpenRouter Spawn. Three services run as systemd units on any cloud provider.',
  },
]

const ecosystem = [
  ['Solana RPC', 'SAP escrow create/settle on mainnet'],
  ['Ace Data Cloud', 'Chat, image, video APIs via x402'],
  ['Ace Platform', 'Base USDC order top-ups'],
  ['OpenRouter', 'Planner LLM inference'],
  ['Sentinel', 'Content policy enforcement'],
  ['JSONL Store', 'Append-only run history'],
]

function FeatureCard({ icon: Icon, title, desc, index }: { icon: typeof Cpu; title: string; desc: string; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-64px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-sm hover:border-purple-500/30 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-2.5 ring-1 ring-purple-500/20">
        <Icon className="h-5 w-5 text-purple-400" />
      </div>
      <h3 className="mb-2 font-semibold text-gray-100">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-400">{desc}</p>
    </motion.div>
  )
}

function WavesBackground() {
  return (
    <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
      <SilkWaves
        speed={1.2}
        scale={2.5}
        distortion={0.7}
        curve={1.1}
        contrast={1.1}
        brightness={0.6}
        opacity={0.5}
        complexity={1.3}
        frequency={1.1}
        rotation={15}
        colors={[
          '#0a0020',
          '#0f0030',
          '#1a0040',
          '#2d0a5e',
          '#4a1a8a',
          '#6b2fb0',
          '#8b4fd4',
          '#a770f0',
        ]}
        className="absolute inset-0"
      />
    </Suspense>
  )
}

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
        {/* SilkWaves background */}
        <div className="absolute inset-0">
          <WavesBackground />
        </div>

        {/* Gradient overlays for depth */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6">
            <StaggeredText
              text="Zero: Autonomous Agent"
              as="h1"
              segmentBy="words"
              delay={80}
              duration={0.5}
              staggerDirection="forward"
              className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
            />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-gray-400"
          >
            An autonomous AI agent that discovers, pays, and orchestrates Ace Data Cloud APIs
            using on-chain SAP escrow and x402 micro-payments on Solana.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-600/20 transition-all hover:bg-purple-500 hover:shadow-purple-500/30"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="https://github.com/mzf11125/Zero"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 text-sm font-medium text-gray-300 backdrop-blur-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.06]"
            >
              <Code2 className="h-4 w-4" />
              GitHub
            </a>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* Architecture / How It Works */}
      <section className="relative border-t border-white/[0.04] bg-black">
        <Suspense fallback={null}>
          <AuroraBlur
            speed={0.8}
            layers={[
              { color: '#6b2fb0', speed: 0.3, intensity: 0.2 },
              { color: '#4a1a8a', speed: 0.15, intensity: 0.15 },
            ]}
            className="absolute inset-0 opacity-40"
          />
        </Suspense>
        <div className="relative mx-auto max-w-5xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Architecture
            </h2>
            <p className="text-gray-500">Three services, one agent. Built for autonomous operation.</p>
          </motion.div>

          <div className="mb-16 flex flex-col items-center justify-center gap-4 md:flex-row">
            {[
              { name: 'Gateway', sub: 'Go · HTTP API', color: 'border-cyan-500/30 bg-cyan-500/[0.04] text-cyan-400' },
              { name: 'Orchestrator', sub: 'TypeScript · Planner', color: 'border-purple-500/30 bg-purple-500/[0.04] text-purple-400' },
              { name: 'Chain', sub: 'Rust · gRPC & Solana', color: 'border-teal-500/30 bg-teal-500/[0.04] text-teal-400' },
            ].map(({ name, sub, color }, i) => (
              <div key={name} className="flex items-center gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`flex h-24 w-44 flex-col items-center justify-center rounded-xl border ${color}`}
                >
                  <div className="text-lg font-semibold">{name}</div>
                  <div className="text-xs opacity-60">{sub}</div>
                </motion.div>
                {i < 2 && (
                  <ArrowRight className="hidden h-5 w-5 text-gray-600 md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map(([name, desc]) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-lg border border-white/[0.04] bg-white/[0.01] p-4 backdrop-blur-sm"
              >
                <div className="font-medium text-sm text-purple-400">{name}</div>
                <div className="text-xs text-gray-500 mt-1">{desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative border-t border-white/[0.04] bg-black">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Features
            </h2>
            <p className="text-gray-500">Everything needed for autonomous, accountable AI agent operations.</p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <FeatureCard key={f.title} {...f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-white/[0.04] bg-black">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-4xl">
              Ready to see it in action?
            </h2>
            <p className="mb-8 text-gray-500">
              Open the dashboard to create autonomous agent runs powered by Ace Data Cloud and Solana.
            </p>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-600/25 transition-all hover:bg-purple-500"
            >
              Launch Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
