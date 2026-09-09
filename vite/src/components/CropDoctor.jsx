import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, Leaf, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { diagnoseCrop } from '../data/agents'

export default function CropDoctor() {
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [context, setContext] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef(null)

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setImage(f)
    const r = new FileReader()
    r.onload = () => setPreview(r.result)
    r.readAsDataURL(f)
    setResult(null)
  }

  const analyze = () => {
    if (!image) return
    setLoading(true)
    setTimeout(() => {
      setResult(diagnoseCrop({ filename: image.name, fileSize: image.size, context }))
      setLoading(false)
    }, 1200)
  }

  const sevColor = (s) => ({
    'Critical': 'border-red-500 bg-red-50',
    'High': 'border-orange-500 bg-orange-50',
    'Moderate': 'border-amber-500 bg-amber-50',
    'None': 'border-emerald-500 bg-emerald-50'
  })[s] || 'border-stone-300 bg-stone-50'

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Leaf className="w-7 h-7 text-emerald-600" /> Crop Doctor</h1>
        <p className="text-stone-600 text-sm">Upload a photo of your sick plant — AI will diagnose and recommend treatment</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Camera className="w-5 h-5" /> Upload Photo</h2>
          <div onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-stone-300 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 transition aspect-video flex flex-col items-center justify-center bg-stone-50 overflow-hidden">
            {preview ? <img src={preview} alt="crop" className="max-h-full max-w-full object-contain rounded-lg" /> : (
              <><Upload className="w-12 h-12 text-stone-400 mb-2" /><p className="font-medium text-stone-600">Click to upload</p><p className="text-xs text-stone-400 mt-1">JPG, PNG · clear close-up of affected leaf</p></>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} className="hidden" />
          {image && <div className="mt-2 text-xs text-stone-500">{image.name} · {(image.size / 1024).toFixed(0)} KB</div>}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Describe what you see (optional)</label>
            <textarea value={context} onChange={e => setContext(e.target.value)} placeholder="e.g. yellow spots on tomato leaves, started 3 days ago after rain..." rows={3} className="w-full px-3 py-2 border border-stone-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500" />
          </div>

          <button onClick={analyze} disabled={!image || loading} className="mt-4 w-full py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : <><Leaf className="w-4 h-4" /> Diagnose Crop</>}
          </button>
        </div>

        <div>
          {!result && !loading && (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-stone-500 h-full flex flex-col items-center justify-center">
              <Leaf className="w-16 h-16 text-stone-300 mb-3" />
              <p>Upload a photo and click <strong>Diagnose</strong></p>
              <p className="text-xs mt-1">Works best with clear, well-lit close-ups</p>
            </div>
          )}
          {result && (
            <div className={`bg-white rounded-2xl border-2 ${sevColor(result.severity)} p-6 fade-in`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{result.icon}</div>
                  <div>
                    <h2 className="font-bold text-xl">{result.name}</h2>
                    <div className="text-xs text-stone-500">Affects: {result.affected}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-stone-500">Confidence</div>
                  <div className="font-bold text-lg">{Math.round(result.confidence * 100)}%</div>
                </div>
              </div>
              <div className="mb-3">
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                  result.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                  result.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                  result.severity === 'Moderate' ? 'bg-amber-100 text-amber-700' :
                  'bg-emerald-100 text-emerald-700'}`}>
                  {result.severity === 'None' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                  Severity: {result.severity}
                </span>
              </div>
              <div className="mb-3">
                <div className="font-semibold text-sm mb-1">Symptoms</div>
                <ul className="text-sm text-stone-700 space-y-0.5">{result.symptoms.map((s, i) => <li key={i}>• {s}</li>)}</ul>
              </div>
              <div className="mb-3">
                <div className="font-semibold text-sm mb-1">Likely Cause</div>
                <p className="text-sm text-stone-700">{result.causes}</p>
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">Recommended Action</div>
                <ol className="text-sm text-stone-700 space-y-1 list-decimal list-inside">{result.treatment.map((t, i) => <li key={i}>{t}</li>)}</ol>
              </div>
              {result.severity === 'Critical' && <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-lg text-xs text-red-800">⚠️ Critical — act within 24-48 hours to prevent spread.</div>}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
