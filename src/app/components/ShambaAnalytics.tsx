import { useState } from "react";
import { BarChart3, Map, Crosshair, TrendingUp, Droplets, Coins, Wheat, Leaf, Sun, Thermometer, Cloud, Sprout, ArrowUpRight, Target, CalendarClock, Activity, CheckCircle2, MapPin, CloudRain, ShieldAlert, Sparkles } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, ReferenceLine } from "recharts";
import { ChartTooltip, ChartLegend } from "./ui/chart-tooltip";
import { useCountUp } from "./ui/useCountUp";
import { cn } from "./ui/utils";

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

const insights = [
  {
    icon: CloudRain,
    title: "Weather window",
    text: "Rain likely in 3h across Morogoro — smart irrigation paused (320L saved).",
  },
  {
    icon: ShieldAlert,
    title: "Pest watch",
    text: "Maize (Kilosa) reached tasseling ~2 weeks early; monitor for fall armyworm.",
  },
  {
    icon: Sprout,
    title: "Nutrition",
    text: "Tomato plot flowering ratio is optimal — apply foliar calcium booster.",
  },
];

const healthTint = (h: number) =>
  h >= 85
    ? { ring: "#10b981", text: "text-emerald-600", label: "Excellent canopy condition" }
    : h >= 70
    ? { ring: "#f59e0b", text: "text-amber-500", label: "Needs attention" }
    : { ring: "#ef4444", text: "text-red-500", label: "Critical — intervene now" };

