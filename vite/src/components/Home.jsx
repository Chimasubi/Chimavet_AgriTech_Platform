import { Link } from 'react-router-dom'
import { Sparkles, Star, ShoppingBag, Droplets, ArrowRight, Leaf, TrendingUp, Mic, Tractor, Truck } from 'lucide-react'
import { PRODUCTS, TSh } from '../data/catalog'
import { useStore } from '../data/store.jsx'

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({length: 5}, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400' : 'text-stone-300'}`} />
      ))}
    </div>
  )
}

export default function Home() {
  const { addToCart } = useStore()
  const featured = PRODUCTS.slice(0, 3)
  const tiles = [
    { icon: ShoppingBag, label: 'Chimaguli Agrovet', desc: '500+ quality farm inputs', to: '/shop', color: 'from-amber-400 to-orange-500', img: 'https://images.unsplash.com/photo-1759411364609-aeb30eb034e4?auto=format&fit=crop&w=600&q=80' },
    { icon: Droplets, label: 'Smart Irrigation', desc: 'Auto + manual control', to: '/irrigation', color: 'from-blue-500 to-cyan-500', img: 'https://images.unsplash.com/photo-1598370025936-0856434d26e7?auto=format&fit=crop&w=600&q=80' },
    { icon: Tractor, label: 'Equipment Rental', desc: 'Tractors, harvesters & tools', to: '/equipment', color: 'from-emerald-500 to-emerald-700', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80' },
    { icon: Truck, label: 'Transport to Market', desc: 'Driver marketplace + cold chain', to: '/transport', color: 'from-orange-500 to-red-500', img: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=600&q=80' },
    { icon: Sparkles, label: 'Smart Farming', desc: 'Weather, soil & yield insights', to: '/smart', color: 'from-violet-500 to-purple-600', img: 'https://images.unsplash.com/photo-1655980235599-8e3d642e4993?auto=format&fit=crop&w=600&q=80' }
  ]
  const agents = [
    { icon: Leaf, label: 'Crop Doctor', desc: 'Photo-based disease diagnosis', to: '/agents/crop-doctor', color: 'from-emerald-500 to-green-600', img: 'https://images.unsplash.com/photo-1622984897831-839bcde8e434?auto=format&fit=crop&w=600&q=80' },
    { icon: TrendingUp, label: 'Market Scout', desc: 'Live prices & sell/hold advice', to: '/agents/market-scout', color: 'from-blue-500 to-indigo-600', img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80' },
    { icon: Mic, label: 'Voice AI', desc: 'Ongea kwa Kiswahili', to: '/agents/voice', color: 'from-violet-500 to-fuchsia-600', img: 'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=600&q=80' }
  ]
  return (
    <>
      <section className="relative -mt-6 -mx-4 mb-10 overflow-hidden rounded-3xl">
        <div className="hero-bg text-white px-4 py-16 sm:py-24">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
            <div className="fade-in">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-semibold mb-5">
                <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                <span>Built for Tanzanian farmers</span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.05]">
                Welcome to <span className="bg-gradient-to-r from-yellow-300 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Chimavet</span>
              </h1>
              <p className="text-lg sm:text-xl text-emerald-50/90 mb-8 max-w-xl leading-relaxed">
                The all-in-one smart farming platform — <strong>Chimaguli Agrovet</strong> for inputs, intelligent irrigation, AI agents, equipment rental & transport to market.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/shop" className="px-7 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-emerald-950 font-bold rounded-full shadow-2xl shadow-yellow-500/30 hover:shadow-yellow-500/50 transition inline-flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" /> Nunua Sasa
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/agents/crop-doctor" className="px-7 py-3.5 bg-white/10 backdrop-blur border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 transition inline-flex items-center gap-2">
                  <Leaf className="w-5 h-5" /> Crop Doctor AI
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-emerald-50/80">
                <div className="flex items-center gap-2"><span className="font-bold text-white">12,400+</span> farmers</div>
                <div className="flex items-center gap-2"><span className="font-bold text-white">500+</span> products</div>
                <div className="flex items-center gap-2"><span className="font-bold text-white">8</span> markets</div>
                <div className="flex items-center gap-2"><span className="font-bold text-white">7</span> drivers</div>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-yellow-400/30 to-emerald-400/30 rounded-3xl blur-2xl" />
              <img src="https://images.unsplash.com/photo-1585428311604-98738fc5687a?auto=format&fit=crop&w=900&q=80" alt="Tanzania farm" className="relative rounded-3xl shadow-2xl w-full h-[480px] object-cover ring-4 ring-white/10" />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3 max-w-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center"><Leaf className="w-6 h-6 text-emerald-700" /></div>
                <div>
                  <div className="text-xs text-stone-500">Crop Doctor</div>
                  <div className="font-bold text-sm">Picha ya majani → Uchunguzi wa AI</div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-amber-700" /></div>
                <div>
                  <div className="text-xs text-stone-500">Bei ya mahindi</div>
                  <div className="font-bold text-sm tabular-nums">TSh 95,000 <span className="text-emerald-600 text-xs">+5%</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-700 font-bold mb-1">Chimaguli Agrovet</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold">Bidhaa Maarufu</h2>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">Ona zote <ArrowRight className="w-4 h-4" /></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map(p => (
            <div key={p.id} className="group bg-white rounded-3xl overflow-hidden border border-stone-200 card-lift">
              <div className="img-overlay relative aspect-[4/3] bg-stone-100">
                <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover" />
                {p.badge && <span className="absolute top-3 left-3 z-10 text-[10px] font-bold uppercase tracking-wider bg-amber-400 text-amber-950 px-2.5 py-1 rounded-full shadow-lg">{p.badge}</span>}
                {p.oldPrice && <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-red-500 text-white px-2.5 py-1 rounded-full shadow-lg">-{Math.round((1 - p.price / p.oldPrice) * 100)}%</span>}
              </div>
              <div className="p-5">
                <div className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-1.5">{p.category}</div>
                <h3 className="font-bold text-stone-900 mb-1 leading-snug">{p.name}</h3>
                <p className="text-xs text-stone-500 mb-3 line-clamp-2">{p.desc}</p>
                <div className="flex items-center gap-2 mb-3 text-xs text-stone-500">
                  <Stars rating={p.rating} />
                  <span className="font-semibold text-stone-700">{p.rating}</span>
                  <span>({p.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    {p.oldPrice && <div className="text-xs text-stone-400 line-through tabular-nums">{TSh(p.oldPrice)}</div>}
                    <div className="text-xl font-extrabold text-emerald-700 tabular-nums">{TSh(p.price)}</div>
                  </div>
                  <button onClick={() => addToCart(p.id, PRODUCTS)} className="px-4 py-2.5 bg-stone-900 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold transition flex items-center gap-1.5">
                    Ongeza
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tiles.map(c => (
            <Link key={c.label} to={c.to} className="group relative rounded-3xl overflow-hidden h-56 text-left card-lift">
              <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/60 to-transparent" />
              <div className="relative h-full flex flex-col justify-end p-6 text-white">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <c.icon className="w-6 h-6" />
                </div>
                <div className="font-extrabold text-xl">{c.label}</div>
                <div className="text-sm text-stone-200">{c.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3 h-3" /> Powered by AI
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">Wakala wa AI</h2>
          <p className="text-stone-600 mt-2 max-w-2xl mx-auto">Three specialized AI agents that work 24/7 for your farm</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map(a => (
            <Link key={a.label} to={a.to} className="group relative rounded-3xl overflow-hidden h-64 text-left card-lift">
              <img src={a.img} alt={a.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/70 to-stone-950/30" />
              <div className="relative h-full flex flex-col justify-between p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} flex items-center justify-center shadow-2xl`}>
                    <a.icon className="w-7 h-7" />
                  </div>
                  <span className="text-[10px] font-bold bg-violet-500/30 backdrop-blur border border-violet-300/30 text-violet-100 px-2.5 py-1 rounded-full">AI</span>
                </div>
                <div>
                  <div className="font-extrabold text-2xl mb-1">{a.label}</div>
                  <div className="text-sm text-stone-200 leading-relaxed">{a.desc}</div>
                  <div className="mt-3 text-xs font-semibold inline-flex items-center gap-1 text-yellow-300">Jaribu sasa <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" /></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-8 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500 rounded-full blur-3xl opacity-30 -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500 rounded-full blur-3xl opacity-20 -ml-20 -mb-20" />
        <div className="relative grid sm:grid-cols-4 gap-8 text-center">
          {[
            { num: '12,400+', label: 'Wakulima waliojiunga' },
            { num: '8', label: 'Masoko makuu Tanzania' },
            { num: '500+', label: 'Bidhaa za kilimo' },
            { num: '24/7', label: 'Msaada wa AI' }
          ].map(s => (
            <div key={s.label}>
              <div className="text-4xl sm:text-5xl font-extrabold text-yellow-300 mb-2 tabular-nums">{s.num}</div>
              <div className="text-sm text-emerald-200">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
