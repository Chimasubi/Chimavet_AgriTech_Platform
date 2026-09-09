'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Sprout, Droplets, ShoppingCart, Truck, TrendingUp, Wallet, Leaf, CheckCircle2, ArrowRight, Pencil, Sparkles, CalendarDays } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { OS_STAGES, getPhase, waterSchedule, costLedger, revenueModel, onionMarket, marketAdvice, pestAlerts, soilGuidance, yieldForecast } from '@/lib/farmData'
import { TSh } from '@/lib/data'
import { StageRail, SectionCard, Bar, Chip } from '@/components/FarmUI'

export default function FarmDashboard() {
  const { farm, set, phase, stageIndex } = useFarm()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(null)
  if (!farm) return null

  const water = waterSchedule(farm)
  const econ = revenueModel(farm)
  const m = onionMarket()
  const adv = marketAdvice(m.pricePerKg, m.changePct)
  const soil = soilGuidance(farm.soilTest)
  const alerts = pestAlerts(farm)
  const yieldProjection = yieldForecast(farm.farm.areaHa, farm.health)

  const done = farm.tasksDone?.[phase.key] || []
  const todo = phase.tasks.map((t, i) => ({ t, i })).filter(x => !done.includes(x.i))

  const toggleTask = (i) => {
    const list = farm.tasksDone?.[phase.key] || []
    const next = list.includes(i) ? list.filter(x => x !== i) : [...list, i]
    set({ tasksDone: { ...farm.tasksDone, [phase.key]: next } })
  }

  const saveFarm = (e) => {
    e.preventDefault()
    set({ farm: { ...form } })
    setEditing(false)
  }

  const phaseIdx = OS_STAGES.findIndex(s => s.key === 'crop')

  return (
    <>
      {/* Hero — farm identity & live status */}
      <section className="relative -mx-4 sm:-mx-6 -mt-6 mb-6 overflow-hidden rounded-b-3xl">
        <div className="hero-bg text-white px-4 sm:px-8 py-8 sm:py-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400 rounded-full blur-3xl opacity-20 -mr-16 -mt-16" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1 text-[11px] font-bold mb-3">
                <Sprout className="w-3.5 h-3.5 text-yellow-300" /> ONE FARM · ONE SYSTEM
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold mb-1">{farm.farm.name}</h1>
              <p className="text-emerald-50/90 text-sm">{farm.farm.farmer} · {farm.farm.region} · {farm.farm.areaHa} ha · {farm.farm.variety}</p>
            </div>
            <div className="flex items-center gap-2">
              <a onClick={() => window.dispatchEvent(new CustomEvent('chimavet-open-ai'))} className="px-4 py-2.5 bg-yellow-400 text-emerald-950 font-bold rounded-full shadow-lg shadow-yellow-500/30 hover:bg-yellow-300 transition text-sm cursor-pointer inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Ask ChimaAI
              </a>
              <button onClick={() => { setForm(farm.farm); setEditing(true) }} className="p-2.5 bg-white/10 border border-white/25 hover:bg-white/20 rounded-full transition" title="Edit farm">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold">Crop Phase</div>
              <div className="text-xl font-extrabold flex items-center gap-1.5">{phase.icon} {phase.label}</div>
              <div className="text-[11px] text-emerald-100">Day {phase.daysIn} of season</div>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold">Water this week</div>
              <div className="text-xl font-extrabold tabular-nums">{(water.weeklyLiters / 1000).toLocaleString()}k L</div>
              <div className="text-[11px] text-emerald-100">{water.minutesPerDay} min/day drip</div>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold">Market · {m.market}</div>
              <div className="text-xl font-extrabold tabular-nums">{m.pricePerKg.toLocaleString()} <span className="text-sm">TSh/kg</span></div>
              <div className={`text-[11px] font-semibold ${m.changePct >= 0 ? 'text-yellow-300' : 'text-red-300'}`}>{m.changePct >= 0 ? '▲' : '▼'} {Math.abs(m.changePct)}% vs last wk · {adv.verdict}</div>
            </div>
            <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl p-4">
              <div className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold">Projected Yield</div>
              <div className="text-xl font-extrabold tabular-nums">{(yieldProjection / 1000).toFixed(1)} <span className="text-sm">t</span></div>
              <div className="text-[11px] text-emerald-100">≈ {(econ.projectedRevenue).toLocaleString()} TSh revenue</div>
            </div>
          </div>
        </div>
      </section>

      {/* Connected lifecycle rail */}
      <section className="mb-6">
        <StageRail />
      </section>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        {/* Today's priorities — from crop plan */}
        <div className="lg:col-span-2">
          <SectionCard title="Today · Crop priorities" sub={`${phase.label} — ${phase.desc}`} className="h-full">
            {todo.length > 0 ? (
              <div className="space-y-2">
                {todo.slice(0, 5).map(({ t, i }) => (
                  <button key={i} onClick={() => toggleTask(i)} className="w-full flex items-start gap-3 p-3 rounded-xl border border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition text-left group">
                    <span className="mt-0.5 w-5 h-5 rounded-md border-2 border-stone-300 group-hover:border-emerald-500 shrink-0" />
                    <span className="text-sm text-stone-700">{t}</span>
                    <ArrowRight className="ml-auto w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition shrink-0 mt-0.5" />
                  </button>
                ))}
                <Link href="/farm/crop" className="block text-center text-xs font-semibold text-emerald-700 hover:text-emerald-900 pt-1">Open the full crop calendar →</Link>
              </div>
            ) : (
              <div className="text-center text-stone-500 text-sm py-6 flex flex-col items-center gap-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <p>All {phase.label} tasks ticked off — nice work! Ready to advance phases.</p>
              </div>
            )}

            {alerts.length > 0 && (
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800 mb-1.5">Crop health watch</div>
                {alerts.slice(0, 2).map((a, i) => (
                  <div key={i} className="text-xs text-amber-900 flex gap-2 py-1">
                    <Chip tone="amber">{a.pest}</Chip> <span className="flex-1">{a.action}</span>
                  </div>
                ))}
                <Link href="/farm/crop" className="text-xs font-semibold text-amber-800 underline underline-offset-2 hover:text-amber-950">Crop Doctor</Link>
              </div>
            )}
          </SectionCard>
        </div>

        {/* ChimaAI live briefing */}
        <SectionCard title="ChimaAI briefing" sub="Pulling live data from every stage" className="h-full">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-emerald-50 to-stone-50 border border-emerald-100 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-stone-600 leading-snug">
              <span className="font-bold text-stone-900">Soil pH {farm.soilTest.ph}</span> is optimal for onion. Water {water.minutesPerDay} min/day this week. Prices {m.changePct >= 0 ? 'rising' : 'softening'} → <span className="font-semibold">{adv.verdict}</span>.
            </div>
          </div>
          <ul className="space-y-2.5 text-sm">
            {[
              ['Spent to date', TSh(econ.costs.totalCost), 'text-emerald-700'],
              ['Projected profit', TSh(econ.projectedProfit), econ.projectedProfit >= 0 ? 'text-emerald-700' : 'text-red-600'],
              ['Break-even', `${econ.breakEvenKg.toLocaleString()} kg`, 'text-stone-700'],
              ['Market price', `${m.pricePerKg.toLocaleString()} TSh/kg (+${Math.abs(m.changePct)}%)`, 'text-stone-700']
            ].map(([k, v, tone]) => (
              <li key={k} className="flex items-center justify-between border-b border-stone-100 last:border-0 pb-2 last:pb-0">
                <span className="text-stone-500">{k}</span><span className={`font-bold ${tone}`}>{v}</span>
              </li>
            ))}
          </ul>
          <button onClick={() => window.dispatchEvent(new CustomEvent('chimavet-open-ai'))} className="mt-4 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition">
            Open ChimaAI chat
          </button>
        </SectionCard>
      </div>

      {/* Connected stage snapshot */}
      <section className="mb-6">
        <div className="flex items-end justify-between mb-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-1">The system in motion</div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Every stage feeds the next</h2>
            <p className="text-stone-600 text-sm mt-1">Soil informed your inputs · inputs set your watering · your crop drives market timing · it all lands in Economics.</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StageCard to="/farm/soil" icon={<Droplets className="w-5 h-5 text-blue-600" />} label="Soil Intelligence" value={soil.status === 'unknown' ? 'No test yet' : `pH ${farm.soilTest.ph} · ${soil.status}`} sub={soil.amendments.length ? `${soil.amendments.length} amendment${soil.amendments.length > 1 ? 's' : ''} recommended` : 'Soil on-target'} />
          <StageCard to="/farm/inputs" icon={<ShoppingCart className="w-5 h-5 text-amber-600" />} label="Inputs" value={`${TSh(farm.inputs.reduce((a, i) => a + i.qty * i.price, 0))} spent`} sub={`${farm.inputs.length} purchases logged`} />
          <StageCard to="/farm/irrigation" icon={<Droplets className="w-5 h-5 text-cyan-600" />} label="Irrigation" value={`${(water.weeklyLiters / 1000).toLocaleString()}k L / week`} sub={`Phase target ${water.weeklyMm}mm · ${water.minutesPerDay} min/day`} />
          <StageCard to="/farm/machinery" icon={<Truck className="w-5 h-5 text-emerald-700" />} label="Machinery" value={`${farm.bookings.length} booking${farm.bookings.length === 1 ? '' : 's'}`} sub={`${TSh(farm.bookings.reduce((a, b) => a + b.total, 0))} total`} />
          <StageCard to="/farm/crop" icon={<Leaf className="w-5 h-5 text-emerald-600" />} label="Production" value={`${phase.icon} ${phase.label} · day ${phase.daysIn}`} sub={`Projected ${(yieldProjection / 1000).toFixed(1)} t`} />
          <StageCard to="/farm/produce" icon={<TrendingUp className="w-5 h-5 text-emerald-600" />} label="Marketplace" value={`${m.pricePerKg.toLocaleString()} TSh/kg`} sub={`${m.market} · ${adv.verdict}`} />
        </div>
      </section>

      {/* Season timeline */}
      <section className="mb-8">
        <SectionCard title="Onion season timeline" sub={`${farm.farm.variety} · transplanted ${new Date(farm.farm.plantingDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}>
          <div className="space-y-3">
            {phase.completed.map(p => (
              <PhaseRow key={p.key} p={p} done />
            ))}
            {phase && <PhaseRow p={phase} active />}
            {phase && phase.upcoming.map(p => <PhaseRow key={p.key} p={p} />)}
          </div>
        </SectionCard>
      </section>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setEditing(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg">Edit farm</h3>
              <button onClick={() => setEditing(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500">✕</button>
            </div>
            <form onSubmit={saveFarm} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Farmer name</label>
                  <input value={form.farmer} onChange={e => setForm({ ...form, farmer: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Area (ha)</label>
                  <input type="number" step="0.05" min="0.05" value={form.areaHa} onChange={e => setForm({ ...form, areaHa: Number(e.target.value) })} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Region</label>
                <input value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Variety</label>
                  <input value={form.variety} onChange={e => setForm({ ...form, variety: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-stone-600 mb-1 block">Transplant date</label>
                  <input type="date" value={form.plantingDate} onChange={e => setForm({ ...form, plantingDate: e.target.value })} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition">Save changes</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

function StageCard({ to, icon, label, value, sub }) {
  return (
    <Link href={to} className="group bg-white rounded-2xl border border-stone-200 p-4 card-lift hover:border-emerald-300">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center">{icon}</div>
        <ArrowRight className="w-4 h-4 text-emerald-600 opacity-0 group-hover:opacity-100 transition" />
      </div>
      <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div>
      <div className="text-lg font-extrabold text-stone-900 tabular-nums">{value}</div>
      <div className="text-[11px] text-stone-500">{sub}</div>
    </Link>
  )
}

function PhaseRow({ p, done, active }) {
  const [show, setShow] = useState(false)
  const barPct = active ? p.pct : done ? 100 : 0
  return (
    <div className={`rounded-xl border p-3.5 transition ${active ? 'border-emerald-500 bg-emerald-50/50 shadow-sm' : done ? 'border-stone-200 bg-stone-50/60' : 'border-stone-200 bg-white'}`}>
      <button onClick={() => setShow(s => !s)} className="w-full flex items-center gap-3 text-left">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-base ${done ? 'bg-emerald-100' : active ? 'bg-emerald-600' : 'bg-stone-100'}`}>{done ? '✅' : p.icon}</span>
        <div className="flex-1 min-w-0">
          <div className={`font-bold text-sm ${active ? 'text-emerald-900' : done ? 'text-stone-500 line-through decoration-stone-300' : 'text-stone-500'}`}>{p.label}</div>
          <div className="flex items-center gap-2 mt-1">
            <Bar pct={barPct} className="h-1.5 w-full max-w-[180px]" color={active ? 'bg-emerald-600' : done ? 'bg-emerald-400' : 'bg-stone-200'} />
            <span className="text-[10px] text-stone-500 shrink-0">{p.daysLabel}</span>
          </div>
        </div>
        <span className="text-stone-400 text-xs">{active ? `${Math.round(p.pct)}%` : done ? 'Done' : 'Upcoming'}</span>
      </button>
      {show && <p className="text-xs text-stone-600 mt-2 pl-11 leading-relaxed">{p.desc}</p>}
    </div>
  )
}