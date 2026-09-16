import { useState, useEffect } from "react";
import { Activity, Thermometer, Droplets, Wind, Sun, Cloud, Bell, TrendingUp, AlertCircle, Map, Crosshair, RefreshCw, Gauge, Clock3 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ChartTooltip, ChartLegend } from "./ui/chart-tooltip";
import { useCountUp } from "./ui/useCountUp";
import { api, Zone } from "../services/api";
import { cn } from "./ui/utils";

interface SensorData {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: any;
  accent: string;
  bar: string;
  threshold: { min: number; max: number };
  autoActuation: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "critical";
  timestamp: Date;
}

const statusMeta: Record<string, { label: string; chip: string; dot: string }> = {
  normal: { label: "Optimal", chip: "bg-green-100 text-green-800 border-green-200", dot: "bg-green-500" },
  warning: { label: "Caution", chip: "bg-yellow-100 text-yellow-800 border-yellow-200", dot: "bg-yellow-500" },
  critical: { label: "Critical", chip: "bg-red-100 text-red-800 border-red-200", dot: "bg-red-500" },
};

const fallbackZones: Zone[] = [
  {
    id: 1,
    name: "Kilombero Paddy Sector",
    isActive: true,
    isAutoMode: true,
    flowRate: 90,
    schedule: "06:00 AM & 06:00 PM",
    soilMoisture: 72,
    lastWatered: "1 hour ago",
    sensorOnline: true,
    cropType: "Rice & Maize",
    areaSize: "5.0 Acres",
  },
  {
    id: 2,
    name: "Arusha Horticulture Orchard",
    isActive: false,
    isAutoMode: true,
    flowRate: 65,
    schedule: "07:00 AM & 05:00 PM",
    soilMoisture: 48,
    lastWatered: "6 hours ago",
    sensorOnline: true,
    cropType: "French Beans & Tomatoes",
    areaSize: "2.5 Acres",
  },
  {
    id: 3,
    name: "Morogoro Greenhouse Complex",
    isActive: true,
    isAutoMode: false,
    flowRate: 80,
    schedule: "05:30 AM & 06:30 PM",
    soilMoisture: 84,
    lastWatered: "30 mins ago",
    sensorOnline: true,
    cropType: "Sweet Peppers & Capsicum",
    areaSize: "1,200 sq meters",
  },
];

