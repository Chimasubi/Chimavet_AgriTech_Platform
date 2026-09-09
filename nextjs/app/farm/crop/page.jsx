'use client'
import { useState, useRef } from 'react'
import { Sprout, CheckCircle2, Camera, Upload, Loader2, Leaf, AlertTriangle, CalendarPlus } from 'lucide-react'
import { useFarm } from '@/lib/FarmContext'
import { PHASES, getPhase, yieldForecast, pestAlerts } from '@/lib/farmData'
import { diagnoseCrop } from '@/lib/agents'
import { PageHead, SectionCard, Chip, Bar } from '@/components/FarmUI'
import { TSh } from '@/lib/data'

export default function CropPage() {
  const { farm, set, phase } = useFarm()
  const [logNote, setLogNote] = useState('')
  const [logCost, setLogCost] = useState('')
  const [report, setReport] = useState(null)
  const [preview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const fileRef = useRef(null)
  if (!farm) return null

  const done = farm.tasksDone?.[phase.key] || []
  const yieldKg = yieldForecast(farm.farm.areaHa, farm.health)
  const alerts = pestAlerts(farm)

  const toggle = (i) => {
    const list = farm.tasksDone?.[phase.key] || []
    const next = list.includes(i) ? list.filter(x => x !== i) : [...list, i]
    set({ tasksDone: { ...farm.tasksDone, [phase.key]: next } })
  }

  const addLog = (e) => {
    e.preventDefault()
    if (!logNote.trim()) return
    set({ cropLog: [...farm.cropLog, { id: Date.now(), date: new Date().toISOString().split('T')[0], stage: phase.key, action: logNote.trim(), cost: Number(logCost) || 0 }] })
    setLogNote(''); setLogCost('')
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f); setReport(null)
    const r = new FileReader()
    r.onload = () => setPreview(r.result)
    r.readAsDataURL(f)
  }

  const analyze = async () => {
    if (!file) return
    setAnalyzing(true)
    await new Promise(r => setTimeout(r, 500))
    const res = diagnoseCrop({ filename: file.name, fileSize: file.size, context: `${farm.farm.cropLabel} ${phase.label}` })
    setReport(res)
    set({ health: [...farm.health, { id: Date.now(), date: new Date().toISOString().split('T')[0], diagnosis: res.name, severity: res.severity, confidence: res.confidence, note: file.name, treatment: res.treatment }] })
    setAnalyzing(false)
  }

  const sevTone = { Critical: 'red', High: 'amber', Moderate: 'blue', None: 'emerald' }

  return (
    <>
      <PageHead icon={Sprout} bg="bg-gradient-to-br from-emerald-600 to-green-500" title="Production"
        sub="Every stage logged — every decision recorded" />

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2">
          <SectionCard title={`${phase.icon} Current phase — ${phase.label}`} sub={`Day ${phase.daysIn} · Phase target reached when next phase begins. Every tick becomes intelligence for ChimaAI.`}>
            <div className="flex items-center gap-3 mb-4">
              <Bar pct={phase.pct} className="h-3" color={phase.critical ? 'bg-gradient-to-r from-amber-500 to-emerald-500' : 'bg-emerald-600'} />
              <span className="text-xs font-bold text-emerald-700 tabular-nums">{Math.round(phase.pct)}%</span>
            </div>
            <p className="text-sm text-stone-600 mb-1">{phase.desc}</p>
            <p className="text-[11px] text-stone-400 mb-4">{phase.daysLabel} window</p>

            <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Phase tasks</div>
            <div className="space-y-2">
              {phase.tasks.map((t, i) => {
                const isDone = done.includes(i)
                return (
                  <button key={i} onClick={() => toggle(i)} className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition ${isDone ? 'border-emerald-200 bg-emerald-50/70' : 'border-stone-200 hover:border-emerald-400 hover:bg-emerald-50/40'}`}>
                    <span className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 ${isDone ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-300'}`}>{isDone && <CheckCircle2 className="w-3.5 h-3.5" />}</span>
                    <span className={`text-sm ${isDone ? 'text-stone-400 line-through' : 'text-stone-700'}`}>{t}</span>
                  </button>
                )
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-stone-200">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-2">Field log</div>
              <form onSubmit={addLog} className="flex flex-col sm:flex-row gap-2 mb-3">
                <input value={logNote} onChange={e => setLogNote(e.target.value)} placeholder="e.g. sprayed thrips, day 60" className="flex-1 px-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
                <input value={logCost} onChange={e => setLogCost(e.target.value)} type="number" min="0" placeholder="Cost TSh (opt)" className="sm:w-40 px-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold flex items-center gap-1.5"><CalendarPlus className="w-4 h-4" /> Log</button>
              </form>
              <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                {[...farm.cropLog].reverse().map(l => (
                  <li key={l.id} className="flex items-center gap-2 text-xs text-stone-600 py-1 border-b border-stone-100 last:border-0">
                    <span className="text-stone-300">{['nursery', 'transplant', 'vegetative', 'bulbInit', 'bulbSwell'].find(k => k === l.stage) ? PHASES.find(p => p.key === l.stage)?.icon || '•' : '•'}</span>
                    <span className="flex-1">{l.action}</span>
                    {l.cost > 0 && <span className="font-semibold tabular-nums text-emerald-700">{TSh(l.cost)}</span>}
                    <span className="text-stone-400 w-20 text-right">{new Date(l.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                  </li>
                ))}
              </ul>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Crop Doctor" sub="Photo diagnosis — logged to farm health">
            <div onClick={() => fileRef.current?.click()} className="border-2 border-dashed border-stone-300 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-500 transition bg-stone-50 overflow-hidden aspect-video flex flex-col items-center justify-center">
              {preview ? <img src={preview} alt="crop" className="max-h-full max-w-full object-contain rounded-lg" /> : (
                <>
                  <Upload className="w-8 h-8 text-stone-400 mb-1.5" />
                  <p className="font-medium text-stone-600 text-sm">Photo of a leaf / bulb issue</p>
                  <p className="text-[11px] text-stone-400">context: {farm.farm.cropLabel} · {phase.label}</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
            <button onClick={analyze} disabled={!file || analyzing} className="mt-3 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2 disabled:bg-stone-300">
              {analyzing ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</> : <><Camera className="w-4 h-4" /> Diagnose</>}
            </button>
            {report && (
              <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-sm fade-in">
                <div className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 ${report.severity === 'None' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                  {report.severity === 'None' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />} {report.name} · {(report.confidence * 100).toFixed(0)}%
                </div>
                <ul className="text-xs text-stone-600 space-y-1">{report.treatment.slice(0, 2).map((t, i) => <li key={i}>• {t}</li>)}</ul>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Health timeline" sub={`${farm.health.length} events logged`}>
            {farm.health.length === 0 ? (
              <div className="text-center text-stone-500 text-sm py-6"><Leaf className="w-8 h-8 mx-auto mb-2 text-emerald-400" />No issues logged — stays healthy!</div>
            ) : (
              <ul className="space-y-2">
                {[...farm.health].reverse().slice(0, 4).map(h => (
                  <li key={h.id} className="p-3 rounded-xl border border-stone-200">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-sm">{h.diagnosis}</span>
                      <Chip tone={sevTone[h.severity] || 'stone'}>{h.severity}</Chip>
                    </div>
                    <div className="text-xs text-stone-500">{new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · confidence {(h.confidence * 100).toFixed(0)}%</div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 pt-3 border-t border-stone-200">
              <div className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-1.5">Projected yield</div>
              <div className="text-2xl font-extrabold text-emerald-700 tabular-nums">{(yieldKg / 1000).toFixed(1)} t</div>
              <div className="text-[11px] text-stone-500">across {farm.farm.areaHa} ha · drags down with every critical diagnosis</div>
            </div>
          </SectionCard>
        </div>
      </div>

      <SectionCard title="Full onion season" sub="Scroll the phases — completed ones show your logged history">
        <div className="space-y-2.5">
          {PHASES.map(p => {
            const phDone = p.range[1] < phase.daysIn
            const isCurrent = p.key === phase.key
            const tasksDoneCount = (farm.tasksDone?.[p.key] || []).length
            return (
              <div key={p.key} className={`rounded-xl border p-3.5 ${isCurrent ? 'border-emerald-500 bg-emerald-50/50' : phDone ? 'border-stone-200 bg-stone-50/60' : 'border-stone-200'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${phDone ? 'bg-emerald-100' : isCurrent ? 'bg-emerald-600' : 'bg-stone-100'}`}>{phDone ? '✅' : p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className={`font-bold text-sm ${isCurrent ? 'text-emerald-900' : phDone ? 'text-stone-400' : 'text-stone-500'}`}>{p.label} {phDone && '· completed'}</div>
                    <div className="text-[11px] text-stone-500">{p.daysLabel} · <span className="tabular-nums">{tasksDoneCount}/{p.tasks.length}</span> tasks done</div>
                  </div>
                  {isCurrent && <Chip tone="emerald">DAY {phase.daysIn}</Chip>}
                </div>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </>
  )
}