import { useState, useMemo } from 'react'
import { Star, MapPin, CheckCircle2, X, CalendarPlus, CalendarCheck2, Trash2, Info, ShieldCheck, Clock, Tractor } from 'lucide-react'
import { EQUIPMENT, TSh, EQ_CATEGORIES } from '../data/catalog'
import { useStore } from '../data/store.jsx'

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400' : 'text-stone-300'}`} />
      ))}
    </div>
  )
}

function EqCard({ e, onBook }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200 card-lift">
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img src={e.img} alt={e.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-lg">{e.cat}</span>
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/95 backdrop-blur text-emerald-800 px-2.5 py-1 rounded-full shadow flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {e.loc}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-stone-900 leading-snug mb-1">{e.name}</h3>
        <div className="text-xs text-stone-500 mb-3">Owner: <span className="font-semibold text-stone-700">{e.owner}</span></div>
        <div className="flex items-center gap-2 mb-3 text-xs">
          <Stars rating={e.rating} />
          <span className="font-semibold text-stone-700">{e.rating}</span>
          <span className="text-stone-500">({e.reviews} trips)</span>
        </div>
        <div className="text-xs text-stone-500 mb-4 flex flex-wrap gap-1.5">
          {e.specs.slice(0, 3).map(s => (<span key={s} className="bg-stone-100 px-2 py-0.5 rounded-full">{s}</span>))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">Per day</div>
            <div className="text-xl font-extrabold text-emerald-700 tabular-nums">{TSh(e.pricePerDay)}</div>
          </div>
          <button onClick={() => onBook(e)} className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 text-white rounded-full text-sm font-semibold transition flex items-center gap-1.5">
            <CalendarPlus className="w-4 h-4" /> Book Now
          </button>
        </div>
      </div>
    </div>
  )
}

function EqModal({ e, onClose, onConfirm }) {
  const today = new Date().toISOString().split('T')[0]
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]
  const [start, setStart] = useState(today)
  const [end, setEnd] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0])

  const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000) || 1)
  const subtotal = e.pricePerDay * days
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col fade-in overflow-hidden">
        <div className="relative aspect-[16/9] bg-stone-100">
          <img src={e.img} className="w-full h-full object-cover" alt={e.name} />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white"><X className="w-5 h-5" /></button>
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-lg">{e.cat}</span>
        </div>
        <div className="p-5 overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-1">{e.name}</h2>
          <div className="text-sm text-stone-500 mb-3">Owner: <span className="font-semibold text-stone-700">{e.owner}</span> · <MapPin className="w-3 h-3 inline" /> {e.loc}</div>
          <div className="flex items-center gap-2 mb-5">
            <Stars rating={e.rating} />
            <span className="font-semibold text-stone-700">{e.rating}</span>
            <span className="text-stone-500">({e.reviews} reviews)</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5">
            <div className="text-[10px] font-bold uppercase text-emerald-700 tracking-widest mb-2">Specifications</div>
            <ul className="space-y-1 text-sm text-stone-700">
              {e.specs.map(s => (
                <li key={s} className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" /> {s}</li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">Start Date</label>
              <input type="date" min={today} value={start} onChange={ev => setStart(ev.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">End Date</label>
              <input type="date" min={tomorrow} value={end} onChange={ev => setEnd(ev.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
            </div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-4 text-sm space-y-1.5">
            <div className="flex justify-between text-stone-600"><span>Daily rate</span><span className="tabular-nums">{TSh(e.pricePerDay)}</span></div>
            <div className="flex justify-between text-stone-600"><span>Number of days</span><span className="tabular-nums font-semibold">{days}</span></div>
            <div className="flex justify-between text-stone-600"><span>Service fee (10%)</span><span className="tabular-nums">{TSh(fee)}</span></div>
            <div className="flex justify-between font-extrabold text-lg pt-2 border-t border-stone-200"><span>Total</span><span className="tabular-nums text-emerald-700">{TSh(total)}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 border border-stone-200 rounded-full text-sm font-semibold hover:bg-stone-100">Cancel</button>
            <button onClick={() => onConfirm({ startDate: start, endDate: end, days, total })} className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EquipmentRental() {
  const { rentals, addRental, removeRental } = useStore()
  const [cat, setCat] = useState('All')
  const [bookingItem, setBookingItem] = useState(null)

  const list = useMemo(() => cat === 'All' ? EQUIPMENT : EQUIPMENT.filter(e => e.cat === cat), [cat])

  const handleConfirm = (booking) => {
    if (!bookingItem) return
    addRental({
      name: bookingItem.name, loc: bookingItem.loc, owner: bookingItem.owner, img: bookingItem.img,
      ...booking
    })
    setBookingItem(null)
  }

  return (
    <>
      <section className="relative -mt-6 -mx-4 mb-6 h-64 sm:h-80 overflow-hidden rounded-3xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(5,46,28,0.92) 0%, rgba(4,120,87,0.7) 50%, rgba(217,119,6,0.35) 100%), url(https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative h-full flex items-center px-4 sm:px-8 text-white">
          <div className="max-w-2xl fade-in">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
              <Tractor className="w-3 h-3" /> Equipment Rental Zone
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Kodi ya Mashine za Kilimo</h1>
            <p className="text-emerald-50/90 text-lg">Browse tractors, harvesters & tools from verified owners across Tanzania. Book by the day.</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-emerald-100">
              <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> Verified owners</div>
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> 8 regions</div>
              <div className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> Instant booking</div>
            </div>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2 mb-6">
        {EQ_CATEGORIES.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${cat === c ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-500 hover:text-emerald-700'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {list.map(e => <EqCard key={e.id} e={e} onBook={setBookingItem} />)}
      </div>

      {rentals.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2"><CalendarCheck2 className="w-5 h-5 text-emerald-700" /> My Rentals ({rentals.length})</h2>
          <div className="space-y-3">
            {rentals.map(r => (
              <div key={r.id} className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center gap-4">
                <img src={r.img} alt={r.name} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-stone-900 truncate">{r.name}</div>
                  <div className="text-xs text-stone-500">{r.loc} · {r.startDate} → {r.endDate} ({r.days} days)</div>
                </div>
                <div className="font-extrabold text-emerald-700 tabular-nums text-right">{TSh(r.total)}</div>
                <button onClick={() => removeRental(r.id)} className="p-2 hover:bg-red-50 text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 bg-gradient-to-br from-emerald-50 to-amber-50 border border-emerald-200 rounded-3xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Info className="w-6 h-6 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 mb-1">Jinsi ya kukodi · How rental works</h3>
            <ol className="text-sm text-stone-600 space-y-1 list-decimal list-inside">
              <li>Chagua mashine unayohitaji na tazama maelezo</li>
              <li>Weka tarehe za kukodi na idadi ya siku</li>
              <li>Lipia kidogo (10%) kuthibitisha booking — salio mlipokeaji</li>
              <li>Mmiliki atakupigia simu ndani ya masaa 2</li>
              <li>Pokea mashine siku ya kwanza · Pima kabla ya kukubali</li>
            </ol>
          </div>
        </div>
      </section>

      {bookingItem && <EqModal e={bookingItem} onClose={() => setBookingItem(null)} onConfirm={handleConfirm} />}
    </>
  )
}
