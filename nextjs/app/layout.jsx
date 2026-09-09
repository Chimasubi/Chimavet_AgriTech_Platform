import './globals.css'
import { CartProvider } from '@/lib/CartProvider'
import { FarmProvider } from '@/lib/FarmContext'
import Navigation from '@/components/Navigation'
import AIAssistant from '@/components/AIAssistant'
import CartDrawer from '@/components/CartDrawer'
import Link from 'next/link'
import { Tractor } from 'lucide-react'

export const metadata = {
  title: 'ChimaVet — One Connected Farm Operating System',
  description: 'From soil to market: one connected operating system for the farm. Plan, grow, irrigate, harvest and sell — powered by ChimaAI.'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <FarmProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Navigation />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 fade-in">{children}</main>
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
                    <p className="text-sm text-emerald-300/80 leading-relaxed">One connected agricultural operating system — from soil to market.</p>
                  </div>
                  <div>
                    <div className="font-bold text-white mb-3">Farm OS</div>
                    <ul className="space-y-2 text-sm text-emerald-300/80">
                      <li><Link href="/farm" className="hover:text-yellow-300">🌱 Farm Dashboard</Link></li>
                      <li><Link href="/farm/soil" className="hover:text-yellow-300">🧪 Soil Intelligence</Link></li>
                      <li><Link href="/farm/inputs" className="hover:text-yellow-300">🛒 Inputs</Link></li>
                      <li><Link href="/farm/crop" className="hover:text-yellow-300">🌾 Production</Link></li>
                      <li><Link href="/farm/economics" className="hover:text-yellow-300">📊 Farm Economics</Link></li>
                    </ul>
                  </div>
                  <div>
                    <div className="font-bold text-white mb-3">Market & Tools</div>
                    <ul className="space-y-2 text-sm text-emerald-300/80">
                      <li><Link href="/farm/produce" className="hover:text-yellow-300">🏪 Produce Marketplace</Link></li>
                      <li><Link href="/farm/machinery" className="hover:text-yellow-300">🚜 Machinery Rental</Link></li>
                      <li><Link href="/agents/crop-doctor" className="hover:text-yellow-300">🌿 Crop Doctor</Link></li>
                      <li><Link href="/agents/market-scout" className="hover:text-yellow-300">📈 Market Scout</Link></li>
                      <li><Link href="/agents/voice" className="hover:text-yellow-300">🎙️ Voice AI (Swahili)</Link></li>
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
                  © {new Date().getFullYear()} ChimaVet · One connected farm operating system 🇹🇿
                </div>
              </footer>
              <AIAssistant />
              <CartDrawer />
            </div>
          </CartProvider>
        </FarmProvider>
      </body>
    </html>
  )
}
