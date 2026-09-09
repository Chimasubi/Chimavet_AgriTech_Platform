'use client'
import { useState } from 'react'
import { Store, TrendingUp, TrendingDown, Minus, Truck, BadgeCheck, CheckCircle2, Trash2 } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { onionMarket, marketAdvice, yieldForecast, revenueModel } from '@/lib/farmData'
import { DRIVERS, TZ_MARKETS, TSh } from '@/lib/data'
import { PageHead, SectionCard, StatCard, Chip } from '@/components/FarmUI'

export default function ProducePage() {
  const { farm, set, phase } = useFarm()
  const [form, setForm] = useState(null)
  if (!farm) return null

  const m = onionMarket()
  const adv = marketAdvice(m.pricePerKg, m.changePct)
  const projectedKg = yieldForecast(farm.farm.areaHa, farm.health)
  const econ = revenueModel(farm)
  const packed = projectedKg && farm.produce.length ? farm.produce.filter(p => p.status === 'listed').reduce((a, p) => a + p.qtyKg, 0) : 0
  const soldKg = farm.sales.reduce((a, s) => a + s.qtyKg, 0)
  const remaining = Math.max(0, projectedKg - packed - soldKg)

  const ready = phase.key === 'harvest' || phase.key === 'maturity'

  const openForm = () => setForm({ qtyKg: Math.min(2500, remaining || 2000), pricePerKg: m.pricePerKg, market: m.market })

  const listProduce = (e) => {
    e.preventDefault()
    if (!form) return
    set({ produce: [...farm.produce, { id: Date.now(), qtyKg: Number(form.qtyKg), pricePerKg: Number(form.pricePerKg), market: form.market, status: 'listed', listedAt: new Date().toISOString().split('T')[0] }] })
    setForm(null)
  }

  const sell = (p) => {
    const revenue = p.qtyKg * p.pricePerKg
    set({ produce: farm.produce.map(x => x.id === p.id ? { ...x, status: 'sold', soldAt: new Date().toISOString().split('T')[0] } : x),
      sales: [...farm.sales, { id: Date.now(), produceId: p.id, qtyKg: p.qtyKg, pricePerKg: p.pricePerKg, revenue, date: new Date().toISOString().split('T')[0], buyer: 'Market buyer' }] })
  }

  const driver = DRIVERS.filter(d => d.capacityKg >= Math.max(...farm.produce.filter(p => p.status === 'listed').map(p => p.qtyKg), 0))[0]

  return (
    <>
      <PageHead icon={Store} bg="bg-gradient-to-br from-amber-500 to-orange-600" title="Produce Marketplace"
        sub="What the field produces meets who pays the most" />

      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="Projected harvest" big={`${(projectedKg / 1000).toFixed(1)} t`} sub={`${farm.farm.areaHa} ha onion`} tone="text-emerald-700" />
        <StatCard label="Listed" big={`${(packed / 1000).toFixed(1)} t`} sub={`${farm.produce.filter(p => p.status === 'listed').length} lot${farm.produce.filter(p => p.status === 'listed').length === 1 ? '' : 's'}`} tone="text-amber-700" />
        <StatCard label="Market price" big={`${m.pricePerKg.toLocaleString()}`} sub={`TSh/kg · ${m.market}`} tone={m.changePct >= 0 ? 'text-emerald-700' : 'text-red-600'} />
        <StatCard label="Sold" big={`${(soldKg / 1000).toFixed(1)} t`} sub={`${TSh(econ.salesRevenue)} earned`} tone="text-emerald-700" />
      </div>

      <div className={`mb-5 p-4 rounded-2xl flex items-center gap-3 ${ready ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ready ? 'bg-emerald-600' : 'bg-amber-500'}`}>
          {ready ? <CheckCircle2 className="w-5 h-5 text-white" /> : <TrendingUp className="w-5 h-5 text-white" />}
        </div>
        <p className="text-sm text-stone-700">
          {ready
            ? <>Harvest window open — <button onClick={openForm} className="font-bold text-emerald-800 underline underline-offset-2">list your first lot</button>. Onion {adv.verdict}: <b>{adv.msg}</b></>
            : <>You're in <b>{phase.label}</b> (day {phase.daysIn}). Lock in market timing now — <button onClick={openForm} className="font-bold text-amber-800 underline underline-offset-2">pre-list a lot</button> to secure buyers while price is {m.changePct >= 0 ? 'rising' : 'steady'}.</>}
        </p>
      </div>

      {form && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setForm(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2"><Store className="w-5 h-5 text-amber-600" /> List lot for sale</h3>
              <button onClick={() => setForm(null)} className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500">✕</button>
            </div>
            <form onSubmit={listProduce} className="p-5 space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Quantity (kg)</label>
                <input type="number" min="100" max={remaining} value={form.qtyKg} onChange={e => setForm({ ...form, qtyKg: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
                <div className="text-[11px] text-stone-400 mt-1">{remaining.toLocaleString()} kg still in the projected harvest</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Price (TSh/kg)</label>
                <input type="number" min="100" value={form.pricePerKg} onChange={e => setForm({ ...form, pricePerKg: Number(e.target.value) })} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Target market</label>
                <select value={form.market} onChange={e => setForm({ ...form, market: e.target.value })} className="w-full px-3 py-2.5 border border-stone-300 rounded-xl text-sm bg-white focus:outline-none focus:border-emerald-500">
                  {TZ_MARKETS.map(mk => <option key={mk}>{mk}</option>)}
                </select>
              </div>
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-sm flex items-center justify-between">
                <span className="text-stone-600">Lot value</span>
                <span className="font-extrabold text-emerald-700 tabular-nums">{TSh(form.qtyKg * form.pricePerKg)}</span>
              </div>
              <button type="submit" className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:shadow-lg hover:shadow-amber-500/30 text-white rounded-full text-sm font-semibold">List on marketplace</button>
            </form>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <SectionCard title="Your lots" sub={`${soldKg ? 'Sales so far:' : ''} ${soldKg ? ` ${soldKg.toLocaleString()} kg · ${TSh(econ.salesRevenue)}` : ''}`}>
            {farm.produce.length === 0 ? (
              <div className="text-center text-stone-500 text-sm py-10 flex flex-col items-center gap-2">
                <Store className="w-10 h-10 text-stone-300" />
                <p>No lot listed yet. When you list, it appears here — and the revenue lands in Economics.</p>
              </div>
            ) : (
              <ul className="space-y-2.5">
                {[...farm.produce].reverse().map(p => (
                  <li key={p.id} className="p-4 rounded-2xl border border-stone-200 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-2xl flex items-center justify-center shrink-0">🧅</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{p.qtyKg.toLocaleString()} kg <span className="text-stone-400">·</span> {p.market}</div>
                      <div className="text-xs text-stone-500">{TSh(p.pricePerKg)}/kg · {new Date(p.listedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-700 tabular-nums">{TSh(p.qtyKg * p.pricePerKg)}</div>
                      {p.status === 'listed'
                        ? <button onClick={() => sell(p)} className="mt-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold"><CheckCircle2 className="w-3 h-3 inline -mt-0.5 mr-1" />Mark sold</button>
                        : <Chip tone="emerald"><BadgeCheck className="w-3 h-3" /> sold</Chip>}
                    </div>
                    <button onClick={() => set({ produce: farm.produce.filter(x => x.id !== p.id) })} className="p-1.5 text-stone-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Best transport match" sub="Routed from your lot size">
            {farm.produce.filter(p => p.status === 'listed').length === 0 ? (
              <div className="text-center text-stone-500 text-sm py-6">List a lot to see the truck match.</div>
            ) : driver ? (
              <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200">
                <div className="flex items-center gap-3 mb-2">
                  <img src={driver.img} alt={driver.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <div className="font-bold text-sm">{driver.name}</div>
                    <div className="text-xs text-stone-500">{driver.vehicle} · {driver.capacityKg.toLocaleString()} kg</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-600 mb-3">
                  <span>Rate</span><span className="font-bold tabular-nums">{TSh(driver.ratePerKm)}/km</span>
                </div>
                <div className={`flex items-center gap-2 p-2.5 rounded-lg text-xs font-semibold ${driver.coldChain ? 'bg-blue-50 text-blue-800' : 'bg-emerald-50 text-emerald-800'}`}>
                  <Truck className="w-4 h-4" /> {farm.transport.length ? `Planned: ${farm.transport[0].pickup} → ${farm.transport[0].dest} (${farm.transport[0].km} km)` : 'Available for harvest day'}
                </div>
              </div>
            ) : (
              <div className="text-center text-stone-500 text-sm py-6">Lot too heavy for a single truck — split it.</div>
            )}
          </SectionCard>
          <div className="bg-violet-50 border border-violet-200 rounded-2xl p-4 text-xs text-violet-900">
            <strong>📈 Market Scout:</strong> {m.name} in {m.market} is <b>{adv.verdict}</b> — {adv.msg}<br /><br />
            Ask <b>ChimaAI</b> "bei" any time for the live onion price.
          </div>
        </div>
      </div>
    </>
  )
}