import { useState, useEffect } from 'react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Bar, Legend, Cell, PieChart, Pie, Sector, AreaChart } from 'recharts';
import { AlertTriangle, Fan, Shirt, Thermometer, Car, Zap, Tv, Sun, Power, Activity, DollarSign, Leaf, Gauge, Droplet, Lightbulb, Waves, Flame } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';

// --- Indian Smart Home Appliances Data ---
export interface ApplianceItem {
    id: string;
    name: string;
    category: string;
    activePowerWatts: number;
    dailyKwh: number;
    monthlyKwh: number;
    dailyWaterLiters: number;
    dailyCostUSD: number;
    voltage: number;
    currentAmps: number;
    efficiencyRating: string;
    status: 'active' | 'standby' | 'eco';
    co2KgDaily: number;
    icon: any;
    color: string;
    hourlyWattageProfile: { hour: string; watts: number }[];
}

const APPLIANCES_CATALOG: ApplianceItem[] = [
    {
        id: 'ro_purifier',
        name: 'Smart RO + UV Water Purifier',
        category: 'Water Purification & RO',
        activePowerWatts: 45,
        dailyKwh: 0.45,
        monthlyKwh: 13.5,
        dailyWaterLiters: 45, // Purified drinking water + recovered reject water
        dailyCostUSD: 0.07,
        voltage: 230,
        currentAmps: 0.2,
        efficiencyRating: '5-Star RO (Zero Waste)',
        status: 'eco',
        co2KgDaily: 0.18,
        icon: Droplet,
        color: '#06b6d4',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 5 }, { hour: '06:00', watts: 45 }, { hour: '08:00', watts: 45 },
            { hour: '12:00', watts: 20 }, { hour: '18:00', watts: 45 }, { hour: '22:00', watts: 10 }
        ]
    },
    {
        id: 'sump_pump',
        name: 'Smart Sump Submersible Pump',
        category: 'Water Supply & Tank Filling',
        activePowerWatts: 750, // 1 HP Submersible Motor
        dailyKwh: 1.5,
        monthlyKwh: 45,
        dailyWaterLiters: 450, // Overhead tank fill capacity
        dailyCostUSD: 0.23,
        voltage: 230,
        currentAmps: 3.3,
        efficiencyRating: 'BEE 5-Star Copper Motor',
        status: 'active',
        co2KgDaily: 0.6,
        icon: Waves,
        color: '#0284c7',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 0 }, { hour: '06:00', watts: 750 }, { hour: '07:00', watts: 750 },
            { hour: '12:00', watts: 0 }, { hour: '17:00', watts: 750 }, { hour: '20:00', watts: 0 }
        ]
    },
    {
        id: 'geyser',
        name: 'Smart Storage Geyser',
        category: 'Heating & Water',
        activePowerWatts: 2000,
        dailyKwh: 4.2,
        monthlyKwh: 126,
        dailyWaterLiters: 65,
        dailyCostUSD: 0.65,
        voltage: 230,
        currentAmps: 8.7,
        efficiencyRating: 'BEE 5-Star Smart Geyser',
        status: 'active',
        co2KgDaily: 1.7,
        icon: Thermometer,
        color: '#ef4444',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 0 }, { hour: '05:30', watts: 2000 }, { hour: '07:00', watts: 1800 },
            { hour: '12:00', watts: 0 }, { hour: '19:00', watts: 1500 }, { hour: '21:00', watts: 0 }
        ]
    },
    {
        id: 'washer',
        name: 'Front-Load Washing Machine',
        category: 'Laundry & Hygiene',
        activePowerWatts: 1000,
        dailyKwh: 1.2,
        monthlyKwh: 36,
        dailyWaterLiters: 90,
        dailyCostUSD: 0.19,
        voltage: 230,
        currentAmps: 4.3,
        efficiencyRating: '5-Star Inverter Direct Drive',
        status: 'eco',
        co2KgDaily: 0.5,
        icon: Shirt,
        color: '#3b82f6',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 0 }, { hour: '09:00', watts: 1000 }, { hour: '10:00', watts: 850 },
            { hour: '11:00', watts: 200 }, { hour: '16:00', watts: 0 }, { hour: '20:00', watts: 0 }
        ]
    },
    {
        id: 'ac',
        name: '1.5 Tr Inverter Split AC',
        category: 'Cooling & HVAC',
        activePowerWatts: 1400,
        dailyKwh: 8.5,
        monthlyKwh: 255,
        dailyWaterLiters: 0, // AC does not consume municipal water
        dailyCostUSD: 1.33,
        voltage: 230,
        currentAmps: 6.1,
        efficiencyRating: 'ISEER 5.2 (5-Star Dual Inverter)',
        status: 'active',
        co2KgDaily: 3.4,
        icon: Fan,
        color: '#0ea5e9',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 950 }, { hour: '04:00', watts: 700 }, { hour: '08:00', watts: 1200 },
            { hour: '13:00', watts: 1400 }, { hour: '16:00', watts: 1400 }, { hour: '21:00', watts: 1100 }
        ]
    },
    {
        id: 'lighting_fans',
        name: 'BLDC Smart Fans & Ambient Lights',
        category: 'Lighting & Ventilation',
        activePowerWatts: 120,
        dailyKwh: 0.95,
        monthlyKwh: 28.5,
        dailyWaterLiters: 0,
        dailyCostUSD: 0.15,
        voltage: 230,
        currentAmps: 0.5,
        efficiencyRating: '65% BLDC Energy Saver',
        status: 'active',
        co2KgDaily: 0.38,
        icon: Lightbulb,
        color: '#eab308',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 70 }, { hour: '06:00', watts: 40 }, { hour: '12:00', watts: 120 },
            { hour: '18:00', watts: 120 }, { hour: '20:00', watts: 120 }, { hour: '23:00', watts: 90 }
        ]
    },
    {
        id: 'tv',
        name: '4K Smart Android TV & Soundbar',
        category: 'Home Entertainment',
        activePowerWatts: 220,
        dailyKwh: 1.32,
        monthlyKwh: 39.6,
        dailyWaterLiters: 0,
        dailyCostUSD: 0.21,
        voltage: 230,
        currentAmps: 0.95,
        efficiencyRating: 'Energy Star Grade A+',
        status: 'active',
        co2KgDaily: 0.52,
        icon: Tv,
        color: '#6366f1',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 5 }, { hour: '08:00', watts: 5 }, { hour: '13:00', watts: 180 },
            { hour: '18:00', watts: 220 }, { hour: '21:00', watts: 220 }, { hour: '23:00', watts: 20 }
        ]
    },
    {
        id: 'fridge',
        name: 'Double-Door Inverter Refrigerator',
        category: 'Kitchen Refrigeration',
        activePowerWatts: 160,
        dailyKwh: 1.6,
        monthlyKwh: 48,
        dailyWaterLiters: 0,
        dailyCostUSD: 0.25,
        voltage: 230,
        currentAmps: 0.7,
        efficiencyRating: 'BEE 5-Star Convertible Inverter',
        status: 'active',
        co2KgDaily: 0.64,
        icon: Zap,
        color: '#10b981',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 140 }, { hour: '04:00', watts: 130 }, { hour: '08:00', watts: 180 },
            { hour: '12:00', watts: 160 }, { hour: '16:00', watts: 150 }, { hour: '20:00', watts: 190 }
        ]
    },
    {
        id: 'induction',
        name: 'Smart Induction Cooktop',
        category: 'Kitchen Cooking',
        activePowerWatts: 1800,
        dailyKwh: 2.1,
        monthlyKwh: 63,
        dailyWaterLiters: 0,
        dailyCostUSD: 0.33,
        voltage: 230,
        currentAmps: 7.8,
        efficiencyRating: '92% Electromagnetic Efficiency',
        status: 'active',
        co2KgDaily: 0.84,
        icon: Flame,
        color: '#f97316',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 0 }, { hour: '07:30', watts: 1800 }, { hour: '08:30', watts: 1200 },
            { hour: '13:00', watts: 1500 }, { hour: '20:00', watts: 1800 }, { hour: '21:30', watts: 0 }
        ]
    },
    {
        id: 'ev',
        name: 'EV Scooter & Car Wallbox Charger',
        category: 'EV Fast Charging',
        activePowerWatts: 3300,
        dailyKwh: 9.9,
        monthlyKwh: 297,
        dailyWaterLiters: 0,
        dailyCostUSD: 1.55,
        voltage: 230,
        currentAmps: 14.3,
        efficiencyRating: '95% AC Fast Charger Efficiency',
        status: 'active',
        co2KgDaily: 3.9,
        icon: Car,
        color: '#8b5cf6',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 3300 }, { hour: '02:00', watts: 3300 }, { hour: '04:00', watts: 1650 },
            { hour: '08:00', watts: 0 }, { hour: '16:00', watts: 0 }, { hour: '22:00', watts: 3300 }
        ]
    },
    {
        id: 'solar',
        name: 'Solar Rooftop Hybrid Inverter',
        category: 'Solar Generation',
        activePowerWatts: 2800,
        dailyKwh: 14.2,
        monthlyKwh: 426,
        dailyWaterLiters: 0,
        dailyCostUSD: -2.22,
        voltage: 230,
        currentAmps: 12.2,
        efficiencyRating: '98.5% MPPT Efficiency Peak',
        status: 'active',
        co2KgDaily: -5.6,
        icon: Sun,
        color: '#f59e0b',
        hourlyWattageProfile: [
            { hour: '00:00', watts: 0 }, { hour: '06:00', watts: 600 }, { hour: '10:00', watts: 2200 },
            { hour: '13:00', watts: 3400 }, { hour: '16:00', watts: 1800 }, { hour: '19:00', watts: 0 }
        ]
    }
];

