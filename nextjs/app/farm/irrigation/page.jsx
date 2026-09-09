'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Droplets, Info, AlertTriangle, Thermometer, Wind } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { waterSchedule } from '@/lib/farmData'
import { PageHead, SectionCard, StatCard, Bar } from '@/components/FarmUI'
import { TSh } from '@/lib/data'

export default function IrrigationPage() {
  const { farm, phase } = useFarm()
  const [autoMode, setAutoMode] = useState(farm?.irrigation.autoMode ?? true)
  const [manualOverride, setManualOverride] = useState(false)
  const [isOn, setIsOn] = useState(false)
  const [sensor, setSensor] = useState({ moisture: 54, temp: 24.2, humidity: 58, flow: 2.4 })
  const [weeklyUsed, setWeeklyUsed] = useState(48000)

  const plan = farm ? waterSchedule(farm) : null
  const threshold = phase?.critical ? 48 : 44
  const active = autoMode && !manualOverride && isOn
  const costThisWeek = Math.round((weeklyUsed / 1000) * (farm?.irrigation.waterCostPerM3 ?? 220))

  useEffect(() => {
    const t = setInterval(() => {
      setSensor(prev => {
        const m = Math.max(15, Math.min(85, prev.moisture + (Math.random() - 0.5) * 3))
        const shouldRun = !manualOverride && autoMode && m < threshold
        setIsOn(shouldRun)
        if (shouldRun) setWeeklyUsed(w => w + prev.flow * 4)
        return { ...prev, moisture: m, temp: prev.temp + (Math.random() - 0.5) * 0.4, humidity: Math.max(40, Math.min(90, prev.humidity + (Math.random() - 0.5) * 2)) }
      })
    }, 4000)
    return () => clearInterval(t)
  }, [autoMode, manualOverride, threshold])

  if (!farm || !plan) return null

  const moistureColor = sensor.moisture < threshold - 6 ? 'text-red-600' : sensor.moisture > 68 ? 'text-blue-600' : 'text-emerald-600'
  const usedPct = (weeklyUsed / plan.weeklyLiters) * 100

  return (
    <>
      <PageHead icon={Droplets} bg="bg-gradient-to-br from-blue-400 to-cyan-500" title="Irrigation"
        sub={`Watering decided by the ${plan.phase.label} stage — not a fixed schedule`} />

      <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-emerald-50 border border-sky-200 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0"><Droplets className="w-5 h-5 text-white" /></div>
        <div className="text-sm text-stone-700">
          <span className="font-bold">This week's plan: </span>{plan.weeklyMm}mm over {farm.farm.areaHa} ha = <span className="font-extrabold text-emerald-700">{(plan.weeklyLiters / 1000).toLocaleString()}k litres</span> (~{plan.minutesPerDay} min/day drip).<br />
          <span className="text-xs text-stone-500">{plan.advice}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Soil Moisture" big={`${sensor.moisture.toFixed(0)}%`} tone={moistureColor} sub={sensor.moisture < threshold ? 'Below phase target' : 'Healthy for onion'} icon={<Droplets className="w-4 h-4 text-cyan-500" />} />
        <StatCard label="Temperature" big={`${sensor.temp.toFixed(1)}°C`} tone="text-amber-600" sub="Air sensor" icon={<Thermometer className="w-4 h-4 text-amber-500" />} />
        <StatCard label="Used this week" big={`${(weeklyUsed / 1000).toFixed(0)}k L`} tone={usedPct > 100 ? 'text-red-600' : 'text-emerald-700'} sub={`${Math.round(usedPct)}% of plan · ${TSh(costThisWeek)} cost`} icon={<Wind className="w-4 h-4 text-sky-500" />} />
        <StatCard label="Flow now" big={isOn ? `${sensor.flow.toFixed(1)} L/min` : '0.0 L/min'} tone={isOn ? 'text-cyan-600' : 'text-stone-400'} sub={isOn ? 'Valve open' : manualOverride ? 'Override: off' : 'Idle'} />
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        <SectionCard title="Water budget vs consumed" sub={`Target ${(plan.weeklyLiters / 1000).toLocaleString()}k L this week`}>
          <Bar pct={usedPct} color={usedPct > 100 ? 'bg-red-500' : 'bg-emerald-500'} className="h-3.5" />
          <div className="flex justify-between text-xs text-stone-500 mt-2">
            <span>{usedPct >= 100 ? 'Over target — onion dislikes waterlogging at bulb fill' : `${Math.max(0, Math.round(100 - usedPct))}% of budget left`}</span>
            <span className="tabular-nums">{TSh(costThisWeek)}</span>
          </div>
          <p className="text-xs text-stone-500 mt-4 leading-relaxed flex gap-1.5"><Info className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
            Threshold is <b>{threshold}% moisture</b> for the {plan.phase.label} stage. In critical bulb phases the system holds slightly more moisture to prevent split bulbs.
          </p>
        </SectionCard>

        <SectionCard title="System mode">
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${autoMode ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'}`}>
              <input type="radio" name="mode" checked={autoMode} onChange={() => { setAutoMode(true); setManualOverride(false) }} className="w-4 h-4 accent-emerald-600" />
              <div className="flex-1">
                <div className="font-semibold text-sm">🤖 Automatic (stage + sensor)</div>
                <div className="text-xs text-stone-500">Follows the onion growth plan</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${!autoMode ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'}`}>
              <input type="radio" name="mode" checked={!autoMode} onChange={() => setAutoMode(false)} className="w-4 h-4 accent-emerald-600" />
              <div className="flex-1">
                <div className="font-semibold text-sm">👆 Manual</div>
                <div className="text-xs text-stone-500">You decide when to water</div>
              </div>
            </label>
          </div>
          <div className={`mt-4 flex items-center justify-between p-4 rounded-xl ${isOn ? 'bg-emerald-50 border-2 border-emerald-500' : 'bg-stone-50 border-2 border-stone-200'}`}>
            <div>
              <div className="font-semibold">{isOn ? 'Watering' : 'Valve closed'}</div>
              <div className="text-xs text-stone-500">{manualOverride ? 'Manual override' : autoMode ? 'Auto-controlled by stage plan' : 'Manual mode'}</div>
            </div>
            <button onClick={() => { setManualOverride(o => { const n = !o; setIsOn(n); return n }) }} className={`relative w-16 h-9 rounded-full transition ${isOn ? 'bg-emerald-500' : 'bg-stone-300'}`}>
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-all ${isOn ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
          {manualOverride && <div className="mt-3 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Override disables the stage-based automatic schedule</div>}
        </SectionCard>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
        <div className="font-semibold mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Data flows onward</div>
        Every litre watered is metered and priced → it lands in <Link href="/farm/economics" className="font-bold underline underline-offset-2">Farm Economics</Link> as a water cost, and your moisture history informs ChimaAI's watering advice.
      </div>
    </>
  )
}