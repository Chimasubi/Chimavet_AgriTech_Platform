import { Cpu, CloudRain, Sun, TrendingUp, Leaf } from 'lucide-react'

const stats = [
  { icon: CloudRain, label: 'Rainfall (7d)', val: '34 mm', color: 'from-blue-400 to-cyan-500' },
  { icon: Sun, label: 'Forecast', val: 'Sunny', color: 'from-amber-400 to-yellow-500' },
  { icon: TrendingUp, label: 'Yield Index', val: '+12%', color: 'from-emerald-400 to-green-500' },
  { icon: Leaf, label: 'Soil Health', val: 'Good', color: 'from-lime-400 to-emerald-500' }
]
const week = [
  { d: 'Mon', v: 70 }, { d: 'Tue', v: 55 }, { d: 'Wed', v: 80 },
  { d: 'Thu', v: 45 }, { d: 'Fri', v: 60 }, { d: 'Sat', v: 90 }, { d: 'Sun', v: 50 }
]

export default function SmartFarming() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><Cpu className="w-7 h-7 text-violet-600" /> Smart Farming Hub</h1>
        <p className="text-stone-600 text-sm">Insights, weather, and analytics for your farm</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-stone-200 p-5">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
              <s.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xs text-stone-500">{s.label}</div>
            <div className="text-2xl font-bold mt-1">{s.val}</div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-bold text-lg mb-4">Weekly Activity</h2>
        <div className="space-y-2">
          {week.map(d => (
            <div key={d.d} className="flex items-center gap-3">
              <div className="w-10 text-xs text-stone-600">{d.d}</div>
              <div className="flex-1 h-6 bg-stone-100 rounded-full overflow-hidden">
                <div className={`h-full flex items-center px-2 text-white text-[10px] font-bold ${d.v < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${d.v}%` }}>{d.v}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
