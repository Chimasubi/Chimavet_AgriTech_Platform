'use client'
import { X, ShoppingCart, ShoppingBag } from 'lucide-react'
import { useCart } from '@/lib/CartProvider'
import { TSh } from '@/lib/data'

export default function CartDrawer() {
  const { cart, changeQty, clearCart, drawerOpen, closeDrawer } = useCart()
  if (!drawerOpen) return null
  const total = cart.reduce((a, b) => a + b.price * b.qty, 0)
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={closeDrawer}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col fade-in" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-emerald-700" /> Your Cart</h3>
          <button onClick={closeDrawer} className="p-1 hover:bg-stone-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 flex-1 overflow-y-auto">
          {!cart.length && <div className="text-center text-stone-500 py-10"><ShoppingBag className="w-12 h-12 mx-auto mb-2 text-stone-300" /><p>Cart yako haina kitu</p></div>}
          {cart.map(i => (
            <div key={i.id} className="flex items-center gap-3 py-3 border-b last:border-0">
              <img src={i.img} alt={i.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <div className="font-medium text-sm">{i.name}</div>
                <div className="text-xs text-stone-500 tabular-nums">{TSh(i.price)} × {i.qty}</div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => changeQty(i.id, -1)} className="w-7 h-7 rounded bg-stone-100 hover:bg-stone-200">−</button>
                <span className="w-7 text-center text-sm">{i.qty}</span>
                <button onClick={() => changeQty(i.id, 1)} className="w-7 h-7 rounded bg-stone-100 hover:bg-stone-200">+</button>
              </div>
              <div className="font-semibold text-sm w-24 text-right tabular-nums">{TSh(i.price * i.qty)}</div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="p-5 border-t bg-stone-50 rounded-b-2xl">
            <div className="flex justify-between text-sm mb-1"><span>Bidhaa</span><span className="tabular-nums">{TSh(total)}</span></div>
            <div className="flex justify-between text-sm mb-3 text-stone-500"><span>Delivery</span><span>Calculated at checkout</span></div>
            <div className="flex justify-between font-bold text-lg mb-4"><span>Jumla</span><span className="tabular-nums">{TSh(total)}</span></div>
            <div className="flex gap-2">
              <button onClick={closeDrawer} className="flex-1 py-2.5 border border-stone-300 rounded-lg text-sm font-medium hover:bg-stone-100">Endelea</button>
              <button onClick={async () => {
                const res = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart, total }) })
                const data = await res.json()
                alert(`Agiza ${data.orderId} limekubaliwa! Jumla ${TSh(total)}`)
                clearCart(); closeDrawer()
              }} className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700">Lipia Sasa</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
