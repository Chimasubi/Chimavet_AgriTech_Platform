import { useState, useEffect } from "react";
import { Activity, Thermometer, Droplets, Wind, Sun, Cloud, Bell, TrendingUp, AlertCircle, Map, Crosshair, RefreshCw } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api, Zone } from "../services/api";

interface SensorData {
  id: string;
  name: string;
  type: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  icon: any;
  threshold: { min: number; max: number };
  autoActuation: boolean;
}

interface Notification {
  id: number;
  message: string;
  type: "info" | "warning" | "critical";
  timestamp: Date;
}

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

export function SmartFarming() {
  const [view, setView] = useState<"macro" | "micro">("macro");
  const [zones, setZones] = useState<Zone[]>(fallbackZones);
  const [selectedZone, setSelectedZone] = useState<Zone>(fallbackZones[0]);

  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "temp-1",
      name: "Soil Temperature",
      type: "temperature",
      value: 24.5,
      unit: "°C",
      status: "normal",
      icon: Thermometer,
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
      }
    });
  }, []);

  // Simulate sensor updates
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    toast.success("Notifications cleared");
  };

  const sensorColor = (id: string) => {
    switch (id) {
      case "temp-1":
        return "rose";
      case "moisture-1":
        return "cyan";
      case "humidity-1":
        return "violet";
      case "light-1":
        return "amber";
      case "wind-1":
        return "sky";
      default:
        return "indigo";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-indigo-800 to-violet-900 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 mb-2 backdrop-blur-md px-3 py-1">
              🌱 IoT Precision Agronomy
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Smart Farming Dashboard</h1>
            <p className="text-indigo-100 text-sm mt-1 max-w-xl">
              Real-time field sensors, crop health telemetry, and automatic actuation per farm zone.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
              onClick={() => toast.info("Sensor telemetry synced")}
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Sync Sensors
            </Button>
          </div>
        </div>

        {/* Macro / Micro Toggle */}
        <div className="mt-6 pt-4 border-t border-indigo-500/20 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex bg-black/20 p-1 rounded-xl w-fit">
            <button
              onClick={() => setView("macro")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === "macro" ? "bg-white text-indigo-900 shadow-xs" : "text-indigo-200"
              }`}
            >
              <Map className="w-4 h-4" /> MACRO · Farm Overview
            </button>
            <button
              onClick={() => setView("micro")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                view === "micro" ? "bg-white text-indigo-900 shadow-xs" : "text-indigo-200"
              }`}
            >
              <Crosshair className="w-4 h-4" /> MICRO · Zone Detail
            </button>
          </div>
          <span className="text-xs text-indigo-200 font-medium">
            {view === "macro"
              ? "Whole-farm sensor health, trends & alerts."
              : `Drilling into ${selectedZone.name} — ${selectedZone.cropType}, ${selectedZone.areaSize}.`}
          </span>
        </div>
      </div>

      {view === "macro" ? (
        <>
          {/* Live Sensor Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
            {sensors.map((sensor) => {
              const Icon = sensor.icon;
              const color = sensorColor(sensor.id);
              return (
                <motion.div
                  key={sensor.id}
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`p-4 border-2 ${getStatusColor(sensor.status)}`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-6 h-6 text-${color}-600`} />
                      <Badge
                        variant={sensor.status === "normal" ? "default" : "destructive"}
                        className="text-xs"
                      >
                        {sensor.status}
                      </Badge>
                    </div>
                    <h3 className="text-sm mb-1 text-gray-700">{sensor.name}</h3>
                    <div className="flex items-end gap-1 mb-3">
                      <motion.span
                        key={sensor.value}
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        className="text-2xl font-bold"
                      >
                        {sensor.value}
                      </motion.span>
                      <span className="text-sm text-gray-600 mb-1">{sensor.unit}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>Auto</span>
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

          {/* Notifications Panel */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            <Card className="lg:col-span-2 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <h2 className="text-xl text-gray-900 font-bold">Sensor Trends</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Temperature (°C)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="moisture" stroke="#0891b2" name="Moisture (%)" strokeWidth={2.5} />
                  <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" name="Humidity (%)" strokeWidth={2.5} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl text-gray-900 font-bold">Notifications</h2>
                <Button variant="ghost" size="sm" onClick={clearNotifications}>
                  Clear
                </Button>
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border ${
                        notif.type === "critical"
                          ? "bg-red-50 border-red-200"
                          : notif.type === "warning"
                          ? "bg-yellow-50 border-yellow-200"
                          : "bg-indigo-50 border-indigo-200"
                      }`}
                    >
                      <div className="flex gap-2">
                        {notif.type === "critical" ? (
                          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        ) : notif.type === "warning" ? (
                          <Bell className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Activity className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notif.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </div>

          {/* System Status */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Sensors Active</p>
                  <p className="text-xl text-gray-900 font-bold">{sensors.length}/{sensors.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-indigo-50 border-indigo-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Auto-Actuation</p>
                  <p className="text-xl text-gray-900 font-bold">
                    {sensors.filter((s) => s.autoActuation).length} Active
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Alerts Today</p>
                  <p className="text-xl text-gray-900 font-bold">{notifications.length}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-cyan-50 border-cyan-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Water Saved</p>
                  <p className="text-xl text-gray-900 font-bold">245L</p>
                </div>
              </div>
            </Card>
          </div>
        </>
      ) : (
        <>
          {/* Zone Selector */}
          <div className="flex gap-2 overflow-x-auto custom-scrollbar mb-6 pb-1">
            {zones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedZone.id === zone.id
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                    : "bg-white text-slate-700 border-slate-200 hover:border-indigo-300"
                }`}
              >
                <Crosshair className="w-4 h-4" />
                <span>{zone.name}</span>
              </button>
            ))}
          </div>

          {/* Zone Detail */}
          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2 p-6 border-t-4 border-t-indigo-600 rounded-3xl">
              <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
                <div>
                  <Badge className="bg-indigo-100 text-indigo-800 border-none mb-2">{selectedZone.cropType}</Badge>
                  <h2 className="text-2xl font-extrabold text-slate-900">{selectedZone.name}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {selectedZone.cropType} · {selectedZone.areaSize} · {selectedZone.schedule}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${selectedZone.isActive ? "bg-green-500 animate-pulse" : "bg-slate-300"}`}></span>
                  <Badge variant={selectedZone.isActive ? "success" : "secondary"}>
                    {selectedZone.isActive ? "VALVE ACTIVE" : "STANDBY"}
                  </Badge>
                </div>
              </div>

              {/* Per-zone micro metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Soil Moisture</span>
                  <div className="flex items-end gap-1 mt-1">
                    <span className={`text-2xl font-black ${selectedZone.soilMoisture < 50 ? "text-red-600" : "text-cyan-700"}`}>
                      {selectedZone.soilMoisture}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className={`h-full rounded-full transition-all ${selectedZone.soilMoisture < 50 ? "bg-red-500" : "bg-cyan-600"}`}
                      style={{ width: `${selectedZone.soilMoisture}%` }}
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Flow Rate</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{selectedZone.flowRate} <span className="text-xs font-bold text-slate-500">L/min</span></p>
                  <p className="text-[11px] text-slate-500 mt-2">Valve output</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Field Temp</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">24.5°C</p>
                  <p className="text-[11px] text-slate-500 mt-2">Ambient</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500">Crop Phase</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">Veg</p>
                  <p className="text-[11px] text-slate-500 mt-2">{selectedZone.lastWatered}</p>
                </div>
              </div>

              {/* Zone trend chart */}
              <div className="mt-6">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" /> Zone Telemetry (24h)
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Line type="monotone" dataKey="moisture" stroke="#0891b2" name="Moisture (%)" strokeWidth={3} />
                    <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Temp (°C)" strokeWidth={2.5} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Zone actuation control */}
            <Card className="p-6 flex flex-col justify-between border-t-4 border-t-indigo-600 rounded-3xl">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-1">Actuation Control</h3>
                <p className="text-xs text-slate-500 mb-5">Manual valve & smart auto-trigger settings for this zone.</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50/60 p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700">Manual Valve Power</p>
                      <p className="text-[10px] text-slate-500">{selectedZone.isActive ? "Pump running" : "Pump stopped"}</p>
                    </div>
                    
                    <Switch checked={selectedZone.isActive} onCheckedChange={() => toast.success(`${selectedZone.name} pump ${selectedZone.isActive ? "STOPPED" : "ACTIVATED"}`)} />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/60 p-3 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-slate-700">Smart Auto-trigger</p>
                      <p className="text-[10px] text-slate-500">&lt;50% moisture trigger</p>
                    </div>
                    
                    <Switch checked={selectedZone.isAutoMode} onCheckedChange={() => toast.info(`Auto-trigger set for ${selectedZone.name}`)} />
                  </div>

                  <div className="bg-slate-50/60 p-3 rounded-xl">
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Water Output Rate</span>
                      <span className="text-indigo-700 font-mono">{selectedZone.flowRate} L/min</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${selectedZone.flowRate}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-xs text-indigo-900">
                <span className="font-bold">💡 Advisory:</span>{" "}
                {selectedZone.soilMoisture < 50
                  ? `Moisture below 50% — irrigate ${selectedZone.name} now to protect ${selectedZone.cropType}.`
                  : `${selectedZone.cropType} canopy is well watered. Continue current schedule ${selectedZone.schedule}.`}
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}