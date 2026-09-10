import { useState, useEffect } from "react";
import { Activity, Thermometer, Droplets, Wind, Sun, Cloud, Bell, TrendingUp, AlertCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { toast } from "sonner";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

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

export function SmartFarming() {
  const [sensors, setSensors] = useState<SensorData[]>([
    {
      id: "temp-1",
      name: "Soil Temperature",
      type: "temperature",
      value: 24.5,
      unit: "В°C",
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

  // Simulate sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          // Random fluctuation
          const change = (Math.random() - 0.5) * 2;
          let newValue = sensor.value + change;

          // Keep within reasonable bounds
          if (sensor.type === "temperature") {
            newValue = Math.max(15, Math.min(35, newValue));
          } else if (sensor.type === "moisture" || sensor.type === "humidity") {
            newValue = Math.max(30, Math.min(95, newValue));
          } else if (sensor.type === "light") {
            newValue = Math.max(300, Math.min(2000, newValue));
          } else if (sensor.type === "wind") {
            newValue = Math.max(0, Math.min(40, newValue));
          }

          // Determine status
          let status: "normal" | "warning" | "critical" = "normal";
          if (newValue < sensor.threshold.min || newValue > sensor.threshold.max) {
            status = "warning";
            
            // Auto-actuation for critical sensors
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 mb-2">Smart Farming Dashboard</h1>
        <p className="text-gray-600">Real-time sensor monitoring and automatic actuation</p>
      </div>

      {/* Live Sensor Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {sensors.map((sensor) => {
          const Icon = sensor.icon;
          return (
            <motion.div
              key={sensor.id}
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={`p-4 border-2 ${getStatusColor(sensor.status)}`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-6 h-6" />
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
                    className="text-2xl"
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
          <h2 className="text-xl text-gray-900 mb-4">Sensor Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temp" stroke="#ef4444" name="Temperature (В°C)" />
              <Line type="monotone" dataKey="moisture" stroke="#3b82f6" name="Moisture (%)" />
              <Line type="monotone" dataKey="humidity" stroke="#8b5cf6" name="Humidity (%)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-gray-900">Notifications</h2>
            <Button variant="ghost" size="sm" onClick={clearNotifications}>
              Clear
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
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
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <div className="flex gap-2">
                    {notif.type === "critical" ? (
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    ) : notif.type === "warning" ? (
                      <Bell className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Activity className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
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
              <p className="text-sm text-gray-600">Sensors Active</p>
              <p className="text-xl text-gray-900">{sensors.length}/{sensors.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Auto-Actuation</p>
              <p className="text-xl text-gray-900">
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
              <p className="text-sm text-gray-600">Alerts Today</p>
              <p className="text-xl text-gray-900">{notifications.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Water Saved</p>
              <p className="text-xl text-gray-900">245L</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
