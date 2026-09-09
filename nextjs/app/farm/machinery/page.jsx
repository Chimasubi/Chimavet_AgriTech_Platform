'use client'
import { useState } from 'react'
import { Tractor, Star, MapPin, CheckCircle2, X, Trash2, CalendarPlus, Sparkles } from 'lucide-react'
import { EQUIPMENT, TSh } from '@/lib/data'
import { useFarm } from '@/lib/FarmContext'
import { PageHead, SectionCard, Chip } from '@/components/FarmUI'

const PHASE_MACHINERY = {
  nursery: { cats: ['Tillage', 'Planting'], note: 'Land prep for seedbeds & field', icon: 'Seedbeds ' },
  transplant: { cats: ['Tillage', 'Planting'], note: 'Bed forming before transplant', icon: 'Plough ' },
  vegetative: { cats: ['Spraying', 'Tillage'], note: 'Weeding passes + pesticide sprays', icon: 'Sprayer ' },
  bulbInit: { cats: ['Spraying'], note: 'Thrips / disease protection sprays', icon: 'Spray ' },
  bulbSwell: { cats: ['Spraying'], note: 'Fungicide protection through fill', icon: 'Spray ' },
  maturity: { cats: ['Harvester', 'Transport'], note: 'Lifting & hauling plan', icon: 'Harvest ' },
  harvest: { cats: ['Harvester', 'Transport'], note: 'Lift, grade & move to market', icon: 'Lift ' }
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5 text-amber-500">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-amber-400' : 'text-stone-300'}`} />
      ))}
    </div>
  )
}

export default function MachineryPage() {
  const { farm, set, phase } = useFarm()
  const [booking, setBooking] = useState(null)
  if (!farm) return null

  const rec = PHASE_MACHINERY[phase.key] || PHASE_MACHINERY.vegetative
  const recList = EQUIPMENT.filter(e => rec.cats.includes(e.cat))
  const others = EQUIPMENT.filter(e => !rec.cats.includes(e.cat))
  const bookedTotal = farm.bookings.reduce((a, b) => a + Number(b.total), 0)

  const confirm = ({ startDate, endDate, days, total }) => {
    set({ bookings: [...farm.bookings, {
      id: Date.now(), name: booking.name, cat: booking.cat, img: booking.img, owner: booking.owner, loc: booking.loc,
      startDate, endDate, days, pricePerDay: booking.pricePerDay, total, status: 'booked'
    }] })
    setBooking(null)
  }
  const remove = (id) => set({ bookings: farm.bookings.filter(b => b.id !== id) })

  return (
    <>
      <PageHead icon={Tractor} bg="bg-gradient-to-br from-emerald-600 to-emerald-800" title="Machinery"
        sub={`What the ${phase.label} stage needs · booked rent goes to your ledger`} />
      <div className="mb-3 mt-2" />

      <div className="mb-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
        <p className="text-sm text-stone-700"><span className="font-bold text-emerald-800">{rec.icon}</span> {phase.label} → {rec.note}. These come pre-sorted to the top.</p>
      </div>

      <h2 className="text-xl font-extrabold mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-700" /> Recommended now</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {recList.map(e => <MachCard key={e.id} e={e} onBook={() => setBooking(e)} />)}
        {recList.length === 0 && <p className="text-stone-500 text-sm col-span-full">Nothing needed for this stage from the fleet.</p>}
      </div>

      {farm.bookings.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-extrabold mb-3">Booked ({farm.bookings.length}) · {TSh(bookedTotal)}</h2>
          <div className="space-y-2.5">
            {farm.bookings.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-stone-200 p-3.5 flex items-center gap-4">
                <img src={b.img} alt={b.name} className="w-14 h-14 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{b.name}</div>
                  <div className="text-xs text-stone-500">{(b.owner || b.loc) && `${b.owner} · ${b.loc} · `}{b.startDate} → {b.endDate} ({b.days} days)</div>
                </div>
                <Chip tone={b.status === 'completed' ? 'emerald' : 'blue'}>{b.status}</Chip>
                <span className="font-extrabold text-emerald-700 tabular-nums">{TSh(b.total)}</span>
                <button onClick={() => remove(b.id)} className="p-1.5 hover:bg-red-50 text-red-600 rounded-full"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </section>
      )}

      <h2 className="text-xl font-extrabold mb-3">Full fleet</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {others.map(e => <MachCard key={e.id} e={e} onBook={() => setBooking(e)} />)}
      </div>

      {booking && <BookingModal item={booking} onClose={() => setBooking(null)} onConfirm={confirm} />}
    </>
  )
}