function SensorBar({ label, value, unit, icon: Icon, color }: any) {
  return (
    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
        <span className="flex items-center gap-1.5 text-slate-600">
          <Icon className={cn("w-3.5 h-3.5", color.split(" ")[0])} /> {label}
        </span>
        <span className="text-slate-900 font-mono">
          {value}
          {unit}
        </span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full", color.split(" ")[1])}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, value)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function KpiCard({ icon: Icon, tint, value, decimals, suffix, label, caption }: any) {
  const n = useCountUp(value, 900, decimals);
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }}>
      <Card className={cn("p-5 border-l-4 border-slate-200/70 shadow-sm h-full bg-white", tint.border)}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {n.toFixed(decimals)}
              {suffix}
            </h3>
            <p className={cn("text-[11px] font-bold mt-1 flex items-center gap-1", tint.text)}>{caption}</p>
          </div>
          <div className={cn("p-3 rounded-2xl", tint.bg, tint.text)}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export function ShambaAnalytics() {
  const [view, setView] = useState<"macro" | "micro">("macro");
  const [selectedPlot, setSelectedPlot] = useState(plots[0]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-950 via-green-800 to-green-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-green-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2 backdrop-blur-md px-3 py-1">
              📊 Farm Intelligence Console
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Shamba Analytics Dashboard</h1>
            <p className="text-green-100 text-sm mt-1 max-w-xl">
              MACRO whole-farm economics &amp; MICRO per-plot crop intelligence for informed decisions.
            </p>
          </div>

          <div className="flex bg-black/20 p-1 rounded-xl w-fit">
            <button
              onClick={() => setView("macro")}
              aria-pressed={view === "macro"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                view === "macro" ? "bg-white text-green-900 shadow-xs" : "text-green-200 hover:bg-white/10"
              )}
            >
              <Map className="w-4 h-4" /> MACRO
            </button>
            <button
              onClick={() => setView("micro")}
              aria-pressed={view === "micro"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                view === "micro" ? "bg-white text-green-900 shadow-xs" : "text-green-200 hover:bg-white/10"
              )}
            >
              <Crosshair className="w-4 h-4" /> MICRO
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.3 }}
        >
          {view === "macro" ? (
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              animate="show"
            >
              {/* Macro KPI Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                <KpiCard
                  icon={Coins}
                  tint={{ border: "border-l-4 border-l-green-500", bg: "bg-green-50", text: "text-green-600" }}
                  value={52}
                  decimals={0}
                  suffix="M"
                  label="Projected Farm Value"
                  caption={<><ArrowUpRight className="w-3.5 h-3.5" /> +12% vs last season</>}
                />
                <KpiCard
                  icon={Sprout}
                  tint={{ border: "border-l-4 border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" }}
                  value={17.5}
                  decimals={1}
                  suffix=" Ac"
                  label="Active Irrigated Acres"
                  caption="across 4 field plots"
                />
                <KpiCard
                  icon={Droplets}
                  tint={{ border: "border-l-4 border-l-cyan-500", bg: "bg-cyan-50", text: "text-cyan-600" }}
                  value={1240}
                  decimals={0}
                  suffix="L"
                  label="Water Conserved"
                  caption="via smart actuation"
                />
                <KpiCard
                  icon={Target}
                  tint={{ border: "border-l-4 border-l-amber-500", bg: "bg-amber-50", text: "text-amber-600" }}
                  value={84.5}
                  decimals={1}
                  suffix=""
                  label="Crop Health Index"
                  caption="Excellent · harvested 38%"
                />
              </div>

              {/* Revenue & Yield Charts */}
              <div className="grid lg:grid-cols-2 gap-8 mb-8">
                <Card className="p-6 border-slate-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" /> Produce Output &amp; Revenue
                    </h2>
                    <ChartLegend
                      items={[
                        { name: "Revenue (TSh M)", color: "#16a34a" },
                        { name: "Produce (Tons)", color: "#10b981" },
                      ]}
                    />
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <AreaChart data={revenueTrend}>
                      <defs>
                        <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="prod" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <ReferenceLine y={60} stroke="#16a34a" strokeDasharray="4 4" strokeOpacity={0.4} />
                      <Area type="monotone" dataKey="revenue" name="Revenue (TSh M)" stroke="#16a34a" strokeWidth={3} fill="url(#rev)" activeDot={{ r: 5 }} />
                      <Area type="monotone" dataKey="produce" name="Produce (Tons)" stroke="#10b981" strokeWidth={3} fill="url(#prod)" activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-[11px] text-slate-400 font-semibold mt-2">· Dashed line: TSh 60M season target</p>
                </Card>

                <Card className="p-6 border-slate-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-600" /> Yield by Crop
                    </h2>
                    <ChartLegend items={[{ name: "Bags / Acre", color: "#16a34a" }]} />
                  </div>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={yieldByCrop}>
                      <defs>
                        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#16a34a" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="crop" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(22,163,74,0.06)" }} />
                      <Bar dataKey="yield" name="Yield (bags/ac)" fill="url(#barGrad)" radius={[8, 8, 0, 0]} maxBarSize={46} />
                    </BarChart>
                  </ResponsiveContainer>
                  <p className="text-[11px] text-slate-400 font-semibold mt-2">· Top performer: Maize (32 bags/acre)</p>
                </Card>
              </div>

              {/* Market Board + Insights */}
              <div className="grid lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-6 border-slate-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Wheat className="w-5 h-5 text-amber-600" /> Live Wholesale Market Index
                    </h2>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                      <Activity className="w-3.5 h-3.5 animate-pulse" /> Live
                    </span>
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
                          <tr key={row.crop} className="border-b border-slate-50 last:border-0 hover:bg-green-50/40 transition-colors">
                            <td className="py-3 pr-4 font-bold text-slate-900">{row.crop}</td>
                            <td className="py-3 pr-4 text-slate-600 text-xs">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" /> {row.market}
                              </span>
                            </td>
                            <td className="py-3 pr-4">
                              <span className="font-mono font-bold text-slate-900 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                                {row.price}
                              </span>
                            </td>
                            <td className="py-3 text-right">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-0.5 text-xs font-bold rounded-full px-2 py-1",
                                  row.change.startsWith("+")
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-600"
                                )}
                              >
                                <ArrowUpRight className={cn("w-3 h-3", row.change.startsWith("+") && "rotate-0")} />
                                {row.change}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold mt-3">
                    Source: Kibaigwa · Kibaha · Mbeya STS — synced 09:41
                  </p>
                </Card>

                <Card className="p-6 bg-gradient-to-b from-green-50 to-white border-green-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-green-700" />
                    <h2 className="text-lg font-bold text-slate-900">ChimaAI Season Insights</h2>
                  </div>
                  <div className="space-y-3">
                    {insights.map((tip, i) => {
                      const Icon = tip.icon;
                      return (
                        <motion.div
                          key={i}
                          variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                          transition={{ delay: i * 0.08 }}
                          className="p-3 bg-white rounded-2xl border border-green-100 text-xs text-slate-700 leading-relaxed shadow-sm"
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center flex-shrink-0">
                              <Icon className="w-4 h-4 text-green-700" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-[11px] uppercase tracking-wide mb-0.5 flex items-center gap-1.5">
                                {tip.title}
                                <span className="text-slate-300 font-mono">0{i + 1}</span>
                              </p>
                              <p>{tip.text}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <div className="mt-4 pt-3 border-t border-green-100 text-[10px] text-green-700 font-bold flex items-center gap-1.5">
                    <CalendarClock className="w-3.5 h-3.5" /> 3 actionable insights this week
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              animate="show"
            >
              {/* Plot Selector */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {plots.map((plot) => {
                  const tint = healthTint(plot.health);
                  return (
                    <motion.div
                      key={plot.id}
                      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                      whileHover={{ y: -4 }}
                    >
                      <Card
                        className={cn(
                          "p-5 rounded-3xl cursor-pointer transition-all relative border-slate-200/70 shadow-sm h-full",
                          selectedPlot.id === plot.id ? "border-2 border-green-600 shadow-lg" : "hover:border-green-300"
                        )}
                        onClick={() => setSelectedPlot(plot)}
                      >
                        {selectedPlot.id === plot.id && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-green-100 text-green-800 border-none">{plot.crop}</Badge>
                          <Leaf className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="text-sm font-extrabold text-slate-900 leading-tight pr-6">{plot.name}</h3>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" /> {plot.location} · {plot.area}
                          </span>
                        </p>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="relative w-14 h-14 rounded-full" style={{ background: `conic-gradient(${tint.ring} ${plot.health * 3.6}deg, #e2e8f0 0deg)` }}>
                            <div className="absolute inset-1 rounded-full bg-white flex items-center justify-center">
                              <span className={cn("text-xs font-black", tint.text)}>{plot.health}%</span>
                            </div>
                          </div>
                          <div className="flex-1 ml-4">
                            <div className="flex justify-between text-[11px] text-slate-600 font-bold mb-1">
                              <span>Health</span>
                              <span className={cn("text-slate-500")}>{tint.label.split(" ")[0]}</span>
                            </div>
                            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                              <motion.div
                                className={cn("h-full rounded-full", plot.health >= 85 ? "bg-emerald-500" : plot.health >= 70 ? "bg-amber-500" : "bg-red-500")}
                                initial={{ width: 0 }}
                                animate={{ width: `${plot.health}%` }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                              />
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-2 flex items-center gap-1">
                              <Activity className="w-3 h-3" /> {plot.phase} · {plot.phaseProgress}%
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Selected Plot Detail */}
              <motion.div
                key={selectedPlot.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-3 gap-6"
              >
                <Card className="lg:col-span-2 p-6 border-t-4 border-t-green-600 rounded-3xl border-slate-200/70 shadow-sm">
                  <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
                    <div>
                      <Badge className="bg-green-100 text-green-800 border-none mb-2">MICRO · Plot Detail</Badge>
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedPlot.name}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {selectedPlot.crop} · {selectedPlot.location} · {selectedPlot.area}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold uppercase text-slate-500">Crop Phase</p>
                      <p className="text-sm font-bold text-green-700">{selectedPlot.phase} · {selectedPlot.phaseProgress}%</p>
                      <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                        <motion.div
                          className="h-full bg-green-600 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedPlot.phaseProgress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                        />
                      </div>
                      <p className="text-[11px] text-slate-400 font-semibold mt-1.5">26°C · Sunny · ~2.1 mm ETo</p>
                    </div>
                  </div>

                  {/* Micro sensors */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <SensorBar label="Soil Moisture" value={selectedPlot.sensors.moisture} unit="%" icon={Droplets} color="text-cyan-600 bg-cyan-600" />
                    <SensorBar label="Soil Temp" value={selectedPlot.sensors.temp} unit="°C" icon={Thermometer} color="text-rose-500 bg-rose-500" />
                    <SensorBar label="Air Humidity" value={selectedPlot.sensors.humidity} unit="%" icon={Cloud} color="text-green-600 bg-green-600" />
                    <SensorBar label="Light Intensity" value={selectedPlot.sensors.light} unit="lux" icon={Sun} color="text-amber-500 bg-amber-500" />
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600" /> Plot Moisture Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart
                      data={[
                        { time: "02:00", m: 76 },
                        { time: "06:00", m: 72 },
                        { time: "10:00", m: 68 },
                        { time: "14:00", m: 61 },
                        { time: "18:00", m: 65 },
                        { time: "22:00", m: 70 },
                      ]}
                    >
                      <defs>
                        <linearGradient id="mplot" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} domain={[40, 100]} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="m" name="Moisture (%)" stroke="#0891b2" strokeWidth={3} fill="url(#mplot)" activeDot={{ r: 5 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>

                {/* Health + recommendations */}
                <Card className="p-6 border-t-4 border-t-emerald-500 rounded-3xl border-slate-200/70 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-4">Crop Health</h3>
                    <div className="text-center mb-5">
                      <div
                        className="w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10"
                        style={{ background: `conic-gradient(${healthTint(selectedPlot.health).ring} ${selectedPlot.health * 3.6}deg, #e2e8f0 0deg)` }}
                      >
                        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center">
                          <CountRing value={selectedPlot.health} color={healthTint(selectedPlot.health).text} />
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 font-semibold mt-2">{healthTint(selectedPlot.health).label}</p>
                    </div>

                    <div className="space-y-2.5">
                      {[
                        { icon: Target, label: `Fertilizer: ${selectedPlot.health >= 85 ? "On track" : "Top-dress due"}`, tint: "bg-green-50 text-green-700" },
                        { icon: Droplets, label: `Next irrigation: ${selectedPlot.sensors.moisture < 55 ? "ASAP" : "scheduled"}`, tint: "bg-cyan-50 text-cyan-700" },
                        { icon: Sprout, label: "Intercrop: companion plants", tint: "bg-emerald-50 text-emerald-700" },
                      ].map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className={cn("flex items-center gap-2.5 p-3 rounded-xl text-xs font-bold text-slate-700", item.tint)}>
                            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                              <Icon className="w-4 h-4" />
                            </div>
                            {item.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-800">💡 ChimaAI Advisory:</span>{" "}
                    {selectedPlot.sensors.moisture < 55
                      ? `Soil moisture dropping — consider irrigating ${selectedPlot.name} within 6h to protect flowering.`
                      : `${selectedPlot.crop} entering ${selectedPlot.phase.toLowerCase()} stage; maintain current moisture band for optimal yield.`}
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function CountRing({ value, color }: { value: number; color: string }) {
  const n = useCountUp(value, 800, 1);
  return <span className={cn("text-3xl font-black", color)}>{n.toFixed(0)}%</span>;
}