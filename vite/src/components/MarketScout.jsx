import { useState } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Search } from 'lucide-react'
import { getMarketPrices, getAdvice } from '../data/agents'
import { TSh } from '../data/catalog'

function Sparkline({ data, trend }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ')
  const color = trend === 'up' ? '#16a34a' : trend === 'down' ? '#dc2626' : '#78716c'
  return <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-10"><polyline fill="none" stroke={color} strokeWidth="2" points={pts} /></svg>
}

export default function MarketScout() {
  const [prices, setPrices] = useState(() => getMarketPrices())
  const [filter, setFilter] = useState('')
  const [advice, setAdvice] = useState(null)
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)
  const askAdvice = (id, q) => { setSelected(id); setAdvice(getAdvice(id, q)) }
  const refresh = () => setPrices(getMarketPrices())
  const filtered = prices.filter(p => !filter || p.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><TrendingUp className="w-7 h-7 text-emerald-600" /> Market Scout</h1>
          <p className="text-stone-600 text-sm">Live commodity prices & sell/hold recommendations</p>
        </div>
        <button onClick={refresh} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700"><RefreshCw className="w-4 h-4" /> Refresh</button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Search commodity..." className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="text-3xl">{p.emoji}</div>
                <div>
                  <div className="font-bold text-sm">{p.name}</div>
                  <div className="text-[10px] text-stone-500">{p.unit} · {p.market}</div>
                </div>
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                p.trend === 'up' ? 'bg-emerald-100 text-emerald-700' : p.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-stone-100 text-stone-600'}`}>
                {p.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : p.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {p.changePct > 0 ? '+' : ''}{p.changePct}%
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-700 mb-1">{TSh(p.current)}</div>
            <div className="text-xs text-stone-500 mb-3">Last week: {TSh(p.weekAgo)}</div>
            <Sparkline data={p.history} trend={p.trend} />
            <div className="mt-3 flex items-center gap-2">
              <input type="number" min="1" value={selected === p.id ? qty : 1} onChange={e => { setSelected(p.id); setQty(Number(e.target.value) || 1) }} className="w-16 px-2 py-1 border border-stone-300 rounded text-sm" />
              <button onClick={() => askAdvice(p.id, selected === p.id ? qty : 1)} className="flex-1 py-1.5 bg-emerald-600 text-white text-xs rounded-full hover:bg-emerald-700">Get Advice</button>
            </div>
          </div>
        ))}
      </div>

      {advice && (
        <div className={`bg-white rounded-2xl border-2 p-6 fade-in ${advice.action === 'sell' ? 'border-emerald-500' : advice.action === 'hold' ? 'border-amber-500' : 'border-stone-300'}`}>
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{advice.item.emoji}</div>
              <div>
                <div className="font-bold text-lg">{advice.item.name}</div>
                <div className="text-xs text-stone-500">Quantity: {qty} {advice.item.unit}s</div>
              </div>
            </div>
            <div className={`text-2xl font-black ${advice.action === 'sell' ? 'text-emerald-600' : advice.action === 'hold' ? 'text-amber-600' : 'text-stone-600'}`}>{advice.verdict}</div>
          </div>
          <p className="text-stone-700 mb-4">{advice.message}</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm">
            <div className="bg-stone-50 p-3 rounded-lg"><div className="text-xs text-stone-500">Current price</div><div className="font-bold">{TSh(advice.item.current)}</div></div>
            <div className="bg-stone-50 p-3 rounded-lg"><div className="text-xs text-stone-500">Est. revenue</div><div className="font-bold text-emerald-700">{TSh(advice.estimatedRevenue)}</div></div>
            <div className="bg-stone-50 p-3 rounded-lg"><div className="text-xs text-stone-500">Best market</div><div className="font-bold">{advice.item.market}</div></div>
          </div>
        </div>
      )}
    </>
  )
}