const timeAgo = (d: Date) => {
  const s = Math.max(1, Math.round((Date.now() - d.getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
};

const rangePos = (v: number, min: number, max: number) =>
  Math.max(4, Math.min(100, ((v - min) / (max - min)) * 100));

function FarmKpi({ icon: Icon, tint, value, suffix, label, caption }: any) {
  const n = useCountUp(value, 900, 1);
  return (
    <motion.div variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }} whileHover={{ y: -4 }}>
      <Card className={cn("p-4 h-full border-slate-200/70 shadow-sm", tint.border)}>
        <div className="flex items-center justify-between mb-3">
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", tint.bg, tint.text)}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-mono">
            {n.toFixed(0)}
            {suffix}
          </span>
        </div>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{caption}</p>
      </Card>
    </motion.div>
  );
}

export function SmartFarming() {
  const [view, setView] = useState<"macro" | "micro">("macro");
  const [zones, setZones] = useState<Zone[]>(fallbackZones);
  const [selectedZone, setSelectedZone] = useState<Zone>(fallbackZones[0]);
  const [lastSync, setLastSync] = useState<Date>(new Date(Date.now() - 30000));
  const [syncing, setSyncing] = useState(false);

  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "temp-1",
      name: "Soil Temperature",
      type: "temperature",
      value: 24.5,
      unit: "°C",
      status: "normal",
      icon: Thermometer,
      accent: "bg-rose-50 text-rose-500",
      bar: "bg-rose-500",
      threshold: { min: 18, max: 30 },
      autoActuation: true,
    },
    {
      id: "moisture-1",
      name: "Soil Moisture",
      type: "moisture",
      value: 62,
      unit: "%",
      status: "normal",
      icon: Droplets,
      accent: "bg-cyan-50 text-cyan-600",
      bar: "bg-cyan-600",
      threshold: { min: 50, max: 80 },
      autoActuation: true,
    },
    {
      id: "humidity-1",
      name: "Air Humidity",
      type: "humidity",
      value: 68,
      unit: "%",
      status: "normal",
      icon: Cloud,
      accent: "bg-green-50 text-green-600",
      bar: "bg-green-600",
      threshold: { min: 60, max: 85 },
      autoActuation: false,
    },
    {
      id: "light-1",
      name: "Light Intensity",
      type: "light",
      value: 850,
      unit: "lux",
      status: "normal",
      icon: Sun,
      accent: "bg-amber-50 text-amber-500",
      bar: "bg-amber-500",
      threshold: { min: 500, max: 1500 },
      autoActuation: false,
    },
    {
      id: "wind-1",
      name: "Wind Speed",
      type: "wind",
      value: 12,
      unit: "km/h",
      status: "normal",
      icon: Wind,
      accent: "bg-sky-50 text-sky-600",
      bar: "bg-sky-600",
      threshold: { min: 0, max: 30 },
      autoActuation: false,
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      message: "Irrigation system activated in North Field",
      type: "info",
      timestamp: new Date(Date.now() - 1800000),
    },
    {
      id: 2,
      message: "Soil moisture optimal in all zones",
      type: "info",
      timestamp: new Date(Date.now() - 3600000),
    },
  ]);

  const [historicalData, setHistoricalData] = useState([
    { time: "00:00", temp: 22, moisture: 65, humidity: 70 },
    { time: "04:00", temp: 20, moisture: 68, humidity: 72 },
    { time: "08:00", temp: 23, moisture: 62, humidity: 65 },
    { time: "12:00", temp: 26, moisture: 58, humidity: 60 },
    { time: "16:00", temp: 25, moisture: 55, humidity: 62 },
    { time: "20:00", temp: 23, moisture: 60, humidity: 68 },
  ]);

  useEffect(() => {
    api.getZones().then((data) => {
      if (data.length) {
        setZones(data);
        setSelectedZone((prev) => data.find((z) => z.id === prev.id) || data[0]);
        setLastSync(new Date());
      }
    });
  }, []);

  // Simulate live sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          const change = (Math.random() - 0.5) * 2;
          let newValue = sensor.value + change;

          if (sensor.type === "temperature") {
            newValue = Math.max(15, Math.min(35, newValue));
          } else if (sensor.type === "moisture" || sensor.type === "humidity") {
            newValue = Math.max(30, Math.min(95, newValue));
          } else if (sensor.type === "light") {
            newValue = Math.max(300, Math.min(2000, newValue));
          } else if (sensor.type === "wind") {
            newValue = Math.max(0, Math.min(40, newValue));
          }

          let status: "normal" | "warning" | "critical" = "normal";
          if (newValue < sensor.threshold.min || newValue > sensor.threshold.max) {
            status = "warning";

            if (sensor.autoActuation && sensor.type === "moisture" && newValue < sensor.threshold.min) {
              const newNotif: Notification = {
                id: Date.now(),
                message: `Auto-actuation: Irrigation started due to low ${sensor.name} (${newValue.toFixed(1)}${sensor.unit})`,
                type: "warning",
                timestamp: new Date(),
              };
              setNotifications((prev) => [newNotif, ...prev].slice(0, 10));
              toast.warning(newNotif.message);
            }
          }

          if (newValue < sensor.threshold.min * 0.8 || newValue > sensor.threshold.max * 1.2) {
            status = "critical";
          }

          return { ...sensor, value: parseFloat(newValue.toFixed(1)), status };
        })
      );
      setLastSync(new Date());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleAutoActuation = (sensorId: string) => {
    setSensors((prev) =>
      prev.map((sensor) => {
        if (sensor.id === sensorId) {
          const newState = !sensor.autoActuation;
          toast.success(`Auto-actuation ${newState ? "enabled" : "disabled"} for ${sensor.name}`);
          return { ...sensor, autoActuation: newState };
        }
        return sensor;
      })
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const handleSync = () => {
    setSyncing(true);
    api.getZones().then((data) => {
      if (data.length) {
        setZones(data);
        setSelectedZone((prev) => data.find((z) => z.id === prev.id) || data[0]);
      }
      setLastSync(new Date());
      toast.success("Telemetry synced");
    });
    setTimeout(() => setSyncing(false), 1200);
  };

  const updateZone = (patch: Partial<Zone>) => {
    setZones((prev) => prev.map((z) => (z.id === selectedZone.id ? { ...z, ...patch } : z)));
    setSelectedZone((prev) => ({ ...prev, ...patch }));
  };

  const moistureTint = (v: number) =>
    v < 50 ? { ring: "#ef4444", text: "text-red-600", word: "DRY" } : v > 80 ? { ring: "#0d9488", text: "text-teal-700", word: "SATURATED" } : { ring: "#16a34a", text: "text-green-600", word: "OPTIMAL" };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-950 via-green-800 to-green-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-green-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-2 backdrop-blur-md px-3 py-1">
              🌱 IoT Precision Agronomy
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Smart Farming Dashboard</h1>
            <p className="text-green-100 text-sm mt-1 max-w-xl">
              Real-time field sensors, crop health telemetry, and automatic actuation per farm zone.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 rounded-xl bg-black/20 border border-white/10 px-3 py-2 text-[11px] font-bold text-green-200">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> LIVE · synced {timeAgo(lastSync)}
            </span>
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
              onClick={handleSync}
            >
              <motion.span
                animate={{ rotate: syncing ? 360 : 0 }}
                transition={{ duration: 1.2, ease: "linear" }}
                className="inline-flex mr-2"
              >
                <RefreshCw className="w-4 h-4" />
              </motion.span>
              Sync Sensors
            </Button>
          </div>
        </div>

        {/* Macro / Micro Toggle */}
        <div className="mt-6 pt-4 border-t border-green-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex bg-black/20 p-1 rounded-xl w-fit">
            <button
              onClick={() => setView("macro")}
              aria-pressed={view === "macro"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                view === "macro" ? "bg-white text-green-900 shadow-xs" : "text-green-200 hover:bg-white/10"
              )}
            >
              <Map className="w-4 h-4" /> MACRO · Farm Overview
            </button>
            <button
              onClick={() => setView("micro")}
              aria-pressed={view === "micro"}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all",
                view === "micro" ? "bg-white text-green-900 shadow-xs" : "text-green-200 hover:bg-white/10"
              )}
            >
              <Crosshair className="w-4 h-4" /> MICRO · Zone Detail
            </button>
          </div>
          <span className="text-xs text-green-200 font-medium">
            {view === "macro"
              ? "Whole-farm sensor health, trends & alerts."
              : `Drilling into ${selectedZone.name} — ${selectedZone.cropType}, ${selectedZone.areaSize}.`}
          </span>
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
            <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="show">
              {/* Farm-wide KPI strip */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <FarmKpi icon={Map} tint={{ border: "border-l-4 border-l-green-500", bg: "bg-green-50", text: "text-green-600" }} value={zones.length} suffix="/3" label="Zones Online" caption="monitored this season" />
                <FarmKpi icon={Gauge} tint={{ border: "border-l-4 border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-600" }} value={zones.filter((z) => z.isActive).length} suffix="" label="Pumps Running" caption="auto-driven valve power" />
                <FarmKpi icon={Activity} tint={{ border: "border-l-4 border-l-cyan-500", bg: "bg-cyan-50", text: "text-cyan-600" }} value={sensors.length} suffix={`/${sensors.length}`} label="Sensors Online" caption="1,240 readings / hour" />
                <FarmKpi icon={Droplets} tint={{ border: "border-l-4 border-l-amber-500", bg: "bg-amber-50", text: "text-amber-600" }} value={1240} suffix="L" label="Water Conserved" caption="saved via smart triggers" />
              </div>

              {/* Live Sensor Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {sensors.map((sensor, i) => {
                  const Icon = sensor.icon;
                  const meta = statusMeta[sensor.status];
                  return (
                    <motion.div
                      key={sensor.id}
                      variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -4 }}
                    >
                      <Card className="p-4 rounded-2xl border-slate-200/80 h-full shadow-sm">
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", sensor.accent)}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <Badge className={cn("text-[10px]", meta.chip)}>{meta.label}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold text-slate-700">{sensor.name}</h3>
                          <span className={cn("w-2 h-2 rounded-full animate-pulse", meta.dot)} />
                        </div>
                        <div className="flex items-end gap-1 mt-1 mb-2">
                          <motion.span
                            key={sensor.value}
                            initial={{ scale: 1.18, color: "#16a34a" }}
                            animate={{ scale: 1, color: "#0f172a" }}
                            className="text-2xl font-black text-slate-900"
                          >
                            {sensor.value}
                          </motion.span>
                          <span className="text-xs font-semibold text-slate-500 mb-1">{sensor.unit}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-700", sensor.bar)}
                            style={{ width: `${rangePos(sensor.value, sensor.threshold.min, sensor.threshold.max)}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-semibold">
                          <span>
                            {sensor.threshold.min}
                            {sensor.unit}
                          </span>
                          <span>
                            {sensor.threshold.max}
                            {sensor.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                          <span className="text-[11px] font-bold text-slate-500">Auto</span>
                          <Switch
                            checked={sensor.autoActuation}
                            onCheckedChange={() => toggleAutoActuation(sensor.id)}
                            className="scale-75"
                          />
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Trends + Notifications */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                <Card className="lg:col-span-2 p-6 border-slate-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <h2 className="text-xl text-gray-900 font-bold">Sensor Trends</h2>
                    </div>
                    <ChartLegend
                      items={[
                        { name: "Temp (°C)", color: "#f43f5e" },
                        { name: "Moisture (%)", color: "#06b6d4" },
                        { name: "Humidity (%)", color: "#16a34a" },
                      ]}
                    />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} />
                      <Line type="monotone" dataKey="temp" stroke="#f43f5e" name="Temp (°C)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="moisture" stroke="#06b6d4" name="Moisture (%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      <Line type="monotone" dataKey="humidity" stroke="#16a34a" name="Humidity (%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-slate-200/70 shadow-sm rounded-2xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600" />
                      <h2 className="text-xl text-gray-900 font-bold">Notifications</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      {notifications.length > 0 && (
                        <span className="h-5 min-w-5 px-1.5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                      <Button variant="ghost" size="sm" onClick={clearNotifications}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-12">
                        <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-500 font-semibold">All caught up</p>
                        <p className="text-xs text-slate-400 mt-1">No pending alerts for your zones.</p>
                      </div>
                    ) : (
                      <AnimatePresence initial={false}>
                        {notifications.map((notif) => (
                          <motion.div
                            key={notif.id}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={cn(
                              "p-3 rounded-xl border",
                              notif.type === "critical"
                                ? "bg-red-50 border-red-200"
                                : notif.type === "warning"
                                ? "bg-yellow-50 border-yellow-200"
                                : "bg-green-50 border-green-200"
                            )}
                          >
                            <div className="flex gap-2">
                              {notif.type === "critical" ? (
                                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                              ) : notif.type === "warning" ? (
                                <Bell className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Activity className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm text-gray-900">{notif.message}</p>
                                <p className="text-xs text-slate-500 font-medium mt-1">{timeAgo(notif.timestamp)}</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    )}
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }} initial="hidden" animate="show">
              {/* Zone Selector */}
              <div className="flex gap-2 overflow-x-auto custom-scrollbar mb-6 pb-1">
                {zones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                      selectedZone.id === zone.id
                        ? "bg-green-600 text-white border-green-600 shadow-md"
                        : "bg-white text-slate-700 border-slate-200 hover:border-green-300"
                    )}
                  >
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        selectedZone.id === zone.id
                          ? "bg-white animate-pulse"
                          : zone.isActive
                          ? "bg-green-500 animate-pulse"
                          : "bg-slate-300"
                      )}
                    />
                    <Crosshair className="w-4 h-4" />
                    <span>{zone.name}</span>
                  </button>
                ))}
              </div>

              {/* Zone Detail */}
              <motion.div variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} className="grid lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2 p-6 border-t-4 border-t-green-600 rounded-3xl border-slate-200/70 shadow-sm">
                  <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                    <div>
                      <Badge className="bg-green-100 text-green-800 border-none mb-2">{selectedZone.cropType}</Badge>
                      <h2 className="text-2xl font-extrabold text-slate-900">{selectedZone.name}</h2>
                      <p className="text-xs text-slate-500 font-medium mt-1">
                        {selectedZone.cropType} · {selectedZone.areaSize} · {selectedZone.schedule}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-3 h-3 rounded-full",
                          selectedZone.isActive ? "bg-green-500 animate-pulse" : "bg-slate-300"
                        )}
                      />
                      <Badge variant={selectedZone.isActive ? "success" : "secondary"}>
                        {selectedZone.isActive ? "VALVE ACTIVE" : "STANDBY"}
                      </Badge>
                    </div>
                  </div>

                  {/* Per-zone micro metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Moisture ring */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Soil Moisture</span>
                      <div
                        className="relative w-20 h-20 mx-auto my-2 rounded-full"
                        style={{
                          background: `conic-gradient(${moistureTint(selectedZone.soilMoisture).ring} ${selectedZone.soilMoisture * 3.6}deg, #e2e8f0 0deg)`,
                        }}
                      >
                        <div className="absolute inset-1.5 rounded-full bg-white flex flex-col items-center justify-center">
                          <span className={cn("text-lg font-black", moistureTint(selectedZone.soilMoisture).text)}>
                            {selectedZone.soilMoisture}%
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold">{moistureTint(selectedZone.soilMoisture).word}</span>
                        </div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Flow Rate</span>
                      <p className="text-2xl font-black text-slate-900 mt-1">
                        {selectedZone.flowRate} <span className="text-xs font-bold text-slate-500">L/min</span>
                      </p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                        <div className="h-full bg-cyan-600 rounded-full transition-all" style={{ width: `${selectedZone.flowRate}%` }} />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">Valve output</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Irrigation Window</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock3 className="w-4 h-4 text-green-600" />
                        <p className="text-sm font-black text-slate-900 leading-tight">{selectedZone.schedule}</p>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">Twice daily</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-bold uppercase text-slate-500">Zone Activity</span>
                      <div className="flex items-center gap-2 mt-2">
                        <Activity className={cn("w-4 h-4", selectedZone.sensorOnline ? "text-green-600" : "text-slate-400")} />
                        <span className={cn("text-[11px] font-bold", selectedZone.sensorOnline ? "text-green-700" : "text-slate-500")}>
                          {selectedZone.sensorOnline ? "Sensor online" : "Sensor offline"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-2">Watered {selectedZone.lastWatered}</p>
                    </div>
                  </div>

                  {/* Zone trend chart */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                      <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" /> Zone Telemetry (24h)
                      </h3>
                      <ChartLegend
                        items={[
                          { name: "Moisture (%)", color: "#06b6d4" },
                          { name: "Temp (°C)", color: "#f43f5e" },
                          { name: "Humidity (%)", color: "#16a34a" },
                        ]}
                      />
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                        <Tooltip content={<ChartTooltip />} />
                        <Line type="monotone" dataKey="moisture" stroke="#06b6d4" name="Moisture (%)" strokeWidth={3} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="temp" stroke="#f43f5e" name="Temp (°C)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                        <Line type="monotone" dataKey="humidity" stroke="#16a34a" name="Humidity (%)" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                {/* Zone actuation control */}
                <Card className="p-6 flex flex-col justify-between border-t-4 border-t-green-600 rounded-3xl border-slate-200/70 shadow-sm">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 mb-1">Actuation Control</h3>
                    <p className="text-xs text-slate-500 mb-5">Manual valve & smart auto-trigger settings for this zone.</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-100 transition-colors hover:border-green-200">
                        <div>
                          <p className="text-xs font-bold text-slate-700">Manual Valve Power</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            {selectedZone.isActive ? "Pump running now" : "Pump stopped"}
                          </p>
                        </div>
                        <Switch
                          checked={selectedZone.isActive}
                          onCheckedChange={(on) => {
                            updateZone({ isActive: on });
                            toast.success(`${selectedZone.name} pump ${on ? "ACTIVATED" : "STOPPED"}`);
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between bg-slate-50/80 p-3 rounded-xl border border-slate-100 transition-colors hover:border-green-200">
                        <div>
                          <p className="text-xs font-bold text-slate-700">Smart Auto-trigger</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">&lt;50% moisture trigger</p>
                        </div>
                        <Switch
                          checked={selectedZone.isAutoMode}
                          onCheckedChange={(on) => {
                            updateZone({ isAutoMode: on });
                            toast.info(`Auto-trigger ${on ? "enabled" : "disabled"} for ${selectedZone.name}`);
                          }}
                        />
                      </div>

                      <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                          <span>Water Output Rate</span>
                          <span className="text-green-700 font-mono">{selectedZone.flowRate} L/min</span>
                        </div>
                        <Slider
                          value={[selectedZone.flowRate]}
                          min={10}
                          max={100}
                          step={5}
                          onValueChange={(v) => updateZone({ flowRate: v[0] })}
                        />
                        <div className="flex justify-between mt-1.5 text-[10px] text-slate-400 font-semibold">
                          <span>10</span>
                          <span>100 L/min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 p-3.5 bg-green-50 rounded-2xl border border-green-100 text-xs text-green-900 leading-relaxed">
                    <span className="font-bold">💡 Advisory:</span>{" "}
                    {selectedZone.soilMoisture < 50
                      ? `Moisture below 50% — irrigate ${selectedZone.name} now to protect ${selectedZone.cropType}.`
                      : `${selectedZone.cropType} canopy is well watered. Continue current schedule ${selectedZone.schedule}.`}
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