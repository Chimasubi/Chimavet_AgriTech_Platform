import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Tractor, ShoppingCart, Menu, X, Sparkles } from 'lucide-react'
import { useStore } from '../data/store.jsx'

export default function Navigation({ onCartClick }) {
  const [open, setOpen] = useState(false)
  const { cart } = useStore()
  const count = cart.reduce((a, b) => a + b.qty, 0)
  const links = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Agrovet' },
    { to: '/irrigation', label: 'Irrigation' },
    { to: '/equipment', label: 'Rental' },
    { to: '/transport', label: 'Transport' },
    { to: '/smart', label: 'Smart Hub' }
  ]
  return (
    <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-stone-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Tractor className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <div className="font-extrabold text-lg leading-tight text-stone-900">Chimavet</div>
            <div className="text-[10px] text-emerald-700 -mt-0.5 font-semibold tracking-wide uppercase">Smart Farming</div>
          </div>
        </NavLink>
        <div className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}
              className={({ isActive }) => `px-4 py-2 rounded-full text-sm font-semibold transition ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCartClick} className="relative p-2.5 rounded-full hover:bg-emerald-50" title="Cart">
            <ShoppingCart className="w-5 h-5 text-stone-700" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-full hover:bg-emerald-50">
            {open ? <X className="w-5 h-5 text-stone-700" /> : <Menu className="w-5 h-5 text-stone-700" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-stone-200 px-4 py-2 space-y-1 bg-white">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}
              className={({ isActive }) => `block px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700 hover:bg-emerald-50'}`}>
              {l.label}
            </NavLink>
          ))}
          <div className="border-t border-stone-200 my-2 pt-2 text-[10px] uppercase font-bold text-stone-400 px-4">AI Agents</div>
          <NavLink to="/agents/crop-doctor" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-emerald-50">🌿 Crop Doctor</NavLink>
          <NavLink to="/agents/market-scout" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-emerald-50">📈 Market Scout</NavLink>
          <NavLink to="/agents/voice" onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-emerald-50">🎙️ Voice AI</NavLink>
        </div>
      )}
    </nav>
  )
}
