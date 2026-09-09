'use client'
import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { DEMO_FARM, daysInto, getPhase, OS_STAGES } from '@/lib/farmData'

const Ctx = createContext(null)

export function FarmProvider({ children }) {
  const [farm, setFarmRaw] = useState(() => structuredClone(DEMO_FARM))
  const [aiOpen, setAiOpen] = useState(false)

  useEffect(() => {
    try {
      const s = localStorage.getItem('chimavet-farm')
      if (s) setFarmRaw(JSON.parse(s))
    } catch {}
  }, [])

  const set = useCallback((patch) => {
    setFarmRaw(prev => {
      if (!prev) return prev
      // merge nested keys (farm.*, soilTest.*, irrigation.*) shallowly
if (typeof patch === 'function') return patch(prev)
      const next = { ...prev }
      for (const k of Object.keys(patch)) {
        if (k === 'farm' && patch.farm) next.farm = { ...next.farm, ...patch.farm }
        else if (k === 'soilTest' && patch.soilTest) next.soilTest = { ...next.soilTest, ...patch.soilTest }
        else if (k === 'irrigation' && patch.irrigation) next.irrigation = { ...next.irrigation, ...patch.irrigation }
        else next[k] = patch[k]
      }
      return next
    })
  }, [])

  useEffect(() => {
    if (farm) { try { localStorage.setItem('chimavet-farm', JSON.stringify(farm)) } catch {} }
  }, [farm])

  const reset = useCallback(() => {
    const d = structuredClone(DEMO_FARM)
    setFarmRaw(d)
    try { localStorage.setItem('chimavet-farm', JSON.stringify(d)) } catch {}
  }, [])

  const openAI = useCallback(() => setAiOpen(true), [])
  const closeAI = useCallback(() => setAiOpen(false), [])

  const phase = farm ? getPhase(farm.farm.plantingDate) : null
  const stageIndex = Math.min(OS_STAGES.length - 1, phase ? (1 + phase.index) : 0)

  return (
    <Ctx.Provider value={{ farm, set, reset, aiOpen, openAI, closeAI, phase, stageIndex, daysIn: farm ? daysInto(farm.farm.plantingDate) : 0 }}>
      {children}
    </Ctx.Provider>
  )
}

export const useFarm = () => useContext(Ctx)