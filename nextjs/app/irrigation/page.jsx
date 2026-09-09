'use client'
import { useState, useEffect } from 'react'
import { Droplets, Info, AlertTriangle, Thermometer } from 'lucide-react'

export default function IrrigationPage() {
  const [autoMode, setAutoMode] = useState(true)
  const [manualOverride, setManualOverride] = useState(false)
  const [isOn, setIsOn] = useState(true)
  const [sensor, setSensor] = useState({ moisture: 42, temp: 24, humidity: 58, flow: 2.4 })

  useEffect(() => {
    const t = setInterval(() => {
      setSensor(prev => {
        if (!autoMode || manualOverride) return prev
        const m = Math.max(20, Math.min(80, prev.moisture + (Math.random() - 0.5) * 3))
        if (!manualOverride) setIsOn(m < 45)
        return { ...prev, moisture: m }
      })
    }, 4000)
    return () => clearInterval(t)
  }, [autoMode, manualOverride])

  const moistureColor = sensor.moisture < 35 ? 'text-red-600' : sensor.moisture > 70 ? 'text-blue-600' : 'text-emerald-600'

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Droplets className="w-7 h-7 text-blue-600" /> Irrigation Control</h1>
        <p className="text-stone-600 text-sm">Smart watering with sensor-driven automation</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 mb-1">Soil Moisture</div>
          <div className="flex items-baseline gap-2">
            <div className={`text-3xl font-bold ${moistureColor}`}>{sensor.moisture.toFixed(0)}%</div>
            <div className="text-sm text-stone-500">{sensor.moisture < 35 ? 'Dry' : sensor.moisture > 70 ? 'Wet' : 'Optimal'}</div>
          </div>
          <div className="mt-3 h-2 bg-stone-100 rounded-full overflow-hidden">
            <div className={`h-full ${sensor.moisture < 35 ? 'bg-red-500' : sensor.moisture > 70 ? 'bg-blue-500' : 'bg-emerald-500'}`} style={{ width: `${sensor.moisture}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 mb-1 flex items-center gap-1"><Thermometer className="w-3 h-3" /> Temperature</div>
          <div className="text-3xl font-bold text-amber-600">{sensor.temp.toFixed(1)}°C</div>
          <div className="text-sm text-stone-500 mt-1">Air sensor</div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <div className="text-xs text-stone-500 mb-1">Water Flow</div>
          <div className="text-3xl font-bold text-cyan-600">{isOn ? sensor.flow.toFixed(1) : '0.0'} <span className="text-base text-stone-500">L/min</span></div>
          <div className="text-sm text-stone-500 mt-1">{isOn ? 'Active' : 'Idle'}</div>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg">System Mode</h2>
            <span className={`text-xs px-3 py-1 rounded-full ${autoMode ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{autoMode ? 'AUTOMATIC' : 'MANUAL'}</span>
          </div>
          <div className="space-y-3">
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${autoMode ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'}`}>
              <input type="radio" name="mode" checked={autoMode} onChange={() => { setAutoMode(true); setManualOverride(false) }} className="w-4 h-4 accent-emerald-600" />
              <div className="flex-1">
                <div className="font-semibold text-sm">🤖 Automatic (Sensor)</div>
                <div className="text-xs text-stone-500">Water based on soil moisture</div>
              </div>
            </label>
            <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer ${!autoMode ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200'}`}>
              <input type="radio" name="mode" checked={!autoMode} onChange={() => setAutoMode(false)} className="w-4 h-4 accent-emerald-600" />
              <div className="flex-1">
                <div className="font-semibold text-sm">👆 Manual</div>
                <div className="text-xs text-stone-500">You control when to water</div>
              </div>
            </label>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-bold text-lg mb-4">Main Valve</h2>
          <div className={`flex items-center justify-between p-4 rounded-xl ${isOn ? 'bg-emerald-50 border-2 border-emerald-500' : 'bg-stone-50 border-2 border-stone-200'}`}>
            <div>
              <div className="font-semibold">{isOn ? 'Watering' : 'Off'}</div>
              <div className="text-xs text-stone-500">{manualOverride ? 'Manual override active' : autoMode ? 'Auto-controlled' : 'Manual mode'}</div>
            </div>
            <button onClick={() => { setManualOverride(o => { const n = !o; setIsOn(n); return n }) }} className={`relative w-16 h-9 rounded-full transition ${isOn ? 'bg-emerald-500' : 'bg-stone-300'}`}>
              <div className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-all ${isOn ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
          {manualOverride && <div className="mt-3 text-xs text-amber-600 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Manual override disables automatic sensor control</div>}
        </div>
      </div>
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-2xl p-5 text-sm text-blue-900">
        <div className="font-semibold mb-1 flex items-center gap-2"><Info className="w-4 h-4" /> Sensor Feed (live)</div>
        Auto-refresh every 4s. In automatic mode, valve opens at &lt;45% moisture and closes at &gt;65%. Manual override temporarily disables automation.
      </div>
    </>
  )
}
