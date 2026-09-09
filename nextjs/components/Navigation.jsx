'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Tractor, ShoppingCart, Menu, X, Sprout } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/lib/CartProvider'
import { useFarm } from '@/lib/FarmContext'
import { OS_STAGES } from '@/lib/farmData'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const { cart, openDrawer } = useCart()
  const { farm, phase } = useFarm()
  const path = usePathname()
  const count = cart.reduce((a, b) => a + b.qty, 0)
  const isActive = (href) => href === '/' ? path === '/' : path.startsWith(href)

  const links = [
    { href: '/farm', label: 'Farm OS', icon: '🏠' },
    { href: '/farm/soil', label: 'Soil', icon: '🧪' },
    { href: '/farm/inputs', label: 'Inputs', icon: '🛒' },
    { href: '/farm/irrigation', label: 'Irrigation', icon: '💧' },
    { href: '/farm/machinery', label: 'Machinery', icon: '🚜' },
    { href: '/farm/crop', label: 'Production', icon: '🌾' },
    { href: '/farm/produce', label: 'Market', icon: '🏪' },
    { href: '/farm/economics', label: 'Economics', icon: '📊' }
  ]

  return (
    <nav className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-stone-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center shadow-lg shadow-emerald-600/20">
            <Tractor className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="hidden sm:block">
            <div className="font-extrabold text-lg leading-tight text-stone-900">Chimavet</div>
            <div className="text-[10px] text-emerald-700 -mt-0.5 font-semibold tracking-wide uppercase">Smart Farming</div>
          </div>
        </Link>

        {farm && phase && (
          <div className="hidden lg:flex items-center gap-1 min-w-0 flex-1 justify-center overflow-x-auto no-scrollbar">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`px-3 py-2 rounded-full text-xs font-semibold transition whitespace-nowrap ${isActive(l.href) ? 'bg-emerald-50 text-emerald-700' : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                <span className="mr-1">{l.icon}</span>{l.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {farm && phase && (
            <Link href="/farm" className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 border border-amber-200 text-xs font-bold text-amber-800 hover:bg-amber-100 transition">
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              {farm.farm.cropLabel} · Day {phase.daysIn}
            </Link>
          )}
          <button onClick={openDrawer} className="relative p-2.5 rounded-full hover:bg-emerald-50" title="Cart">
            <ShoppingCart className="w-5 h-5 text-stone-700" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">{count}</span>
            )}
          </button>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2.5 rounded-full hover:bg-emerald-50">
            {open ? <X className="w-5 h-5 text-stone-700" /> : <Menu className="w-5 h-5 text-stone-700" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="lg:hidden border-t border-stone-200 px-4 py-3 space-y-1 bg-white max-h-[70vh] overflow-y-auto">
          {farm && <div className="text-[10px] uppercase font-bold text-stone-400 px-4 pt-1 pb-1">Farm OS · {farm.farm.cropLabel}</div>}
          {links.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={`block px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive(l.href) ? 'bg-emerald-600 text-white' : 'text-stone-700 hover:bg-emerald-50'}`}>
              <span className="mr-2">{l.icon}</span>{l.label}
            </Link>
          ))}
          <div className="border-t border-stone-200 my-2 pt-2">
            <div className="text-[10px] uppercase font-bold text-stone-400 px-4 pb-1">Explore more</div>
            {[
              { href: '/shop', label: '🛒 Chimaguli Agrovet Catalog' },
              { href: '/agents/crop-doctor', label: '🌿 Crop Doctor AI' },
              { href: '/agents/market-scout', label: '📈 Market Scout' },
              { href: '/agents/voice', label: '🎙️ Voice AI (Swahili)' }
            ].map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-stone-700 hover:bg-emerald-50">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}