const FORECAST_DATA = [
    { day: 'Mon', historicalWater: 450, stringencyLimit: 500 },
    { day: 'Tue', historicalWater: 420, stringencyLimit: 500 },
    { day: 'Wed', historicalWater: 480, stringencyLimit: 500 },
    { day: 'Thu', historicalWater: 390, stringencyLimit: 500 },
    { day: 'Fri', predictedWater: 440, stringencyLimit: 500 },
    { day: 'Sat', predictedWater: 580, stringencyLimit: 500 },
    { day: 'Sun', predictedWater: 410, stringencyLimit: 500 },
];

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-extrabold">
                {payload.name.split(' ')[0]}
            </text>
            <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 6} startAngle={startAngle} endAngle={endAngle} fill={fill} />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 10} y={ey} textAnchor={textAnchor} fill="#334155" className="font-extrabold text-xs">
                {value}
            </text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 10} y={ey} dy={16} textAnchor={textAnchor} fill="#94a3b8" className="text-[10px] font-bold">
                {`( ${(percent * 100).toFixed(0)}% )`}
            </text>
        </g>
    );
};

export const ApplianceAnalytics = () => {
    const settings = useSettingsStore();

    const [breakdownType, setBreakdownType] = useState<'water' | 'energy'>('water');
    const [selectedApplianceId, setSelectedApplianceId] = useState<string>('ro_purifier');
    const [liveCatalog, setLiveCatalog] = useState<ApplianceItem[]>(APPLIANCES_CATALOG);
    const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');

    // Real-Time IoT Live Telemetry Stream Simulation
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCatalog(prev => prev.map(appliance => {
                // Apply ±2-4% realistic voltage & wattage fluctuations
                const variation = (Math.random() - 0.5) * (appliance.activePowerWatts * 0.05);
                const newWatts = Math.round(appliance.activePowerWatts + variation);
                const newVoltage = Number((228.5 + Math.random() * 4.5).toFixed(1)); // 228.5V - 233.0V
                const newCurrent = Number((Math.abs(newWatts) / newVoltage).toFixed(1));

                // Update wattage profile curve dynamically - ensure active hour matches activePowerWatts EXACTLY
                const newProfile = appliance.hourlyWattageProfile.map((point, index) => {
                    const isLivePoint = index === appliance.hourlyWattageProfile.length - 1;
                    if (isLivePoint) {
                        return { ...point, watts: newWatts, isLive: true };
                    }
                    return point;
                });

                return {
                    ...appliance,
                    activePowerWatts: newWatts,
                    voltage: newVoltage,
                    currentAmps: newCurrent,
                    hourlyWattageProfile: newProfile,
                };
            }));
            setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const selectedAppliance = liveCatalog.find(a => a.id === selectedApplianceId) || liveCatalog[0];

    // Generate dynamic live wattage profile curve mathematically bound to selectedAppliance.activePowerWatts
    const getLiveWattageProfile = (appliance: ApplianceItem) => {
        const factors = [
            { hour: '00:00', factor: 0.25, label: 'Night Standby' },
            { hour: '04:00', factor: 0.15, label: 'Low Idle' },
            { hour: '08:00', factor: 0.70, label: 'Morning Run' },
            { hour: '12:00', factor: 0.90, label: 'Midday Operating' },
            { hour: '16:00', factor: 0.85, label: 'Afternoon Run' },
            { hour: 'NOW', factor: 1.00, label: 'Live Active Power Draw', isLive: true }
        ];

        return factors.map(f => ({
            hour: f.hour,
            watts: Math.round(appliance.activePowerWatts * f.factor),
            label: f.label,
            isLive: f.isLive || false
        }));
    };

    const liveProfileData = getLiveWattageProfile(selectedAppliance);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Appliance Analytics & Power Inspector</h1>
                    <p className="text-slate-500 mt-1 font-bold text-sm tracking-wide">
                        Detailed per-appliance wattage telemetry, load curves, and real-time efficiency metrics.
                    </p>
                </div>

                {/* Live Telemetry Status Pill */}
                <div className="flex items-center gap-2 panel-soft-inset px-4 py-2 rounded-2xl border border-emerald-400/50 bg-emerald-500/10 shrink-0">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">LIVE TELEMETRY STREAM</span>
                    <span className="text-[10px] font-extrabold text-slate-400">({lastUpdatedTime})</span>
                </div>
            </div>

            {/* --- TOP SECTION: FORECAST & ANOMALIES --- */}
            <div className="panel-soft p-6 h-[380px] flex flex-col relative w-full border border-white/60">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-lg font-extrabold text-slate-700">7-Day Consumption Forecast</h2>
                        <span className="text-xs font-bold text-slate-500">Historical & Predicted Telemetry</span>
                    </div>
                </div>

                <div className="flex-1 w-full min-h-0 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={FORECAST_DATA} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.4)' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                            <Bar dataKey="historicalWater" name="Historical Usage (L)" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            <Area type="monotone" dataKey="predictedWater" name="Predicted Usage (L)" fill="url(#colorPredicted)" stroke="#0ea5e9" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} />
                            <Area type="step" dataKey="stringencyLimit" name="Target Limit (500L)" fill="none" stroke="#f43f5e" strokeWidth={2} strokeDasharray="3 3" />
                            <defs>
                                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>

                {/* Forecast Anomaly Banner */}
                <div className="panel-soft-inset border border-rose-200/60 rounded-2xl p-4 flex gap-4 items-center relative mt-3">
                    <div className="p-2.5 panel-soft rounded-xl text-rose-500 border border-white/50 shrink-0">
                        <AlertTriangle className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <div className="flex-1">
                        <span className="text-xs font-black text-rose-600 tracking-wider uppercase">Forecasted Anomaly</span>
                        <p className="text-xs font-bold text-slate-500 mt-0.5 leading-snug">
                            Expected 16% load spike this Saturday. Recommended: Shift high-wattage appliance runs to off-peak hours.
                        </p>
                    </div>
                </div>
            </div>

            {/* --- MIDDLE SECTION: PER-APPLIANCE POWER INSPECTOR --- */}
            <div className="panel-soft p-6 border border-white/60 space-y-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200/60 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-emerald-600">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-700 tracking-tight">Per-Appliance Power Inspector</h2>
                            <p className="text-xs font-bold text-slate-500">Select any appliance below to inspect live power draw & 24h telemetry.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 panel-soft-inset px-4 py-2 rounded-2xl text-xs font-extrabold text-slate-600">
                        <Gauge className="w-4 h-4 text-emerald-500" />
                        <span>Inspecting: <strong className="text-emerald-600 font-black">{selectedAppliance.name}</strong></span>
                    </div>
                </div>

                {/* Inspector Grid: Deep Metrics Left + 24h Curve Right */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left: Detailed Metrics */}
                    <div className="panel-soft-inset p-5 space-y-4 rounded-2xl border border-white/40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div
                                    className="p-3 rounded-xl text-white shadow-md"
                                    style={{ backgroundColor: selectedAppliance.color }}
                                >
                                    <selectedAppliance.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-700">{selectedAppliance.name}</h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{selectedAppliance.category}</span>
                                </div>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                selectedAppliance.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-300' : 'bg-amber-500/10 text-amber-600 border-amber-300'
                            }`}>
                                {selectedAppliance.status}
                            </span>
                        </div>

                        {/* Real-time Wattage Meter */}
                        <div className="p-4 rounded-xl bg-white/70 border border-white/60 space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Active Power Draw</span>
                                <span className="text-lg font-black text-emerald-600">{selectedAppliance.activePowerWatts.toLocaleString()} Watts</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                        width: `${Math.min(100, (selectedAppliance.activePowerWatts / 7500) * 100)}%`,
                                        backgroundColor: selectedAppliance.color
                                    }}
                                />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-slate-400">
                                <span>Voltage: {selectedAppliance.voltage}V</span>
                                <span>Current: {selectedAppliance.currentAmps}A</span>
                            </div>
                        </div>

                        {/* Cost & Efficiency Badges */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div className="p-3 rounded-xl bg-white/60 border border-slate-200/50">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <DollarSign className="w-3 h-3 text-emerald-500" /> Daily Cost
                                </span>
                                <p className="text-sm font-black text-slate-700 mt-1">
                                    {settings.formatCost(selectedAppliance.dailyCostUSD)}
                                </p>
                            </div>

                            <div className="p-3 rounded-xl bg-white/60 border border-slate-200/50">
                                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <Leaf className="w-3 h-3 text-emerald-500" /> CO₂ Impact
                                </span>
                                <p className="text-sm font-black text-slate-700 mt-1">
                                    {selectedAppliance.co2KgDaily} kg/day
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200/60 flex items-center justify-between text-xs font-bold text-slate-600">
                            <span>Efficiency Rating</span>
                            <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                {selectedAppliance.efficiencyRating}
                            </span>
                        </div>
                    </div>

                    {/* Right: 24-Hour Wattage Profile Line/Area Chart */}
                    <div className="md:col-span-2 panel-soft-inset p-5 rounded-2xl border border-white/40 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-2">
                                <Power className="w-4 h-4 text-sky-500" /> 24-Hour Wattage Draw Curve ({selectedAppliance.name})
                            </h4>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-400/40 text-emerald-600 text-xs font-black flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                                    Live: {selectedAppliance.activePowerWatts.toLocaleString()}W
                                </span>
                                <span className="text-xs font-black text-slate-500">{selectedAppliance.dailyKwh} kWh / 24h</span>
                            </div>
                        </div>

                        <div className="w-full h-[220px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={liveProfileData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="selectedWattageGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={selectedAppliance.color} stopOpacity={0.7} />
                                            <stop offset="95%" stopColor={selectedAppliance.color} stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} dy={5} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 800 }} tickFormatter={(val) => `${val}W`} />
                                    <Tooltip
                                        content={({ active, payload, label }) => {
                                            if (!active || !payload || !payload.length) return null;
                                            const itemData = payload[0].payload;
                                            return (
                                                <div className="p-3 rounded-2xl bg-slate-900/90 text-white text-xs font-bold shadow-2xl border border-slate-700/80 backdrop-blur-md">
                                                    <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-1 border-b border-slate-800 mb-1.5 flex items-center justify-between gap-3">
                                                        <span>Hour {label}</span>
                                                        <span className={itemData.isLive ? "text-emerald-400 font-black" : "text-slate-400 font-semibold"}>
                                                            {itemData.isLive ? "● LIVE ACTIVE DRAW" : "HISTORICAL"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedAppliance.color }} />
                                                        <span className="font-extrabold text-white text-sm">
                                                            {payload[0].value.toLocaleString()} Watts
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                    <Area type="monotone" dataKey="watts" stroke={selectedAppliance.color} strokeWidth={3} fill="url(#selectedWattageGrad)" isAnimationActive={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BOTTOM SECTION: APPLIANCE TRACKING SELECTOR CATALOG --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left List */}
                <div className="panel-soft p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-700 mb-0.5">Appliance Tracking Catalog</h2>
                            <span className="text-xs font-bold text-slate-500">Click any appliance to inspect telemetry</span>
                        </div>

                        <div className="flex gap-2 panel-soft-inset p-1 rounded-2xl border border-white/40">
                            <button
                                onClick={() => setBreakdownType('water')}
                                className={`px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all ${breakdownType === 'water' ? 'panel-soft text-sky-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Water (L)
                            </button>
                            <button
                                onClick={() => setBreakdownType('energy')}
                                className={`px-4 py-1.5 text-xs font-extrabold tracking-wider uppercase rounded-xl transition-all ${breakdownType === 'energy' ? 'panel-soft text-amber-500 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                Energy (kWh)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 mt-4 max-h-[340px] overflow-y-auto pr-2 hide-scrollbar">
                        {(breakdownType === 'water'
                            ? liveCatalog.filter(a => a.dailyWaterLiters > 0)
                            : liveCatalog
                        ).map((item) => {
                            const isSelected = item.id === selectedApplianceId;
                            return (
                                <div
                                    key={item.id}
                                    onClick={() => setSelectedApplianceId(item.id)}
                                    className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer transition-all duration-300 border ${
                                        isSelected
                                            ? 'panel-soft-inset border-emerald-400/80 shadow-[inset_2px_2px_6px_#cbd5e1,_inset_-2px_-2px_6px_#ffffff]'
                                            : 'panel-soft border-white/60 hover:border-slate-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="p-3 rounded-xl text-white shadow-sm"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            <item.icon className="w-5 h-5 drop-shadow-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-extrabold text-slate-700">{item.name}</h4>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.activePowerWatts}W Active Draw</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-base font-black tracking-tight ${breakdownType === 'water' ? 'text-sky-500' : 'text-amber-500'}`}>
                                            {breakdownType === 'water' ? `${item.dailyWaterLiters}L` : `${item.dailyKwh} kWh`}
                                        </span>
                                        <div className="text-[10px] font-extrabold text-slate-400">
                                            {settings.formatCost(item.dailyCostUSD)}/day
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Pie Chart Share */}
                <div className="panel-soft p-6 min-h-[350px] flex flex-col items-center justify-center relative">
                    <h3 className="text-sm font-extrabold text-slate-600 uppercase tracking-wider absolute top-6 left-6">
                        Consumption Share ({breakdownType === 'water' ? 'Liters' : 'kWh'})
                    </h3>

                    <div className="w-full h-[300px] mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    activeShape={renderActiveShape}
                                    data={breakdownType === 'water'
                                        ? liveCatalog.filter(a => a.dailyWaterLiters > 0)
                                        : liveCatalog
                                    }
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    dataKey={breakdownType === 'water' ? 'dailyWaterLiters' : 'dailyKwh'}
                                    stroke="none"
                                >
                                    {(breakdownType === 'water'
                                        ? liveCatalog.filter(a => a.dailyWaterLiters > 0)
                                        : liveCatalog
                                    ).map((entry) => (
                                        <Cell key={`cell-${entry.id}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplianceAnalytics;
