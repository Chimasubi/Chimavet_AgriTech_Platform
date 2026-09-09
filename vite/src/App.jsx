import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Link } from 'react-router-dom'
import { Tractor, Sparkles } from 'lucide-react'
import Navigation from './components/Navigation'
import Home from './components/Home'
import AgrovetShop from './components/AgrovetShop'
import Irrigation from './components/Irrigation'
import SmartFarming from './components/SmartFarming'
import EquipmentRental from './components/EquipmentRental'
import TransportMarket from './components/TransportMarket'
import CropDoctor from './components/CropDoctor'
import MarketScout from './components/MarketScout'
import VoiceAssistant from './components/VoiceAssistant'
import NotFound from './components/NotFound'
import AIAssistant from './components/AIAssistant'
import CartModal from './components/CartModal'
import { StoreProvider } from './data/store.jsx'

function Splash({ onDone }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center hero-bg transition-opacity duration-500">
      <div className="text-center fade-in">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/10 ring-4 ring-yellow-400/40 mb-6">
          <Tractor className="w-14 h-14 text-yellow-300" />
        </div>
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-tight">Chimavet</h1>
        <p className="text-emerald-100 mt-2 text-lg">Smart Farming Platform</p>
        <button onClick={onDone} className="mt-8 px-6 py-2 bg-white/10 border border-white/30 text-white rounded-full text-sm hover:bg-white/20">
          Enter →
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [splash, setSplash] = useState(true)
  const [cartOpen, setCartOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 2500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  return (
    <StoreProvider>
      {splash && <Splash onDone={() => setSplash(false)} />}
      <div className="min-h-screen flex flex-col">
        <Navigation onCartClick={() => setCartOpen(true)} />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<AgrovetShop />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/equipment" element={<EquipmentRental />} />
            <Route path="/transport" element={<TransportMarket />} />
            <Route path="/smart" element={<SmartFarming />} />
            <Route path="/agents/crop-doctor" element={<CropDoctor />} />
            <Route path="/agents/market-scout" element={<MarketScout />} />
            <Route path="/agents/voice" element={<VoiceAssistant />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <footer className="bg-emerald-950 text-emerald-100 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                  <Tractor className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <div className="font-extrabold text-white text-lg">Chimavet</div>
                  <div className="text-emerald-400 text-[10px] font-semibold tracking-wider uppercase">Smart Farming</div>
                </div>
              </div>
              <p className="text-sm text-emerald-300/80 leading-relaxed">Empowering Tanzanian farmers with smart tools, AI agents, and quality farm inputs.</p>
            </div>
            <div>
              <div className="font-bold text-white mb-3">Platform</div>
              <ul className="space-y-2 text-sm text-emerald-300/80">
                <li><Link to="/shop" className="hover:text-yellow-300">Chimaguli Agrovet</Link></li>
                <li><Link to="/irrigation" className="hover:text-yellow-300">Irrigation Control</Link></li>
                <li><Link to="/equipment" className="hover:text-yellow-300">🚜 Equipment Rental</Link></li>
                <li><Link to="/transport" className="hover:text-yellow-300">🚚 Transport to Market</Link></li>
                <li><Link to="/smart" className="hover:text-yellow-300">Smart Farming Hub</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-3">AI Agents</div>
              <ul className="space-y-2 text-sm text-emerald-300/80">
                <li><Link to="/agents/crop-doctor" className="hover:text-yellow-300">🌿 Crop Doctor</Link></li>
                <li><Link to="/agents/market-scout" className="hover:text-yellow-300">📈 Market Scout</Link></li>
                <li><Link to="/agents/voice" className="hover:text-yellow-300">🎙️ Voice AI (Swahili)</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-bold text-white mb-3">Contact</div>
              <ul className="space-y-2 text-sm text-emerald-300/80">
                <li>📍 Arusha, Tanzania</li>
                <li>📞 +255 27 000 0000</li>
                <li>✉️ hello@chimavet.co.tz</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-emerald-900 py-4 text-center text-xs text-emerald-400/60">
            © {new Date().getFullYear()} Chimavet Online Platform · Built for Tanzania 🇹🇿
          </div>
        </footer>
        <AIAssistant />
        <CartModal open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </StoreProvider>
  )
}
