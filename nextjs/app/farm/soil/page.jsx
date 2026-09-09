'use client'
import { useState } from 'react'
import { FlaskConical, Beaker, SlidersHorizontal, CheckCircle2, Info } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { soilGuidance, fertilizerPlan } from '@/lib/farmData'
import { PageHead, SectionCard, StatCard, Chip } from '@/components/FarmUI'
import { TSh } from '@/lib/data'

const statusTone = { optimal: 'text-emerald-600', low: 'text-amber-700', high: 'text-red-600', notest: 'text-stone-400' }
const statusBar = { optimal: 'bg-emerald-500', low: 'bg-amber-500', high: 'bg-red-500', notest: 'bg-stone-200' }

function rangePct(v, r) {
  if (v == null) return 0
  const lo = r.min * 0.7, hi = r.max * 1.2
  return Math.min(100, Math.max(0, ((v - lo) / (hi - lo)) * 100))
}

export default function SoilPage() {
  const { farm, set } = useFarm()
  const [edit, setEdit] = useState(false)
  if (!farm) return null

  const guidance = soilGuidance(farm.soilTest)
  const plan = fertilizerPlan(farm.soilTest, farm.farm.areaHa)
  const soil = farm.soilTest

  const save = (e) => {
    e.preventDefault()
    const f = new FormData(e.target)
    set({ soilTest: {
      ...soil,
      done: true,
      ph: Number(f.get('ph')), N: Number(f.get('n')), P: Number(f.get('p')), K: Number(f.get('k')), OM: Number(f.get('om')),
      testedAt: f.get('date'), lab: f.get('lab')
    } })
    setEdit(false)
  }

  return (
    <>
      <PageHead icon={FlaskConical} bg="bg-gradient-to-br from-blue-500 to-cyan-500" title="Soil Intelligence"
        sub="Test once · the whole system plans from it" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard label="pH" big={`${soil.ph ?? '—'}`} sub="Target 5.8–6.8" tone={statusTone[guidance.nutrients.find(n => n.key === 'ph')?.status]} />
        <StatCard label="Nitrogen" big={`${soil.N ?? '—'}%`} sub="Target 0.16–0.30%" tone={statusTone[guidance.nutrients.find(n => n.key === 'N')?.status]} />
        <StatCard label="Phosphorus" big={`${soil.P ?? '—'} ppm`} sub="Target 15–40 ppm" tone={statusTone[guidance.nutrients.find(n => n.key === 'P')?.status]} />
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SectionCard title="Soil test result" sub={soil.testedAt ? `Tested ${new Date(soil.testedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · ${soil.lab}` : 'No soil test yet'}>
            <button onClick={() => setEdit(true)} className="text-xs font-semibold text-emerald-700 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 mb-4">✎ Record / update soil test</button>
            <div className="space-y-4">
              {guidance.nutrients.map(n => (
                <div key={n.key}>
                  <div className="flex items-baseline justify-between text-sm mb-1">
                    <span className="font-semibold text-stone-700">{n.label}</span>
                    <span className={`text-xs font-bold ${statusTone[n.status]}`}>
                      {n.value ?? 'not tested'} · {n.status === 'optimal' ? 'Optimal for onion' : n.status === 'low' ? 'Below target' : n.status === 'high' ? 'Above target' : '—'}
                    </span>
                  </div>
                  <div className="relative h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div className="absolute inset-y-0 left-[28%] right-[36%] border-x-2 border-white bg-emerald-100" title="target band" />
                    <div className={`h-full rounded-full ${statusBar[n.status]}`} style={{ width: `${rangePct(n.value, n.range)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-stone-500 mt-4 flex items-start gap-1.5"><Info className="w-3.5 h-3.5 mt-0.5 shrink-0" /> The green band is the target window for onions. Values outside it feed directly into your fertiliser plan below.</p>
          </SectionCard>
        </div>

        <SectionCard title="Amendments" sub="What the soil asked for" className="h-full">
          {guidance.amendments.length === 0 ? (
            <div className="text-center text-stone-500 text-sm py-8 flex flex-col items-center gap-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              <p>No amendments needed — soil is near target.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {guidance.amendments.map(a => (
                <div key={a.name} className="p-3 rounded-xl border border-amber-200 bg-amber-50/60">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm">{a.name}</span>
                    <Chip tone="amber">{a.amountKg.toLocaleString()} kg</Chip>
                  </div>
                  <p className="text-xs text-stone-600">{a.note}</p>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <SectionCard title="Season fertiliser plan" sub={`Calculated for ${farm.farm.areaHa} ha from soil + crop stage`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-200">
                <th className="pb-2 pr-3">Input</th><th className="pb-2 pr-3">Apply at</th><th className="pb-2 pr-3">Amount</th><th className="pb-2 pr-3 text-right">Est. cost</th><th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {plan.map(r => {
                const owned = farm.inputs.some(i => r.name.split(' ').slice(0, 2).join(' ').toLowerCase().includes(i.name.split(' ').slice(0, 2).join(' ').toLowerCase()))
                return (
                  <tr key={r.name}>
                    <td className="py-3 pr-3 font-semibold">{r.name}</td>
                    <td className="py-3 pr-3 text-stone-500">{r.stage}</td>
                    <td className="py-3 pr-3 tabular-nums">{r.amount} {r.unit}</td>
                    <td className="py-3 pr-3 text-right tabular-nums font-semibold">{TSh(r.total)}</td>
                    <td className="py-3 text-right">{owned ? <Chip tone="emerald">in bin</Chip> : <Chip tone="stone">to buy</Chip>}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
          <span className="text-sm text-stone-600">Total fertiliser budget</span>
          <span className="font-extrabold text-emerald-700 text-lg">{TSh(plan.reduce((a, r) => a + r.total, 0))}</span>
        </div>
      </SectionCard>

      {edit && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setEdit(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2"><Beaker className="w-5 h-5 text-blue-600" /> Soil test entry</h3>
              <button onClick={() => setEdit(false)} className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-500">✕</button>
            </div>
            <form onSubmit={save} className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">pH</label><input name="ph" type="number" step="0.1" defaultValue={soil.ph} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Nitrogen (%)</label><input name="n" type="number" step="0.01" defaultValue={soil.N} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Phosphorus (ppm)</label><input name="p" type="number" defaultValue={soil.P} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Potassium (ppm)</label><input name="k" type="number" defaultValue={soil.K} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Organic matter (%)</label><input name="om" type="number" step="0.1" defaultValue={soil.OM} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
                <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Test date</label><input name="date" type="date" defaultValue={soil.testedAt} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
              </div>
              <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Lab</label><input name="lab" type="text" defaultValue={soil.lab} className="w-full px-3 py-2 border border-stone-300 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition flex items-center justify-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Apply test — repaint the plan</button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}