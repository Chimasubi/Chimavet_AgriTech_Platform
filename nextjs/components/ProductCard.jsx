'use client'
import { useCart } from '@/lib/CartProvider'
import { TSh } from '@/lib/data'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200 card-lift">
      <div className="img-overlay relative aspect-[4/3] bg-stone-100">
        <img src={product.img} alt={product.name} loading="lazy" className="w-full h-full object-cover" />
        {product.badge && <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full shadow-lg">{product.badge}</span>}
        {product.oldPrice && <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow-lg">-{Math.round((1 - product.price/product.oldPrice)*100)}%</span>}
      </div>
      <div className="p-5">
        <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1.5">{product.category}</div>
        <h3 className="font-bold text-stone-900 mb-1 leading-snug">{product.name}</h3>
        <p className="text-xs text-stone-500 mb-3 line-clamp-2">{product.desc}</p>
        <div className="flex items-center justify-between">
          <div>
            {product.oldPrice && <div className="text-xs text-stone-400 line-through tabular-nums">{TSh(product.oldPrice)}</div>}
            <div className="text-xl font-extrabold text-emerald-700 tabular-nums">{TSh(product.price)}</div>
          </div>
          <button onClick={() => addToCart(product)} className="px-4 py-2.5 bg-stone-900 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition">Ongeza</button>
        </div>
      </div>
    </div>
  )
}
