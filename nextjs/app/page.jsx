'use client'
import Link from 'next/link'
import { Sparkles, ArrowRight, Leaf, TrendingUp, Mic, Droplets, Wallet, Store, Tractor, Sprout } from 'lucide-react'
import { PRODUCTS } from '@/lib/data'
import ProductCard from '@/components/ProductCard'

const PIPELINE = [
  { icon: Sprout, label: 'Farm & Plan',         desc: 'One farm, one crop, one plan',         href: '/farm', color: 'from-emerald-600 to-green-500' },
  { icon: Droplets, label: 'Soil Intelligence', desc: 'Test once — system plans from it',     href: '/farm/soil', color: 'from-blue-500 to-cyan-500' },
  { icon: Sparkles, label: 'ChimaAI',           desc: 'Context-aware advice on every stage',   href: null, color: 'from-violet-500 to-fuchsia-600' },
  { icon: Tractor, label: 'Inputs + Machinery', desc: 'Stage-matched buying & rental',         href: '/farm/inputs', color: 'from-amber-500 to-orange-600' },
  { icon: Leaf, label: 'Irrigation + Crop',     desc: 'Watered & grown by the crop calendar',  href: '/farm/irrigation', color: 'from-emerald-500 to-teal-600' },
  { icon: Store, label: 'Marketplace',          desc: 'List, sell, ship at the best price',    href: '/farm/produce', color: 'from-orange-500 to-red-500' },
  { icon: Wallet, label: 'Farm Economics',      desc: 'Every shilling accounted, live',        href: '/farm/economics', color: 'from-emerald-700 to-emerald-900' }
]

export default function Home() {
  const featured = PRODUCTS.filter(p => [13, 14, 1, 5].includes(p.id)).slice(0, 3)
  const agents = [
    { icon: Leaf, label: 'Crop Doctor', desc: 'Photo-based disease diagnosis', href: '/agents/crop-doctor', color: 'from-emerald-500 to-green-600' },
    { icon: TrendingUp, label: 'Market Scout', desc: 'Live prices & sell/hold advice', href: '/agents/market-scout', color: 'from-blue-500 to-indigo-600' },
    { icon: Mic, label: 'Voice AI', desc: 'Ongea kwa Kiswahili', href: '/agents/voice', color: 'from-violet-500 to-fuchsia-600' }
  ]
  return (
    <>
      <section className="relative -mt-6 -mx-4 mb-10 overflow-hidden rounded-3xl">
        <div className="hero-bg text-white px-4 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <span>Demo farm · Onion · Arusha 🇹🇿</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight mb-5 leading-[1.05]">
                One farm.<br /><span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">One operating system.</span>
              </h1>
              <p className="text-lg text-emerald-50/90 mb-8 max-w-xl leading-relaxed">
                Not seven disconnected tools. Soil → inputs → irrigation → machinery → crop → market → economics — <strong>feeding one ChimaAI</strong> that knows your farm at every stage.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/farm" className="px-7 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-emerald-950 font-bold rounded-full shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition inline-flex items-center gap-2">
                  <Sprout className="w-5 h-5" /> Open the Farm OS
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a onClick={() => window.dispatchEvent(new CustomEvent('chimavet-open-ai'))} href="#" className="px-7 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition inline-flex items-center gap-2">
                  <Sparkles className="w-5 h-5" /> Meet ChimaAI
                </a>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-emerald-50/80">
                <div><span className="font-bold text-white">9</span> connected stages</div>
                <div><span className="font-bold text-white">1</span> shared data model</div>
                <div><span className="font-bold text-white">24/7</span> context-aware AI</div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/30 to-emerald-400/30 rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1615485925600-97237c4fc1ec?auto=format&fit=crop&w=900&q=80" alt="Onion farm" className="relative rounded-3xl shadow-2xl w-full h-[480px] object-cover ring-4 ring-white/10" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Sprout className="w-6 h-6 text-emerald-700" /></div>
                <div>
                  <div className="text-xs text-stone-500">Current phase</div>
                  <div className="font-bold text-sm">🧅 Bulb formation · day 56</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Wallet className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <div className="text-xs text-stone-500">Projected profit</div>
                  <div className="font-bold text-sm tabular-nums">+8.2M <span className="text-emerald-600 text-xs">· 62% ROI</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-3">
            <Sprout className="w-3 h-3" /> The connected pipeline
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Data flows forward. It never restarts.</h2>
          <p className="text-stone-600 mt-2 max-w-2xl mx-auto">The soil test decides the fertiliser. The crop stage sets the irrigation. The irrigation feeds your cost ledger. Your yield sets your market price. It all comes home to ChimaAI.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PIPELINE.map((p, i) => {
            const inner = (
              <div className="group relative bg-white rounded-2xl border border-stone-200 p-5 h-full hover:border-emerald-300 hover:shadow-lg transition card-lift">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-lg`}>
                    <p.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-stone-300 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="font-extrabold text-stone-900">{p.label}</div>
                <div className="text-sm text-stone-500">{p.desc}</div>
              </div>
            )
            return p.href ? <Link key={p.label} href={p.href} className="h-full">{inner}</Link> : (
              <a key={p.label} href="#" onClick={(e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent('chimavet-open-ai')) }} className="h-full block">{inner}</a>
            )
          })}
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-2xl p-5 text-white flex flex-col justify-center card-lift">
            <div className="text-2xl font-extrabold mb-1">ChimaAI</div>
            <p className="text-sm text-emerald-200 mb-3">Reads every stage above — so every answer you get is about <em>your</em> onions, not generic text.</p>
            <button onClick={() => window.dispatchEvent(new CustomEvent('chimavet-open-ai'))} className="inline-flex items-center gap-2 text-yellow-300 font-semibold text-sm">Ask it yourself <ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-1">Chimaguli Agrovet</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Needed for the onion season</h2>
          </div>
          <Link href="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">Full catalog <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> Specialist AI agents
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">ChimaAI plus specialists</h2>
          <p className="text-stone-600 mt-2 max-w-2xl mx-auto">The core advisor knows your farm. Specialists dive deep on disease photos, prices and voice.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map(a => (
            <Link key={a.label} href={a.href} className="group relative rounded-3xl overflow-hidden h-56 text-left card-lift">
              <img src={'https://images.unsplash.com/photo-1585428311604-98738fc5687a?auto=format&fit=crop&w=600&q=80'} alt={a.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-2xl`}>
                    <a.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-violet-500/30 backdrop-blur border border-violet-300/30 text-violet-100 px-2.5 py-1 rounded-full">AI</span>
                </div>
                <div>
                  <div className="font-extrabold text-2xl mb-1">{a.label}</div>
                  <div className="text-sm text-stone-200 leading-relaxed">{a.desc}</div>
                  <div className="mt-3 text-xs font-semibold inline-flex items-center gap-1 text-yellow-300">Open <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-30 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20" />
        <div className="relative grid sm:grid-cols-4 gap-8 text-center">
          {[
            { num: '9', label: 'Connected stages' },
            { num: '1', label: 'Shared farm ledger' },
            { num: '24/7', label: 'Context-aware ChimaAI' },
            { num: '100%', label: 'Farmer-owned data' }
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl sm:text-5xl font-extrabold text-yellow-300 mb-2 tabular-nums">{s.num}</div>
              <div className="text-sm text-emerald-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}