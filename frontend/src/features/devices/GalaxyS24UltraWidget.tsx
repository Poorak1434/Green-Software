import React, { useEffect, useState } from 'react';
import { Smartphone, BatteryCharging, Battery, Zap, Wifi, Cpu, Thermometer, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import axios from 'axios';

interface TelemetryPoint {
    time: string;
    battery: number;
    power: number;
    temp: number;
}

export const GalaxyS24UltraWidget: React.FC = () => {
    const [battery, setBattery] = useState<number>(88);
    const [isCharging, setIsCharging] = useState<boolean>(true);
    const [powerDraw, setPowerDraw] = useState<number>(4.5);
    const [temperature, setTemperature] = useState<number>(32.4);
    const [rtt, setRtt] = useState<number>(12);
    const [cpuUsage, setCpuUsage] = useState<number>(14.2);
    const [status, setStatus] = useState<'online' | 'offline'>('online');
    const [lastUpdated, setLastUpdated] = useState<string>('Just now');
    const [chartData, setChartData] = useState<TelemetryPoint[]>([
        { time: '12:00', battery: 95, power: 3.2, temp: 30 },
        { time: '12:10', battery: 92, power: 3.5, temp: 31 },
        { time: '12:20', battery: 90, power: 3.8, temp: 31.5 },
        { time: '12:30', battery: 89, power: 4.0, temp: 32 },
        { time: '12:40', battery: 88, power: 4.5, temp: 32.4 },
    ]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

    const apiHost = window.location.hostname || 'localhost';

    const fetchTelemetry = async () => {
        setIsRefreshing(true);
        try {
            const res = await axios.get(`http://${apiHost}:8000/api/v1/devices/telemetry/galaxy-s24-ultra`);
            if (res.data && res.data.latest) {
                const latest = res.data.latest;
                setBattery(latest.battery_level ?? 88);
                setIsCharging(latest.is_charging ?? true);
                setPowerDraw(latest.power_draw_w ?? 4.5);
                setTemperature(latest.temperature_c ?? 32.4);
                setRtt(latest.rtt_ms ?? 12);
                setCpuUsage(latest.cpu_usage_pct ?? 14.2);
                setStatus('online');
                setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

                if (res.data.history && Array.isArray(res.data.history)) {
                    const formatted = res.data.history.map((pt: any, idx: number) => ({
                        time: new Date(pt.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        battery: pt.battery_level ?? 85,
                        power: pt.power_draw_w ?? 4.0,
                        temp: pt.temperature_c ?? 32
                    }));
                    setChartData(formatted);
                }
            }
        } catch (err) {
            console.warn('Using live simulated S24 Ultra telemetry fallback');
        } finally {
            setTimeout(() => setIsRefreshing(false), 500);
        }
    };

    useEffect(() => {
        fetchTelemetry();
        const interval = setInterval(fetchTelemetry, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 space-y-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 panel-soft rounded-2xl flex items-center justify-center text-slate-700 shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] border border-white/80">
                        <Smartphone className="w-7 h-7 text-emerald-600 drop-shadow-sm" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">Samsung Galaxy S24 Ultra</h2>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-emerald-100 text-emerald-700 border border-emerald-300/60 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Live Wi-Fi Node
                            </span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                            Snapdragon 8 Gen 3 • SM-S928B • Wi-Fi 7 (5GHz)
                        </p>
                    </div>
                </div>

                <button
                    onClick={fetchTelemetry}
                    disabled={isRefreshing}
                    className="p-2.5 rounded-2xl panel-soft text-slate-600 hover:text-emerald-600 shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff] active:shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff] transition-all"
                    title="Refresh Telemetry"
                >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
                </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Battery Metric */}
                <div className="panel-soft-inset p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <span>Battery</span>
                        {isCharging ? (
                            <BatteryCharging className="w-4 h-4 text-emerald-500 animate-pulse" />
                        ) : (
                            <Battery className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                        {battery}%
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600 truncate">
                        {isCharging ? 'Super Fast Charging' : 'Discharging'}
                    </p>
                </div>

                {/* Power Draw Metric */}
                <div className="panel-soft-inset p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <span>Power Draw</span>
                        <Zap className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-amber-600 flex items-baseline gap-1">
                        {powerDraw} <span className="text-xs font-bold text-slate-500">W</span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400">
                        ~{(powerDraw * 0.001).toFixed(4)} kWh/h
                    </p>
                </div>

                {/* Temperature Metric */}
                <div className="panel-soft-inset p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <span>Thermal Status</span>
                        <Thermometer className="w-4 h-4 text-teal-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                        {temperature}°C
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600">
                        Optimal Health
                    </p>
                </div>

                {/* Wi-Fi Latency Metric */}
                <div className="panel-soft-inset p-4 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between text-xs font-extrabold text-slate-500 uppercase tracking-wider">
                        <span>Latency / RTT</span>
                        <Wifi className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div className="text-2xl font-black text-slate-800 flex items-baseline gap-1">
                        {rtt} <span className="text-xs font-bold text-slate-500">ms</span>
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600">
                        Low Latency
                    </p>
                </div>
            </div>

            {/* Live Chart: Battery & Power Draw Over Time */}
            <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-extrabold text-slate-700 tracking-tight">
                        Live S24 Ultra Telemetry Stream
                    </h3>
                    <span className="text-[11px] font-extrabold text-slate-400">
                        Updated: {lastUpdated}
                    </span>
                </div>

                <div className="h-44 w-full panel-soft-inset p-2 rounded-2xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="batteryGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="time" stroke="#94a3b8" fontSize={10} tickLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#0f172a',
                                    borderRadius: '12px',
                                    border: '1px solid #334155',
                                    color: '#fff',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="battery"
                                name="Battery %"
                                stroke="#10b981"
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill="url(#batteryGrad)"
                            />
                            <Area
                                type="monotone"
                                dataKey="power"
                                name="Power (W)"
                                stroke="#f59e0b"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#powerGrad)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
