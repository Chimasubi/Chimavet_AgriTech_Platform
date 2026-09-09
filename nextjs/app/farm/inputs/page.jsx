'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, PackagePlus, Trash2, BadgeCheck } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { buyList } from '@/lib/farmData'
import { PageHead, SectionCard, Chip } from '@/components/FarmUI'
import { TSh } from '@/lib/data'

const TYPE_TONE = { Seed: 'amber', Fertilizer: 'emerald', Protectant: 'red', Amendment: 'blue', Other: 'stone' }

export default function InputsPage() {
  const { farm, set, phase } = useFarm()
  const [added, setAdded] = useState({})
  if (!farm) return null

  const list = buyList(farm, phase.key)
  const spent = farm.inputs.reduce((a, i) => a + i.qty * i.price, 0)
  const alreadyOwn = (name) => farm.inputs.some(i => {
    const a = name.toLowerCase().split(' ').slice(0, 2).join(' ')
    const b = i.name.toLowerCase().split(' ').slice(0, 2).join(' ')
    return a.includes(b) || b.includes(a)
  })

  const buy = (item) => {
    set({ inputs: [...farm.inputs, {
      id: Date.now(), name: item.name, type: item.type,
      qty: item.qty, unit: item.unit, price: item.total, date: new Date().toISOString().split('T')[0], vendor: 'Chimaguli Agrovet'
    }] })
    setAdded({ [item.name]: true })
  }

  const remove = (id) => set({ inputs: farm.inputs.filter(i => i.id !== id) })

  return (
    <>
      <PageHead icon={ShoppingCart} bg="bg-gradient-to-br from-amber-400 to-orange-500" title="Inputs"
        sub={`Recommended baskets for your ${phase.label} onion stage`} />

      <p className="text-sm text-stone-600 mb-4">Computed from your soil test, {farm.farm.areaHa} ha field and current crop stage. What you buy here flows straight into <Link href="/farm/economics" className="font-semibold text-emerald-700 underline underline-offset-2">Farm Economics</Link>.</p>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SectionCard title="Needed now" sub={`${phase.key} phase — matching inputs first`}>
            <div className="space-y-3">
              {list.length === 0 && <p className="text-stone-500 text-sm py-6 text-center">Nothing to buy for this stage yet — check crop calendar.</p>}
              {list.map(it => (
                <div key={it.name} className={`p-4 rounded-2xl border transition ${added[it.name] ? 'border-emerald-300 bg-emerald-50/60' : 'border-stone-200'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-bold text-sm">{it.name}</div>
                      <div className="text-[11px] text-stone-500 mb-1">Applies at: {it.stage}{it.why ? ` · ${it.why}` : ''}</div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-stone-700">{it.qty} {it.unit}</span>
                        <Chip tone={added[it.name] ? 'emerald' : alreadyOwn(it.name) ? 'blue' : 'stone'}>{added[it.name] ? 'in your bin' : alreadyOwn(it.name) ? 'already owned' : 'recommended'}</Chip>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-extrabold text-emerald-700 tabular-nums">{TSh(it.total)}</div>
                      <button onClick={() => buy(it)} disabled={added[it.name]}
                        className={`mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition ${added[it.name] ? 'bg-emerald-100 text-emerald-700 cursor-default' : 'bg-stone-900 hover:bg-emerald-700 text-white'}`}>
                        {added[it.name] ? <><BadgeCheck className="w-3.5 h-3.5" /> Logged</> : <><PackagePlus className="w-3.5 h-3.5" /> Add to bin</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-4">
          <SectionCard title="Purchase ledger" sub={`${farm.inputs.length} items · feeds Economics`}>
            {farm.inputs.length === 0 ? (
              <div className="text-center text-stone-500 text-sm py-6">Nothing purchased yet.</div>
            ) : (
              <ul className="divide-y divide-stone-100">
                {[...farm.inputs].reverse().slice(0, 6).map(i => (
                  <li key={i.id} className="py-2.5 flex items-center gap-3">
                    <Chip tone={TYPE_TONE[i.type] || 'stone'}>{i.type}</Chip>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{i.name}</div>
                      <div className="text-[10px] text-stone-500">{i.qty} {i.unit} · {new Date(i.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    </div>
                    <span className="font-bold text-sm tabular-nums">{TSh(i.qty * i.price)}</span>
                    <button onClick={() => remove(i.id)} className="p-1 text-stone-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between mt-3">
              <span className="text-sm font-semibold">Total input spend</span>
              <span className="font-extrabold text-lg text-emerald-700">{TSh(spent)}</span>
            </div>
          </SectionCard>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900">
            <strong>🌿 Tip:</strong> open the <strong>ChimaAI</strong> chat and ask <em>"mbolea"</em> — it recites this exact plan from your soil test.
          </div>
        </div>
      </div>
    </>
  )
}