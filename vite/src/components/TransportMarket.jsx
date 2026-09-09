import { useState, useMemo } from 'react'
import { Truck, MapPin, Star, Snowflake, Search, Package, Trash2, Info, CheckCircle2 } from 'lucide-react'
import { DRIVERS, TZ_MARKETS, TSh } from '../data/catalog'
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

function DriverCard({ d, onBook }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 card-lift">
      <div className="flex items-start gap-4">
        <img src={d.img} alt={d.name} loading="lazy" className="w-20 h-20 rounded-xl object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="font-bold text-stone-900">{d.name}</div>
              <div className="text-xs text-stone-500">{d.vehicle} · <span className="font-mono">{d.plate}</span></div>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{d.capacityKg.toLocaleString()} kg</span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs">
            <Stars rating={d.rating} />
            <span className="font-semibold text-stone-700">{d.rating}</span>
            <span className="text-stone-500">· {d.trips} trips</span>
            {d.coldChain && (
              <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                <Snowflake className="w-3 h-3" /> Cold chain
              </span>
            )}
          </div>
          <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> {d.region}</div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">Rate</div>
              <div className="text-base font-extrabold text-emerald-700 tabular-nums">{TSh(d.ratePerKm)}<span className="text-xs text-stone-500 font-normal">/km</span></div>
            </div>
            <button onClick={() => onBook(d)} className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg text-white rounded-full text-sm font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Book Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function TransportMarket() {
  const { transportBookings, addTransport, removeTransport } = useStore()
  const [form, setForm] = useState({
    commodity: '', qty: 500, date: new Date().toISOString().split('T')[0],
    pickup: '', dest: '', km: 120, cold: false
  })
  const [searched, setSearched] = useState(false)

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const filtered = useMemo(() => {
    if (!searched) return DRIVERS
    let list = DRIVERS.slice()
    if (form.qty) list = list.filter(d => d.capacityKg >= Math.min(form.qty, 1000))
    if (form.cold) list = list.filter(d => d.coldChain || d.capacityKg >= form.qty)
    return list.length ? list : DRIVERS
  }, [form, searched])

  const handleFind = (e) => {
    e.preventDefault()
    setSearched(true)
  }

  const handleBook = (d) => {
    if (!form.commodity || !form.qty || !form.date || !form.pickup || !form.dest || !form.km) {
      alert('Tafadhali jaza fomu kwanza')
      return
    }
    if (form.qty > d.capacityKg * 1.2) {
      alert(`⚠️ Mzigo mkubwa sana kwa ${d.vehicle} (max ${d.capacityKg.toLocaleString()} kg)`)
      return
    }
    addTransport({
      driver: d.name, vehicle: d.vehicle, img: d.img, plate: d.plate,
      commodity: form.commodity, qty: form.qty, date: form.date,
      pickup: form.pickup, dest: form.dest, km: form.km,
      total: d.ratePerKm * form.km
    })
    alert('Driver booked!')
  }

  return (
    <>
      <section className="relative -mt-6 -mx-4 mb-6 h-64 sm:h-80 overflow-hidden rounded-3xl">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(110deg, rgba(154,52,18,0.92) 0%, rgba(234,88,12,0.7) 50%, rgba(217,119,6,0.35) 100%), url(https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1920&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative h-full flex items-center px-4 sm:px-8 text-white">
          <div className="max-w-2xl fade-in">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold mb-4">
              <Truck className="w-3 h-3" /> Transport to Market
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-3">Kusafirisha Mazao Sokoni</h1>
            <p className="text-orange-50/90 text-lg">Post a load → nearby drivers bid/accept. Pickup, lorry, refrigerated — all in one place.</p>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-5 gap-5 mb-10">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold">Post a Load</h2>
              <p className="text-xs text-stone-500">Drivers will see your request</p>
            </div>
          </div>
          <form onSubmit={handleFind} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">Commodity *</label>
              <select required value={form.commodity} onChange={e => update('commodity', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                <option value="">Select produce</option>
                {['Maize','Rice','Beans','Tomatoes','Onions','Potatoes','Cabbage','Bananas','Coffee','Cotton','Sunflower'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Quantity (kg) *</label>
                <input type="number" min="50" step="50" value={form.qty} onChange={e => update('qty', Number(e.target.value))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </div>
              <div>
                <label className="text-xs font-semibold text-stone-600 mb-1 block">Pickup Date *</label>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">Pickup Location *</label>
              <input type="text" placeholder="e.g. Soko la Kariakoo" required value={form.pickup} onChange={e => update('pickup', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">Destination Market *</label>
              <select required value={form.dest} onChange={e => update('dest', e.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100">
                <option value="">Select market</option>
                {TZ_MARKETS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-stone-600 mb-1 block">Distance (km) *</label>
              <input type="number" min="1" step="1" value={form.km} onChange={e => update('km', Number(e.target.value))} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" />
              <div className="text-[10px] text-stone-400 mt-1">Estimated km between pickup and destination</div>
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-700">
              <input type="checkbox" checked={form.cold} onChange={e => update('cold', e.target.checked)} className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500" />
              <span>Requires refrigerated/cold chain</span>
            </label>
            <button type="submit" className="w-full py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:shadow-lg hover:shadow-orange-500/30 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Find Drivers
            </button>
          </form>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" /> Available Drivers
            </h2>
            <span className="text-xs text-stone-500">{filtered.length} drivers online</span>
          </div>
          <div className="space-y-3">
            {filtered.map(d => <DriverCard key={d.id} d={d} onBook={handleBook} />)}
          </div>
        </div>
      </div>

      {transportBookings.length > 0 && (
        <section className="mb-10">
          <h2 className="text-2xl font-extrabold mb-4 flex items-center gap-2"><Truck className="w-5 h-5 text-orange-600" /> My Transport Bookings ({transportBookings.length})</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {transportBookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-stone-200 p-4">
                <div className="flex items-start gap-3">
                  <img src={b.img} alt={b.driver} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-stone-900 truncate">{b.commodity} · {b.qty} kg</div>
                    <div className="text-xs text-stone-500">{b.pickup} → {b.dest}</div>
                    <div className="text-xs text-stone-500">Driver: <span className="font-semibold text-stone-700">{b.driver}</span> · {b.date}</div>
                  </div>
                  <button onClick={() => removeTransport(b.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="mt-3 flex items-center justify-between pt-3 border-t border-stone-100">
                  <span className="text-xs text-stone-500">{b.km} km · {b.vehicle}</span>
                  <span className="font-extrabold text-emerald-700 tabular-nums">{TSh(b.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-6">
        <h3 className="font-bold text-stone-900 mb-3 flex items-center gap-2"><Info className="w-5 h-5 text-orange-600" /> Jinsi transport inavyofanya kazi</h3>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-extrabold mb-2">1</div>
            <div className="font-bold mb-1">Post a Load</div>
            <div className="text-stone-600 text-xs">Weka mzigo wako, mahali pa kuchukua, na soko la kwenda</div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-extrabold mb-2">2</div>
            <div className="font-bold mb-1">Drivers Respond</div>
            <div className="text-stone-600 text-xs">Madereva wa karibu wanakuonyesha bei zao na nyakati</div>
          </div>
          <div>
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-extrabold mb-2">3</div>
            <div className="font-bold mb-1">Pay on Delivery</div>
            <div className="text-stone-600 text-xs">Mpokea mzigo sokoni — lipia baada ya kufikia salama</div>
          </div>
        </div>
      </section>
    </>
  )
}
