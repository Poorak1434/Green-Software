import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cpu, Settings2, Filter } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const RAW_DATA = [
    { day: '1', heating: 15, ev: 0, waterHeater: 8, laundry: 4, kitchen: 6, pumps: 3, plug: 5, solar: 12 },
    { day: '5', heating: 18, ev: 12, waterHeater: 9, laundry: 6, kitchen: 7, pumps: 4, plug: 6, solar: 15 },
    { day: '10', heating: 12, ev: 0, waterHeater: 7, laundry: 3, kitchen: 5, pumps: 2, plug: 5, solar: 10 },
    { day: '15', heating: 20, ev: 15, waterHeater: 10, laundry: 7, kitchen: 8, pumps: 5, plug: 7, solar: 18 },
    { day: '20', heating: 16, ev: 0, waterHeater: 8, laundry: 5, kitchen: 6, pumps: 3, plug: 6, solar: 14 },
    { day: '25', heating: 14, ev: 12, waterHeater: 9, laundry: 6, kitchen: 7, pumps: 4, plug: 7, solar: 16 },
    { day: '30', heating: 19, ev: 0, waterHeater: 8, laundry: 4, kitchen: 6, pumps: 3, plug: 5, solar: 13 },
];

export const ApplianceDeepDiveTab = () => {
    const [filter, setFilter] = useState('All');
    const settings = useSettingsStore();

    // Prepare chart data based on filter selection
    const chartData = RAW_DATA.map(d => {
        if (filter === 'All') {
            return {
                day: d.day,
                hvacThermal: d.heating + d.waterHeater,
                evStorage: d.ev + d.solar,
                appliancesWater: d.laundry + d.kitchen + d.pumps,
                plugLoads: d.plug,
            };
        }
        return {
            day: d.day,
            heating: d.heating,
            ev: d.ev,
            waterHeater: d.waterHeater,
            laundry: d.laundry,
            kitchen: d.kitchen,
            pumps: d.pumps,
            plug: d.plug,
            solar: d.solar,
        };
    });

    // Calculate total kWh for active view
    const getFilteredTotalKwh = () => {
        let total = 0;
        RAW_DATA.forEach(d => {
            if (filter === 'All') total += d.heating + d.ev + d.waterHeater + d.laundry + d.kitchen + d.pumps + d.plug + d.solar;
            else if (filter === 'Heating') total += d.heating;
            else if (filter === 'EV') total += d.ev;
            else if (filter === 'WaterHeater') total += d.waterHeater;
            else if (filter === 'Laundry') total += d.laundry;
            else if (filter === 'Kitchen') total += d.kitchen;
            else if (filter === 'Pumps') total += d.pumps;
            else if (filter === 'Plug') total += d.plug;
            else if (filter === 'Solar') total += d.solar;
        });
        return total.toFixed(1);
    };

    const totalKwh = getFilteredTotalKwh();
    const estCostUSD = Number(totalKwh) * settings.peakElectricityRate;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="panel-soft rounded-2xl p-5 border border-white/60">
                    <h4 className="text-xs font-extrabold text-slate-500 tracking-wide uppercase mb-1">Total Consumption</h4>
                    <div className="text-2xl font-extrabold tracking-tight drop-shadow-sm text-slate-700">{totalKwh} kWh</div>
                </div>
                <div className="panel-soft rounded-2xl p-5 border border-white/60">
                    <h4 className="text-xs font-extrabold text-slate-500 tracking-wide uppercase mb-1">Estimated Cost</h4>
                    <div className="text-2xl font-extrabold tracking-tight drop-shadow-sm text-sky-500">{settings.formatCost(estCostUSD)}</div>
                </div>
                <div className="panel-soft rounded-2xl p-5 border border-white/60">
                    <h4 className="text-xs font-extrabold text-slate-500 tracking-wide uppercase mb-1">Active Filter View</h4>
                    <div className="text-2xl font-extrabold tracking-tight drop-shadow-sm text-emerald-600 truncate">
                        {filter === 'All' ? 'All Macro Categories' : filter}
                    </div>
                </div>
            </div>

            {/* Main Chart Panel */}
            <div className="panel-soft rounded-3xl p-6 border border-white/60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10 w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-rose-500 drop-shadow-sm">
                            <Cpu className="w-5 h-5 drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-slate-700 drop-shadow-sm">Appliance Consumption Trend</h3>
                            <p className="text-xs font-bold text-slate-500 tracking-wide mt-1">
                                {filter === 'All' ? 'Grouped by primary load categories.' : `Single appliance breakdown for ${filter}.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 panel-soft-inset px-3.5 py-2 rounded-xl border border-white/40">
                            <Filter className="w-4 h-4 text-emerald-500 shrink-0" />
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="bg-transparent text-xs font-extrabold text-slate-700 focus:outline-none uppercase tracking-wide cursor-pointer pr-2"
                            >
                                <option value="All">All Appliances (Grouped)</option>
                                <option value="Heating">Heating & AC</option>
                                <option value="EV">EV Charger</option>
                                <option value="WaterHeater">Water Heater & Boiler</option>
                                <option value="Laundry">Washing Machine & Dryer</option>
                                <option value="Kitchen">Kitchen & Smart Fridge</option>
                                <option value="Pumps">Pumps & Irrigation</option>
                                <option value="Plug">Plug Loads & TV</option>
                                <option value="Solar">Solar Inverter & Battery</option>
                            </select>
                        </div>
                        <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                            <Settings2 className="w-5 h-5 drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="w-full h-[400px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorHvac" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorEV" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorAppliances" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="colorPlug" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.7} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>

                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} tickFormatter={(val) => `${val} kWh`} />

                            {/* De-cluttered Compact Tooltip */}
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (!active || !payload || !payload.length) return null;
                                    return (
                                        <div className="p-3 rounded-2xl bg-slate-900/90 text-white text-xs font-bold shadow-2xl border border-slate-700/80 backdrop-blur-md min-w-[200px]">
                                            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest pb-1.5 border-b border-slate-800 mb-2">
                                                Day {label} Consumption
                                            </div>
                                            <div className="space-y-1.5">
                                                {payload.map((entry: any) => (
                                                    <div key={entry.name} className="flex items-center justify-between gap-3">
                                                        <span className="flex items-center gap-1.5 font-semibold text-slate-300">
                                                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                                                            {entry.name}
                                                        </span>
                                                        <span className="font-extrabold text-white">{entry.value} kWh</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }}
                            />

                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '800', color: '#64748b' }} iconType="circle" />

                            {/* Clean, 4-Layer View when All is selected */}
                            {filter === 'All' && (
                                <>
                                    <Area type="monotone" dataKey="hvacThermal" name="HVAC & Thermal" stackId="1" stroke="#f43f5e" fill="url(#colorHvac)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="evStorage" name="EV & Energy Storage" stackId="1" stroke="#8b5cf6" fill="url(#colorEV)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="appliancesWater" name="Home Appliances & Water" stackId="1" stroke="#10b981" fill="url(#colorAppliances)" strokeWidth={2} />
                                    <Area type="monotone" dataKey="plugLoads" name="Plug Loads & Electronics" stackId="1" stroke="#0ea5e9" fill="url(#colorPlug)" strokeWidth={2} />
                                </>
                            )}

                            {/* Focused Individual View when Single Appliance is selected */}
                            {filter === 'Heating' && <Area type="monotone" dataKey="heating" name="Heating & AC" stroke="#f43f5e" fill="url(#colorHvac)" strokeWidth={2.5} />}
                            {filter === 'EV' && <Area type="monotone" dataKey="ev" name="EV Charger" stroke="#8b5cf6" fill="url(#colorEV)" strokeWidth={2.5} />}
                            {filter === 'WaterHeater' && <Area type="monotone" dataKey="waterHeater" name="Water Heater & Boiler" stroke="#ef4444" fill="url(#colorHvac)" strokeWidth={2.5} />}
                            {filter === 'Laundry' && <Area type="monotone" dataKey="laundry" name="Washing Machine & Dryer" stroke="#3b82f6" fill="url(#colorAppliances)" strokeWidth={2.5} />}
                            {filter === 'Kitchen' && <Area type="monotone" dataKey="kitchen" name="Kitchen & Smart Fridge" stroke="#10b981" fill="url(#colorAppliances)" strokeWidth={2.5} />}
                            {filter === 'Pumps' && <Area type="monotone" dataKey="pumps" name="Pumps & Irrigation" stroke="#0ea5e9" fill="url(#colorPlug)" strokeWidth={2.5} />}
                            {filter === 'Plug' && <Area type="monotone" dataKey="plug" name="Plug Loads & TV" stroke="#6366f1" fill="url(#colorPlug)" strokeWidth={2.5} />}
                            {filter === 'Solar' && <Area type="monotone" dataKey="solar" name="Solar Inverter & Battery" stroke="#f59e0b" fill="url(#colorEV)" strokeWidth={2.5} />}
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
