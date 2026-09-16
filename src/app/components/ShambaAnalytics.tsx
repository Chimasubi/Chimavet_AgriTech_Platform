import { useState } from "react";
import { BarChart3, Map, Crosshair, TrendingUp, Droplets, Coins, Wheat, Leaf, Sun, Thermometer, Cloud, Sprout, ArrowUpRight, Target, CalendarClock } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "motion/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line } from "recharts";

const revenueTrend = [
  { month: "Apr", produce: 12, revenue: 18 },
  { month: "May", produce: 18, revenue: 26 },
  { month: "Jun", produce: 22, revenue: 32 },
  { month: "Jul", produce: 27, revenue: 41 },
  { month: "Aug", produce: 31, revenue: 47 },
  { month: "Sep", produce: 34, revenue: 52 },
];

const yieldByCrop = [
  { crop: "Maize", yield: 32 },
  { crop: "Rice", yield: 28 },
  { crop: "Beans", yield: 18 },
  { crop: "Tomatoes", yield: 24 },
  { crop: "Peppers", yield: 20 },
];

const marketIndex = [
  { crop: "White Maize", market: "Kilosa / Morogoro", price: "TSh 68,000", change: "+3.2%" },
  { crop: "Paddy Rice (Kyela Super)", market: "Mbeya Market", price: "TSh 145,000", change: "+1.8%" },
  { crop: "Dry Beans (Rosecoco)", market: "Arusha Wholesale", price: "TSh 210,000", change: "-0.5%" },
  { crop: "Sunflower Seeds", market: "Dodoma Kibaigwa", price: "TSh 95,000", change: "+4.1%" },
];

const plots = [
  {
    id: 1,
    name: "Kilombero Paddy Field",
    crop: "Rice & Maize",
    area: "5.0 Acres",
    location: "Morogoro",
    phase: "Vegetative",
    phaseProgress: 62,
    health: 88,
    sensors: { moisture: 72, temp: 26.4, humidity: 68, light: 880 },
  },
  {
    id: 2,
    name: "Arusha Horticulture Orchard",
    crop: "French Beans & Tomatoes",
    area: "2.5 Acres",
    location: "Arusha",
    phase: "Flowering",
    phaseProgress: 74,
    health: 81,
    sensors: { moisture: 48, temp: 24.1, humidity: 71, light: 1020 },
  },
  {
    id: 3,
    name: "Morogoro Greenhouse",
    crop: "Sweet Peppers & Capsicum",
    area: "1,200 sq meters",
    location: "Morogoro",
    phase: "Fruiting",
    phaseProgress: 86,
    health: 93,
    sensors: { moisture: 84, temp: 27.9, humidity: 74, light: 940 },
  },
  {
    id: 4,
    name: "Kyela Paddy Basin",
    crop: "Aromatic Rice",
    area: "8.0 Acres",
    location: "Mbeya",
    phase: "Tiller",
    phaseProgress: 48,
    health: 76,
    sensors: { moisture: 79, temp: 25.2, humidity: 73, light: 760 },
  },
];

