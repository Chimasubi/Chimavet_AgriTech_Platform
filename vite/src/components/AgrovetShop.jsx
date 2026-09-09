import { useState, useMemo } from 'react'
import { ShoppingBag, ShoppingCart, Search } from 'lucide-react'
import { PRODUCTS, CATEGORIES, TSh } from '../data/catalog'
import { useStore } from '../data/store.jsx'

export default function AgrovetShop() {
  const { addToCart, cart } = useStore()
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const filtered = useMemo(() => PRODUCTS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (q === '' || p.name.toLowerCase().includes(q.toLowerCase()))
  ), [cat, q])
  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><ShoppingBag className="w-7 h-7 text-amber-600" /> Chimaguli Agrovet</h1>
          <p className="text-stone-600 text-sm">Quality farm inputs, delivered across Tanzania</p>
        </div>
        <div className="text-sm text-stone-600 flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" /> {cart.reduce((a,b)=>a+b.qty,0)} in cart
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Tafuta bidhaa..." className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${cat === c ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="group bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden hover:shadow-md transition">
            <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
              <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              {p.badge && <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full shadow">{p.badge}</span>}
              {p.oldPrice && <span className="absolute top-3 right-3 text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow">-{Math.round((1 - p.price/p.oldPrice)*100)}%</span>}
            </div>
            <div className="p-4">
              <div className="text-xs text-emerald-700 font-semibold mb-1">{p.category}</div>
              <h3 className="font-bold mb-1">{p.name}</h3>
              <p className="text-sm text-stone-600 mb-2 line-clamp-2">{p.desc}</p>
              <div className="text-xs text-stone-500 mb-3">In stock: {p.stock}</div>
              <div className="flex items-center justify-between">
                <div>
                  {p.oldPrice && <div className="text-xs text-stone-400 line-through tabular-nums">{TSh(p.oldPrice)}</div>}
                  <div className="font-bold text-emerald-700 text-lg tabular-nums">{TSh(p.price)}</div>
                </div>
                <button onClick={() => addToCart(p.id, PRODUCTS)} className="px-4 py-2 bg-stone-900 hover:bg-emerald-700 text-white text-sm rounded-full transition">Ongeza</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="col-span-full text-center text-stone-500 py-10">Hakuna bidhaa zinazolingana.</div>}
      </div>
    </>
  )
}
