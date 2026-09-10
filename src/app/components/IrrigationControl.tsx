import { useState, useEffect } from "react";
import { Droplets, Power, Clock, TrendingUp, AlertTriangle, CheckCircle2, Zap, RefreshCw, Cpu, Activity, CloudRain, Thermometer, Wind, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { api, Zone } from "../services/api";

const waterUsageData = [
  { day: "Mon", usage: 450 },
  { day: "Tue", usage: 380 },
  { day: "Wed", usage: 520 },
  { day: "Thu", usage: 410 },
  { day: "Fri", usage: 480 },
  { day: "Sat", usage: 350 },
  { day: "Sun", usage: 420 },
];

const soilMoistureTelemetry = [
  { time: "00:00", zone1: 68, zone2: 52, zone3: 84 },
  { time: "04:00", zone1: 65, zone2: 48, zone3: 81 },
  { time: "08:00", zone1: 72, zone2: 60, zone3: 85 },
  { time: "12:00", zone1: 58, zone2: 42, zone3: 79 },
  { time: "16:00", zone1: 54, zone2: 38, zone3: 76 },
  { time: "20:00", zone1: 68, zone2: 55, zone3: 82 },
];

export function IrrigationControl() {
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState<"moisture" | "usage">("moisture");
  const [selectedScheduleZone, setSelectedScheduleZone] = useState<Zone | null>(null);

  const fetchZones = async () => {
    setLoading(true);
    const data = await api.getZones();
    setZones(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchZones();
  }, []);

  const handleToggleActive = async (zoneId: number, currentActive: boolean) => {
    const nextState = !currentActive;
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, isActive: nextState } : z))
    );

    const res = await api.toggleZone(zoneId, nextState);
    if (res.success) {
      toast.success(`${res.zone.name} pump ${nextState ? "ACTIVATED 💧" : "STOPPED 🛑"}`);
    }
  };

  const handleToggleAuto = async (zoneId: number, currentAuto: boolean) => {
    const nextState = !currentAuto;
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, isAutoMode: nextState } : z))
    );

    const res = await api.toggleZone(zoneId, undefined, nextState);
    if (res.success) {
      toast.info(`Auto-Moisture trigger set for ${res.zone.name}`);
    }
  };

  const handleFlowChange = async (zoneId: number, value: number[]) => {
    const flowRate = value[0];
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, flowRate } : z))
    );

    await api.toggleZone(zoneId, undefined, undefined, flowRate);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-950 via-teal-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-2xl border border-cyan-500/20">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 mb-2 backdrop-blur-md px-3 py-1">
              💧 IoT Precision Water Actuation
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Smart Field Irrigation Dashboard</h1>
            <p className="text-cyan-100 text-sm mt-1 max-w-xl">
              Monitor root-zone sensor telemetry, schedule automated valves, and reduce water consumption.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={fetchZones}
              variant="outline"
              className="bg-white/10 border-white/20 text-white hover:bg-white/20 rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Sync Sensors
            </Button>
          </div>
        </div>

        {/* Smart Weather Guard Notice */}
        <div className="mt-6 pt-4 border-t border-cyan-500/20 flex items-center justify-between text-xs text-cyan-200">
          <span className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-cyan-400 animate-bounce" />
            <span><strong>Smart Weather Guard:</strong> Light rain expected in 3h — Auto-irrigation intelligently paused to conserve 320L water.</span>
          </span>
          <span className="hidden sm:inline font-mono text-cyan-400 font-bold">Rain Prob: 78%</span>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <Card className="p-5 border-l-4 border-l-cyan-500 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Active Pump Valves</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {zones.filter((z) => z.isActive).length} / {zones.length} Zones
            </h3>
          </div>
          <div className="p-3 bg-cyan-50 text-cyan-600 rounded-2xl">
            <Droplets className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-emerald-500 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Avg Soil Moisture</span>
            <h3 className="text-2xl font-black text-emerald-600 mt-1 font-mono">
              {zones.length ? Math.round(zones.reduce((a, b) => a + b.soilMoisture, 0) / zones.length) : 0}%
            </h3>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-blue-500 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Flow Rate Output</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">
              {zones.reduce((a, b) => (b.isActive ? a + b.flowRate : a), 0)} L/min
            </h3>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
            <Zap className="w-6 h-6" />
          </div>
        </Card>

        <Card className="p-5 border-l-4 border-l-purple-500 bg-white flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500 font-bold uppercase">Field Temperature</span>
            <h3 className="text-2xl font-black text-slate-900 mt-1 font-mono">24.5°C</h3>
          </div>
          <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
            <Thermometer className="w-6 h-6" />
          </div>
        </Card>
      </div>

      {/* Recharts Telemetry Section */}
      <Card className="p-6 mb-8 border-slate-200/80 rounded-3xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            <h3 className="text-lg font-bold text-slate-900">IoT Soil Telemetry & Consumption Curves</h3>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setChartTab("moisture")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartTab === "moisture" ? "bg-white text-cyan-800 shadow-xs" : "text-slate-600"
              }`}
            >
              Moisture Trends (%)
            </button>
            <button
              onClick={() => setChartTab("usage")}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                chartTab === "usage" ? "bg-white text-emerald-800 shadow-xs" : "text-slate-600"
              }`}
            >
              Water Usage (L)
            </button>
          </div>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            {chartTab === "moisture" ? (
              <LineChart data={soilMoistureTelemetry}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="zone1" name="North Field" stroke="#0891b2" strokeWidth={3} />
                <Line type="monotone" dataKey="zone2" name="South Field" stroke="#f43f5e" strokeWidth={3} />
                <Line type="monotone" dataKey="zone3" name="Greenhouse" stroke="#10b981" strokeWidth={3} />
              </LineChart>
            ) : (
              <AreaChart data={waterUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="usage" stroke="#10b981" fill="#d1fae5" strokeWidth={3} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Field Zones Control List */}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Field Zone Actuation Controls</h2>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-72 animate-pulse bg-slate-200/60 rounded-3xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <Card key={zone.id} className="p-6 flex flex-col justify-between border-t-4 border-t-cyan-600 rounded-3xl shadow-sm hover:shadow-md transition-shadow bg-white">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{zone.name}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {zone.cropType} • {zone.areaSize}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${zone.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}></span>
                    <Badge variant={zone.isActive ? "success" : "secondary"}>
                      {zone.isActive ? "PUMP ACTIVE" : "STANDBY"}
                    </Badge>
                  </div>
                </div>

                {/* Soil Moisture Visual Card */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-600">Root-Zone Soil Moisture</span>
                    <span className={zone.soilMoisture < 50 ? "text-red-600 font-extrabold" : "text-emerald-700 font-extrabold"}>
                      {zone.soilMoisture}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        zone.soilMoisture < 50 ? "bg-red-500" : "bg-cyan-600"
                      }`}
                      style={{ width: `${zone.soilMoisture}%` }}
                    />
                  </div>
                </div>

                {/* Valve Controls */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-slate-700">Manual Valve Power</span>
                    <Switch
                      checked={zone.isActive}
                      onCheckedChange={() => handleToggleActive(zone.id, zone.isActive)}
                    />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 p-3 rounded-xl">
                    <span className="text-xs font-bold text-slate-700">Smart Auto (&lt;50% trigger)</span>
                    <Switch
                      checked={zone.isAutoMode}
                      onCheckedChange={() => handleToggleAuto(zone.id, zone.isAutoMode)}
                    />
                  </div>

                  <div className="p-3 bg-slate-50/50 rounded-xl space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>Water Output Rate</span>
                      <span className="text-cyan-700 font-mono">{zone.flowRate} L/min</span>
                    </div>
                    <Slider
                      value={[zone.flowRate]}
                      onValueChange={(val) => handleFlowChange(zone.id, val)}
                      min={10}
                      max={120}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                <button
                  onClick={() => {
                    setSelectedScheduleZone(zone);
                    toast.info(`Editing schedule for ${zone.name}`);
                  }}
                  className="flex items-center gap-1 font-semibold text-slate-700 hover:text-cyan-700 transition-colors"
                >
                  <Clock className="w-3.5 h-3.5 text-cyan-600" /> {zone.schedule}
                </button>
                <span className="text-[11px]">Watered: {zone.lastWatered}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