function SensorBar({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Icon className={`w-3.5 h-3.5 ${color}`} /> {label}
        </span>
        <span className="text-slate-900 font-mono">{value}{unit}</span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

export function ShambaAnalytics() {
  const [view, setView] = useState<"macro" | "micro">("macro");
  const [selectedPlot, setSelectedPlot] = useState(plots[0]);

  const insights = [
    "Rain likely in 3h across Morogoro — smart irrigation paused (320L saved).",
    "Maize (Kilosa) reached tasseling ~2 weeks early; monitor for fall armyworm.",
    "Tomato plot flowering ratio is optimal — apply foliar calcium booster.",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-950 via-indigo-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-violet-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 mb-2 backdrop-blur-md px-3 py-1">
              📊 Farm Intelligence Console
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Shamba Analytics Dashboard</h1>
            <p className="text-violet-100 text-sm mt-1 max-w-xl">
              MACRO whole-farm economics &amp; MICRO per-plot crop intelligence for informed decisions.
            </p>
          </div>

          <div className="flex bg-black/20 p-1 rounded-xl w-fit">
            <button
              onClick={() => setView("macro")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === "macro" ? "bg-white text-indigo-900 shadow-xs" : "text-violet-200"
              }`}
            >
              <Map className="w-4 h-4" /> MACRO
            </button>
            <button
              onClick={() => setView("micro")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === "micro" ? "bg-white text-indigo-900 shadow-xs" : "text-violet-200"
              }`}
            >
              <Crosshair className="w-4 h-4" /> MICRO
            </button>
          </div>
        </div>
      </div>

      {view === "macro" ? (
        <>
          {/* Macro KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <Card className="p-5 border-l-4 border-l-indigo-500 bg-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Projected Farm Value</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">TSh 52M</h3>
                <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last season
                </p>
              </div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Coins className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 border-l-4 border-l-emerald-500 bg-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Active Irrigated Acres</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">17.5 Ac</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">across 4 field plots</p>
              </div>
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Sprout className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 border-l-4 border-l-cyan-500 bg-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Water Conserved</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">1,240L</h3>
                <p className="text-[11px] text-cyan-600 font-bold mt-0.5">via smart actuation</p>
              </div>
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
                <Droplets className="w-6 h-6" />
              </div>
            </Card>

            <Card className="p-5 border-l-4 border-l-amber-500 bg-white flex items-center justify-between shadow-sm">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase">Crop Health Index</span>
                <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">84.5</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Excellent · harvested 38%</p>
              </div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Target className="w-6 h-6" />
              </div>
            </Card>
          </div>

          {/* Revenue & Yield Charts */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-bold text-slate-900">Produce Output &amp; Revenue Trajectory</h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" name="Revenue (TSh M)" stroke="#6366f1" strokeWidth={3} fill="url(#rev)" />
                  <Area type="monotone" dataKey="produce" name="Produce (Tons)" stroke="#10b981" strokeWidth={3} fill="url(#prod)" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 className="w-5 h-5 text-violet-600" />
                <h2 className="text-lg font-bold text-slate-900">Yield by Crop (Bags/Acre)</h2>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={yieldByCrop}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="crop" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="yield" name="Yield (bags/ac)" fill="#7c3aed" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Market Board + Insights */}
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Wheat className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold text-slate-900">Live Wholesale Market Index (TSh)</h2>
              </div>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] uppercase text-slate-500 border-b border-slate-200">
                      <th className="py-2.5 pr-4 font-bold">Crop</th>
                      <th className="py-2.5 pr-4 font-bold">Market</th>
                      <th className="py-2.5 pr-4 font-bold">Price</th>
                      <th className="py-2.5 font-bold text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {marketIndex.map((row) => (
                      <tr key={row.crop} className="border-b border-slate-100 last:border-0">
                        <td className="py-3 pr-4 font-bold text-slate-900">{row.crop}</td>
                        <td className="py-3 pr-4 text-slate-600 text-xs">{row.market}</td>
                        <td className="py-3 pr-4 font-mono font-bold text-slate-900">{row.price}</td>
                        <td className={`py-3 text-right font-bold text-xs ${row.change.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                          {row.change}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-b from-violet-50 to-white border-violet-200/70">
              <div className="flex items-center gap-2 mb-4">
                <CalendarClock className="w-5 h-5 text-violet-700" />
                <h2 className="text-lg font-bold text-slate-900">Season Insights</h2>
              </div>
              <div className="space-y-3">
                {insights.map((tip, i) => (
                  <div key={i} className="p-3 bg-white rounded-2xl border border-violet-100 text-xs text-slate-700 leading-relaxed shadow-sm">
                    <span className="text-violet-600 font-bold mr-1">•</span> {tip}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Plot Selector */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {plots.map((plot) => (
              <Card
                key={plot.id}
                className={`p-5 rounded-3xl cursor-pointer transition-all ${
                  selectedPlot.id === plot.id
                    ? "border-2 border-indigo-600 shadow-lg"
                    : "border-slate-200/80 hover:border-indigo-300"
                }`}
                onClick={() => setSelectedPlot(plot)}
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-indigo-100 text-indigo-800 border-none">{plot.crop}</Badge>
                  <Leaf className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{plot.name}</h3>
                <p className="text-[11px] text-slate-500 font-medium mt-1">{plot.location} · {plot.area}</p>
                <div className="mt-3 flex items-center justify-between text-xs font-bold">
                  <span className="text-slate-600">Health</span>
                  <span className={plot.health >= 85 ? "text-emerald-600" : plot.health >= 70 ? "text-amber-600" : "text-red-500"}>
                    {plot.health}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-1">
                  <div
                    className={`h-full rounded-full ${plot.health >= 85 ? "bg-emerald-500" : plot.health >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${plot.health}%` }}
                  />
                </div>
              </Card>
            ))}
          </div>

          {/* Selected Plot Detail */}
          <motion.div
            key={selectedPlot.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <Card className="lg:col-span-2 p-6 border-t-4 border-t-indigo-600 rounded-3xl">
              <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                <div>
                  <Badge className="bg-violet-100 text-violet-800 border-none mb-2">MICRO · Plot Detail</Badge>
                  <h2 className="text-2xl font-extrabold text-slate-900">{selectedPlot.name}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {selectedPlot.crop} · {selectedPlot.location} · {selectedPlot.area}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Crop Phase</p>
                  <p className="text-sm font-bold text-indigo-700">{selectedPlot.phase} · {selectedPlot.phaseProgress}%</p>
                </div>
              </div>

              {/* Micro sensors */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <SensorBar label="Soil Moisture" value={selectedPlot.sensors.moisture} unit="%" icon={Droplets} color="text-cyan-600 bg-cyan-600" />
                <SensorBar label="Soil Temp" value={selectedPlot.sensors.temp} unit="°C" icon={Thermometer} color="text-rose-500 bg-rose-500" />
                <SensorBar label="Air Humidity" value={selectedPlot.sensors.humidity} unit="%" icon={Cloud} color="text-violet-600 bg-violet-600" />
                <SensorBar label="Light Intensity" value={selectedPlot.sensors.light} unit="lux" icon={Sun} color="text-amber-500 bg-amber-500" />
              </div>

              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Plot Moisture Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={[
                  { time: "02:00", m: 76 }, { time: "06:00", m: 72 }, { time: "10:00", m: 68 },
                  { time: "14:00", m: 61 }, { time: "18:00", m: 65 }, { time: "22:00", m: 70 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} domain={[40, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="m" name="Moisture (%)" stroke="#0891b2" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Health + recommendations */}
            <Card className="p-6 border-t-4 border-t-emerald-500 rounded-3xl flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-4">Crop Health</h3>
                <div className="text-center mb-5">
                  <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                      <span className={`text-3xl font-black ${selectedPlot.health >= 85 ? "text-emerald-600" : "text-amber-500"}`}>
                        {selectedPlot.health}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold mt-2">
                    {selectedPlot.health >= 85 ? "Excellent canopy condition" : "Needs attention"}
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    { icon: Target, label: `Fertilizer: ${selectedPlot.health >= 85 ? "On track" : "Top-dress due"}`, color: "text-indigo-600 bg-indigo-50" },
                    { icon: Droplets, label: `Next irrigation: ${selectedPlot.sensors.moisture < 55 ? "ASAP" : "schedule"}$`, color: "text-cyan-600 bg-cyan-50" },
                    { icon: Sprout, label: "Intercrop: companion plants", color: "text-green-600 bg-green-50" },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <div key={i} className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-slate-700 ${item.color}`}>
                        <Icon className="w-4 h-4" /> {item.label}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800">💡 ChimaAI Advisory:</span>{" "}
                {selectedPlot.sensors.moisture < 55
                  ? `Soil moisture dropping — consider irrigating ${selectedPlot.name} within 6h to protect flowering.`
                  : `${selectedPlot.crop} entering ${selectedPlot.phase.toLowerCase()} stage; maintain current moisture band for optimal yield.`}
              </div>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
}