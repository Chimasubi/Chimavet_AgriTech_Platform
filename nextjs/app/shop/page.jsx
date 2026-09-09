'use client'
import { useState, useMemo } from 'react'
import { ShoppingBag, Search } from 'lucide-react'
import { PRODUCTS, CATEGORIES } from '@/lib/data'
import ProductCard from '@/components/ProductCard'

export default function ShopPage() {
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const filtered = useMemo(() => PRODUCTS.filter(p =>
    (cat === 'All' || p.category === cat) && (q === '' || p.name.toLowerCase().includes(q.toLowerCase()))
  ), [cat, q])
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><ShoppingBag className="w-7 h-7 text-amber-600" /> Chimaguli Agrovet</h1>
        <p className="text-stone-600 text-sm">Quality farm inputs, delivered to your door</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${cat === c ? 'bg-emerald-600 text-white' : 'bg-white border border-stone-300 text-stone-600 hover:bg-stone-50'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        {filtered.length === 0 && <div className="col-span-full text-center text-stone-500 py-10">No products match your search.</div>}
      </div>
    </>
  )
}
