import { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send } from 'lucide-react'
import { AI_RESPONSES } from '../data/catalog'

function aiAnswer(q) {
  const ql = q.toLowerCase()
  for (const k in AI_RESPONSES) if (ql.includes(k)) return AI_RESPONSES[k]
  if (ql.includes('hello') || ql.includes('hi')) return "Hello! How can I help your farm today?"
  if (ql.includes('thank')) return "You're welcome! Happy farming! 🌱"
  return "Good question! For specific advice, I'd recommend consulting your local agronomist or vet. I can help with: vaccines, irrigation, maize, chickens, cattle, goats, pests, soil, prices."
}

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState([])
  const [input, setInput] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [msgs, open])

  const send = () => {
    const q = input.trim()
    if (!q) return
    setMsgs(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTimeout(() => setMsgs(m => [...m, { role: 'bot', text: aiAnswer(q) }]), 500)
  }

  return (
    <>
      <button onClick={() => setOpen(true)}
        className="ai-float fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-emerald-600 text-white shadow-2xl flex items-center justify-center ai-pulse hover:scale-110 transition"
        title="Ask Chimavet AI">
        <Sparkles className="w-7 h-7" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col fade-in">
            <div className="p-4 border-b flex items-center justify-between bg-gradient-to-r from-emerald-700 to-emerald-600 text-white rounded-t-2xl">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-yellow-400/30 flex items-center justify-center"><Sparkles className="w-5 h-5" /></div>
                <div>
                  <div className="font-bold text-sm">Chimavet AI Assistant</div>
                  <div className="text-[10px] text-emerald-100">Ask anything about farming</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-white/20 rounded"><X className="w-5 h-5" /></button>
            </div>
            <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
              {msgs.length === 0 && (
                <div className="text-center text-stone-500 text-sm py-10">
                  <Sparkles className="w-10 h-10 mx-auto mb-2 text-emerald-300" />
                  <div>👋 Hi! I'm your Chimavet AI.</div>
                  <div className="text-xs mt-1">Try: "maize", "chicken", "irrigation", "vaccine"</div>
                </div>
              )}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about crops, livestock, irrigation..." className="flex-1 px-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
              <button onClick={send} className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
