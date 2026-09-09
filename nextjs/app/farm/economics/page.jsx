'use client'
import { useState } from 'react'
import { Wallet, TrendingUp, PiggyBank, Scale, Receipt } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { revenueModel, onionMarket, marketAdvice } from '@/lib/farmData'
import { PageHead, SectionCard, StatCard, Bar, Chip } from '@/components/FarmUI'
import { TSh } from '@/lib/data'

const CAT_COLOR = { Inputs: 'bg-emerald-500', Machinery: 'bg-amber-500', Transport: 'bg-orange-500', Water: 'bg-blue-500', Labour: 'bg-violet-500', Other: 'bg-stone-400' }
const CAT_ICON = { Inputs: '🛒', Machinery: '🚜', Transport: '🚛', Water: '💧', Labour: '👷', Other: '🧾' }

export default function EconomicsPage() {
  const { farm, phase } = useFarm()
  const [showAll, setShowAll] = useState(false)
  if (!farm) return null

  const e = revenueModel(farm)
  const m = onionMarket()
  const adv = marketAdvice(m.pricePerKg, m.changePct)
  const cats = Object.keys(CAT_COLOR).map(c => e.costs[c])
  const maxCat = Math.max(1, ...cats)

  const rows = [
    ...farm.inputs.map(i => ({ id: 'i' + i.id, icon: '🛒', date: i.date, label: i.name, cat: 'Inputs', amount: i.qty * i.price, sell: false })),
    ...farm.bookings.map(b => ({ id: 'b' + b.id, icon: '🚜', date: b.startDate, label: `Rent · ${b.name}`, cat: 'Machinery', amount: b.total, sell: false })),
    ...farm.transport.filter(t => t.status === 'booked').map(t => ({ id: 't' + t.id, icon: '🚛', date: t.date, label: `Transport · ${t.commodity}`, cat: 'Transport', amount: t.total, sell: false })),
    ...farm.miscCost.map(mc => ({ id: 'm' + mc.id, icon: CAT_ICON[mc.category] || '🧾', date: mc.date, label: mc.name, cat: mc.category || 'Other', amount: mc.cost, sell: false })),
    ...farm.cropLog.filter(l => l.cost).map(l => ({ id: 'c' + l.id, icon: '👷', date: l.date, label: l.action, cat: 'Labour', amount: l.cost, sell: false })),
    ...farm.sales.map((s, i) => ({ id: 's' + s.id + i, icon: '🏪', date: s.date, label: `Sold onions ${s.qtyKg.toLocaleString()} kg @ ${TSh(s.pricePerKg)}/kg`, cat: 'Revenue', amount: s.revenue, sell: true }))
  ].sort((a, b) => b.date.localeCompare(a.date))

  const shown = showAll ? rows : rows.slice(0, 8)

  return (
    <>
      <PageHead icon={Wallet} bg="bg-gradient-to-br from-emerald-700 to-emerald-900" title="Farm Economics"
        sub="Every input, drop of water, rental day and sale — accounted for one ledger" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatCard label="Cost to date" big={TSh(e.costs.totalCost)} sub="Whole season so far" tone="text-stone-900" />
        <StatCard label="Projected revenue" big={TSh(e.projectedRevenue)} sub={`${(e.projectedKg / 1000).toFixed(1)} t @ ${m.pricePerKg.toLocaleString()}/kg`} tone="text-emerald-700" />
        <StatCard label="Projected profit" big={TSh(e.projectedProfit)} sub={`${e.marginPct}% margin`} tone={e.projectedProfit >= 0 ? 'text-emerald-700' : 'text-red-600'} icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} />
        <StatCard label="Cost per kg" big={TSh(e.costPerKg)} sub={`vs market ${TSh(m.pricePerKg)}/kg`} tone="text-stone-900" icon={<Scale className="w-4 h-4 text-stone-400" />} />
        <StatCard label="Break-even" big={`${e.breakEvenKg.toLocaleString()} kg`} sub={e.breakEvenKg < e.projectedKg ? `${Math.round((e.breakEvenKg / e.projectedKg) * 100)}% of crop sold` : 'above projection'} tone="text-amber-700" icon={<PiggyBank className="w-4 h-4 text-amber-500" />} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <SectionCard title="Where the money went" sub={`${phase.label} · every category measured against the season total`}>
          <div className="space-y-3">
            {Object.entries(CAT_COLOR).map(([cat, color]) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-stone-600">{CAT_ICON[cat]} {cat}</span>
                  <span className="font-bold tabular-nums">{TSh(e.costs[cat])}</span>
                </div>
                <Bar pct={(e.costs[cat] / maxCat) * 100} color={color} className="h-2" />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between">
            <span className="font-semibold">Total cost</span>
            <span className="font-extrabold text-lg">{TSh(e.costs.totalCost)}</span>
          </div>
        </SectionCard>

        <SectionCard title="Profit bridge" sub="From harvest to wallet — using today's market">
          <div className="space-y-4">
            {[
              { l: 'Projected harvest', v: `${(e.projectedKg / 1000).toFixed(1)} t`, tone: 'text-stone-900' },
              { l: `Price (${m.market})`, v: `${TSh(m.pricePerKg)}/kg · ${adv.verdict}`, tone: m.changePct >= 0 ? 'text-emerald-700' : 'text-red-600' },
              { l: 'Revenue at current price', v: TSh(e.projectedRevenue), tone: 'text-emerald-700' },
              { l: 'Season cost', v: `− ${TSh(e.costs.totalCost)}`, tone: 'text-red-600' },
              { l: 'Cost per kg', v: TSh(e.costPerKg), tone: 'text-stone-600' }
            ].map((r, i) => (
              <div key={i} className={`flex items-center justify-between text-sm py-2 ${i === 3 ? 'border-t border-stone-100' : ''}`}>
                <span className="text-stone-600">{r.l}</span><span className={`font-bold ${r.tone}`}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-2xl border-2 ${e.projectedProfit >= 0 ? 'border-emerald-400 bg-emerald-50' : 'border-red-400 bg-red-50'}`}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1">Projected season profit</div>
            <div className={`text-3xl font-black tabular-nums ${e.projectedProfit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{TSh(e.projectedProfit)}</div>
            <div className="text-xs text-stone-500 mt-1">ROI {Math.round((e.projectedProfit / Math.max(1, e.costs.totalCost)) * 100)}% on season spend · {e.marginPct}% margin</div>
          </div>
          <p className="text-[11px] text-stone-500 mt-3 flex items-start gap-1.5">
            <Receipt className="w-3.5 h-3.5 mt-0.5 shrink-0" /> Economics, Irrigation, Inputs, Machinery and Marketplace all write into the same ledger — no double entry.
          </p>
        </SectionCard>
      </div>

      <SectionCard title="Season ledger" sub="All transactions touching your farm, newest first">
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-widest text-stone-500 border-b border-stone-200">
                <th className="pb-2 pr-3">Date</th><th className="pb-2 pr-3">Item</th><th className="pb-2 pr-3">Category</th><th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {shown.map(r => (
                <tr key={r.id}>
                  <td className="py-2.5 pr-3 text-stone-500 whitespace-nowrap">{new Date(r.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                  <td className="py-2.5 pr-3 font-medium">{r.icon} {r.label}</td>
                  <td className="py-2.5 pr-3">{r.sell ? <Chip tone="emerald">Revenue</Chip> : <Chip tone={r.cat === 'Machinery' ? 'blue' : r.cat === 'Water' ? 'blue' : 'stone'}>{r.cat}</Chip>}</td>
                  <td className={`py-2.5 text-right font-bold tabular-nums ${r.sell ? 'text-emerald-700' : 'text-stone-700'}`}>{r.sell ? '+' : '−'}{TSh(r.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length > 8 && (
          <button onClick={() => setShowAll(s => !s)} className="mt-3 text-xs font-semibold text-emerald-700 hover:text-emerald-900">
            {showAll ? 'Show fewer' : `Show all ${rows.length} entries`}
          </button>
        )}
      </SectionCard>

      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900">
        <strong>🧠 What ChimaAI sees:</strong> it reads this ledger live — ask <em>"fedha"</em> or <em>"profit"</em> in the chat for a spoken summary of where every shilling went and what the season is worth.
      </div>
    </>
  )
}