import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Globe, Send, Sparkles } from 'lucide-react'
import { VOICE_LANGS, getVoiceResponse } from '../data/agents'

export default function VoiceAssistant() {
  const [lang, setLang] = useState('sw-KE')
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [text, setText] = useState('')
  const [msgs, setMsgs] = useState([])
  const [supported, setSupported] = useState(true)
  const recRef = useRef(null)
  const bodyRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      setSupported(!!SR)
    }
  }, [])

  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [msgs])

  const speak = (txt) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(txt)
    u.lang = lang; u.rate = 0.95
    u.onstart = () => setSpeaking(true)
    u.onend = () => setSpeaking(false)
    window.speechSynthesis.speak(u)
  }
  const stopSpeak = () => { window.speechSynthesis.cancel(); setSpeaking(false) }

  const handle = (txt) => {
    const t = txt.trim()
    if (!t) return
    setMsgs(m => [...m, { role: 'user', text: t }])
    setText('')
    setTimeout(() => {
      const r = getVoiceResponse(t, lang)
      setMsgs(m => [...m, { role: 'bot', text: r.text }])
      speak(r.text)
    }, 400)
  }

  const startListen = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    const r = new SR()
    r.lang = lang; r.continuous = false; r.interimResults = false
    r.onresult = (e) => handle(e.results[0][0].transcript)
    r.onend = () => setListening(false)
    r.onerror = () => setListening(false)
    r.start()
    recRef.current = r
    setListening(true)
  }
  const stopListen = () => { recRef.current?.stop(); setListening(false) }

  return (
    <>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2"><Sparkles className="w-7 h-7 text-violet-600" /> Voice Assistant</h1>
          <p className="text-stone-600 text-sm">Speak in your language — get farming advice hands-free</p>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-stone-500" />
          <select value={lang} onChange={e => setLang(e.target.value)} className="px-3 py-1.5 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500">
            {VOICE_LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 flex flex-col h-[60vh]">
          <div ref={bodyRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50 rounded-t-2xl">
            {msgs.length === 0 && (
              <div className="text-center text-stone-500 text-sm py-10">
                <Mic className="w-12 h-12 mx-auto mb-2 text-violet-300" />
                <div className="font-medium">👋 Karibu! Welcome to Chimavet Voice</div>
                <div className="text-xs mt-2">Press the mic and speak, or type below</div>
                <div className="text-xs mt-3 text-stone-400">Try: "Bei ya mahindi" · "Mbuzi" · "Umwagiliaji"</div>
              </div>
            )}
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${m.role === 'user' ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border rounded-bl-sm'}`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t flex gap-2">
            <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handle(text)} placeholder={lang.startsWith('sw') ? 'Andika swali lako hapa...' : 'Type your question...'} className="flex-1 px-4 py-2 border border-stone-300 rounded-full text-sm focus:outline-none focus:border-emerald-500" />
            <button onClick={() => handle(text)} className="px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700"><Send className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={listening ? stopListen : startListen} disabled={!supported}
            className={`w-full aspect-square rounded-2xl text-white font-bold text-lg flex flex-col items-center justify-center gap-2 transition shadow-lg ${listening ? 'bg-red-500 animate-pulse' : 'bg-violet-600 hover:bg-violet-700'} ${!supported ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {listening ? <><MicOff className="w-16 h-16" /> Listening...</> : <><Mic className="w-16 h-16" /> {supported ? 'Tap to Speak' : 'Not Supported'}</>}
          </button>
          <button onClick={speaking ? stopSpeak : () => speak(msgs.filter(m => m.role === 'bot').pop()?.text || '')} className={`w-full py-3 rounded-xl font-medium flex items-center justify-center gap-2 ${speaking ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
            {speaking ? <><VolumeX className="w-4 h-4" /> Stop</> : <><Volume2 className="w-4 h-4" /> Replay</>}
          </button>
          <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 text-xs text-violet-900">
            <strong>Quick prompts:</strong>
            <div className="mt-2 space-y-1">
              {['Bei ya mahindi', 'Mbuzi', 'Umwagiliaji', 'Mbolea', 'Kuku'].map(p => (
                <button key={p} onClick={() => handle(p)} className="block w-full text-left px-2 py-1 hover:bg-violet-100 rounded">🎤 "{p}"</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
