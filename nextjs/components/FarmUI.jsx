'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { OS_STAGES } from '@/lib/farmData'
import { useFarm } from '@/lib/FarmContext'
import { ChevronRight, Sprout, ArrowLeft } from 'lucide-react'

export function StageRail({ compact = false }) {
  const { stageIndex } = useFarm()
  const path = usePathname()
  if (compact) return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
      {OS_STAGES.map((s, i) => {
        const active = s.href ? path.startsWith(s.href) : false
        const isAI = s.href === null
        return isAI
          ? <AIStage key={s.key} s={s} idx={i} />
          : (
            <Link key={s.key} href={s.href}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition ${
                active ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                : i <= stageIndex ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-white text-stone-500 border-stone-200'}`}>
              <span className="text-sm">{s.icon}</span>{s.short}
            </Link>)
      })}
    </div>
  )
  return (
    <div className="flex items-start gap-1.5 overflow-x-auto no-scrollbar -mx-1 px-1 pb-1">
      {OS_STAGES.map((s, i) => {
        const active = s.href ? path.startsWith(s.href) : false
        return (
          <div key={s.key} className="shrink-0">
            <span className={`block whitespace-nowrap px-3 py-1.5 rounded-full text-[11px] font-semibold transition ${
              active ? 'bg-gradient-to-r from-emerald-700 to-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : i <= stageIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-400'}`}>
              {active ? <>{s.icon} {s.label}</> : <span className="opacity-80">{s.icon} {s.label}</span>}
            </span>
          </div>
        )
      })}
    </div>
  )
}

export function PageHead({ icon: Icon, bg = 'bg-emerald-600', title, sub, right }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2.5">
          {Icon && <span className={`w-10 h-10 rounded-2xl ${bg} flex items-center justify-center shadow-lg shadow-emerald-600/15`}><Icon className="w-5 h-5 text-white" /></span>}
          <h1 className="text-3xl font-extrabold tracking-tight">{title}</h1>
        </div>
        {sub && <p className="text-stone-600 text-sm mt-1.5 ml-[50px]">{sub}</p>}
      </div>
      {right}
    </div>
  )
}

export function StatCard({ label, big, sub, tone = 'text-stone-900', icon }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4">
      <div className="flex items-center justify-between mb-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500">{label}</div>
        {icon}
      </div>
      <div className={`text-2xl font-extrabold tabular-nums leading-tight ${tone}`}>{big}</div>
      {sub && <div className="text-[11px] text-stone-500 mt-0.5">{sub}</div>}
    </div>
  )
}

export function SectionCard({ title, sub, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-200 ${className}`}>
      {(title || sub) && (
        <div className="px-5 pt-5 pb-3">
          <div className="font-bold text-stone-900">{title}</div>
          {sub && <div className="text-xs text-stone-500 mt-0.5">{sub}</div>}
        </div>
      )}
      <div className="px-5 pb-5">{children}</div>
    </div>
  )
}

export function Bar({ pct, color = 'bg-emerald-500', track = 'bg-stone-100', className = 'h-2' }) {
  return (
    <div className={`${track} rounded-full overflow-hidden ${className}`}>
      <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
    </div>
  )
}

export function Chip({ children, tone = 'emerald' }) {
  const tones = {
    emerald: 'bg-emerald-100 text-emerald-700',
    amber: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-800',
    stone: 'bg-stone-100 text-stone-600'
  }
  return <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${tones[tone] || tones.emerald}`}>{children}</span>
}

export function FarmSkeleton({ title = true }) {
  return (
    <div className="space-y-5 fade-in">
      {title && <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-2xl bg-stone-200 animate-pulse" /><div className="space-y-2"><div className="w-52 h-6 bg-stone-200 rounded animate-pulse" /><div className="w-72 h-3 bg-stone-200 rounded animate-pulse" /></div></div>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map(i => <div key={i} className="bg-white rounded-2xl border border-stone-200 p-5 h-24 animate-pulse" />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 h-72 animate-pulse" />
        <div className="bg-white rounded-2xl border border-stone-200 p-6 h-72 animate-pulse" />
      </div>
    </div>
  )
}

function AIStage({ s, idx }) {
  const child = (
    <span className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold border transition cursor-pointer ${
      idx <= 3 ? 'bg-violet-100 text-violet-800 border-violet-200' : 'bg-white text-stone-500 border-stone-200'}`}>
      <span className="text-sm">{s.icon}</span>{s.short}
    </span>
  )
  return <span onClick={() => window.dispatchEvent(new CustomEvent('chimavet-open-ai'))}>{child}</span>
}