function MachCard({ e, onBook }) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-stone-200 card-lift">
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
        <img src={e.img} alt={e.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-lg">{e.cat}</span>
        <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/95 backdrop-blur text-emerald-800 px-2.5 py-1 rounded-full shadow flex items-center gap-1"><MapPin className="w-3 h-3" /> {e.loc}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-stone-900 leading-snug mb-1">{e.name}</h3>
        <div className="flex items-center gap-2 text-xs mb-2"><Stars rating={e.rating} /><span className="font-semibold text-stone-700">{e.rating}</span></div>
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div>
            <div className="text-[10px] text-stone-500 uppercase font-semibold tracking-wider">Per day</div>
            <div className="text-xl font-extrabold text-emerald-700 tabular-nums">{TSh(e.pricePerDay)}</div>
          </div>
          <button onClick={onBook} className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 text-white rounded-full text-sm font-semibold transition flex items-center gap-1.5">
            <CalendarPlus className="w-4 h-4" /> Book
          </button>
        </div>
      </div>
    </div>
  )
}

function BookingModal({ item, onClose, onConfirm }) {
  const today = new Date().toISOString().split('T')[0]
  const [start, setStart] = useState(today)
  const [end, setEnd] = useState(new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0])
  const days = Math.max(1, Math.ceil((new Date(end) - new Date(start)) / 86400000) || 1)
  const subtotal = item.pricePerDay * days
  const fee = Math.round(subtotal * 0.1)
  const total = subtotal + fee

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col fade-in overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="relative aspect-[16/9] bg-stone-100">
          <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
          <button onClick={onClose} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white"><X className="w-5 h-5" /></button>
          <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-emerald-700 text-white px-2.5 py-1 rounded-full shadow-lg">{item.cat}</span>
        </div>
        <div className="p-5 overflow-y-auto">
          <h2 className="text-2xl font-extrabold mb-1">{item.name}</h2>
          <div className="text-sm text-stone-500 mb-3">Owner: <span className="font-semibold text-stone-700">{item.owner}</span> · <MapPin className="w-3 h-3 inline" /> {item.loc}</div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div><label className="text-xs font-semibold text-stone-600 mb-1 block">Start Date</label><input type="date" min={today} value={start} onChange={ev => setStart(ev.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
            <div><label className="text-xs font-semibold text-stone-600 mb-1 block">End Date</label><input type="date" min={start} value={end} onChange={ev => setEnd(ev.target.value)} className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500" /></div>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 mb-4 text-sm space-y-1.5">
            <div className="flex justify-between text-stone-600"><span>Daily rate</span><span className="tabular-nums">{TSh(item.pricePerDay)}</span></div>
            <div className="flex justify-between text-stone-600"><span>Days</span><span className="tabular-nums font-semibold">{days}</span></div>
            <div className="flex justify-between text-stone-600"><span>Service fee (10%)</span><span className="tabular-nums">{TSh(fee)}</span></div>
            <div className="flex justify-between font-extrabold text-lg pt-2 border-t border-stone-200"><span>Total</span><span className="tabular-nums text-emerald-700">{TSh(total)}</span></div>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-3 border border-stone-200 rounded-full text-sm font-semibold hover:bg-stone-100">Cancel</button>
            <button onClick={() => onConfirm({ startDate: start, endDate: end, days, total })} className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2"><CheckCircle2 className="w-4 h-4" /> Confirm Booking</button>
          </div>
        </div>
      </div>
    </div>
  )
}