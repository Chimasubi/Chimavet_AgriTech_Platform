'use client'
import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, Loader2 } from 'lucide-react'
import { assistantReply, genericAi, getPhase } from '@/lib/farmData'
import { useFarm } from '@/lib/FarmContext'

export default function AIAssistant() {
  const { farm, aiOpen, openAI, closeAI } = useFarm()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bodyRef = useRef(null)

  const isOpen = open || aiOpen

  useEffect(() => {
    if (!farm) return
    if (msgs.length === 0) {
      const phase = getPhase(farm.farm.plantingDate)
      setTimeout(() => setMsgs([{ role: 'bot', text:
        `Habari, ${farm.farm.farmer}! 🧅 I'm ChimaAI — watching your entire ${farm.farm.cropLabel} operation (day ${phase.daysIn}, ${phase.label}).\n\nAsk me about soil, fertiliser, irrigation, pests, market prices, your budget, or type "taarifa" for a full farm briefing.`
      }]), 400)
    }
  }, [farm, msgs.length])

  useEffect(() => {
    const on = () => { openAI(); setOpen(true) }
    window.addEventListener('chimavet-open-ai', on)
    return () => window.removeEventListener('chimavet-open-ai', on)
  }, [openAI])

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [msgs, typing, isOpen])

  const send = () => {
    const q = input.trim()
    if (!q || typing) return
    setMsgs(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      const reply = farm ? assistantReply(q, farm) : genericAi(q)
      setMsgs(m => [...m, { role: 'bot', text: reply }])
      setTyping(false)
    }, 600)
  }

  return (
    <>
      <button onClick={() => { openAI(); setOpen(true) }} className="ai-float fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center ai-pulse hover:scale-110 transition" title="Ask Chimavet AI">
        <Sparkles className="w-7 h-7" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => { closeAI(); setOpen(false) }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col fade-in" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-yellow-400/30 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">ChimaAI Assistant</div>
                  <div className="text-[10px] text-emerald-100">{farm ? `Context: ${farm.farm.cropLabel} · Day ${getPhase(farm.farm.plantingDate).daysIn}` : 'Ask anything about farming'}</div>
                </div>
              </div>
              <button onClick={() => { closeAI(); setOpen(false) }} className="p-1 hover:bg-white/20 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {msgs.length === 0 && !typing && (
                <div className="text-center text-stone-500 text-sm py-10">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 text-emerald-300" />
                  <div>👋 Hi! I'm your ChimaAI.</div>
                  <div className="text-xs mt-1">Ask about your farm — soil, input, irrigation, pests, prices</div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-line ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>{m.text}</div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="px-4 py-2 bg-white border rounded-2xl rounded-bl-sm text-sm text-stone-400 flex items-center gap-2">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> thinking…
                  </div>
                </div>
              )}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={farm ? `Ask about ${farm.farm.cropLabel}…` : 'Ask about crops, livestock…'} className="flex-1 px-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
              <button onClick={send} className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}