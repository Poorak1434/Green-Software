import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Settings2, Calendar, TrendingDown } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const DATA_THIS_MONTH = [
    { day: '1', electricity: 5.2, gas: 1.8 },
    { day: '5', electricity: 6.1, gas: 2.1 },
    { day: '10', electricity: 4.8, gas: 1.5 },
    { day: '15', electricity: 7.2, gas: 2.5 },
    { day: '20', electricity: 6.8, gas: 2.2 },
    { day: '25', electricity: 5.5, gas: 1.9 },
    { day: '30', electricity: 4.9, gas: 1.6 },
];

const DATA_LAST_MONTH = [
    { day: '1', electricity: 6.8, gas: 2.4 },
    { day: '5', electricity: 7.5, gas: 2.8 },
    { day: '10', electricity: 5.9, gas: 2.0 },
    { day: '15', electricity: 8.4, gas: 3.2 },
    { day: '20', electricity: 7.9, gas: 2.9 },
    { day: '25', electricity: 6.7, gas: 2.3 },
    { day: '30', electricity: 6.1, gas: 1.9 },
];

export const CostAnalysisTab = () => {
    const [view, setView] = useState<'month' | 'last_month'>('month');
    const settings = useSettingsStore();
    const currencyConfig = settings.getCurrencyConfig();

    const activeRawData = view === 'month' ? DATA_THIS_MONTH : DATA_LAST_MONTH;

    // Scale data dynamically by current currency rate vs USD
    const scaledData = activeRawData.map(item => ({
        ...item,
        electricity: Number((item.electricity * currencyConfig.rateVsUSD).toFixed(2)),
        gas: Number((item.gas * currencyConfig.rateVsUSD).toFixed(2)),
    }));

    // Dynamic KPIs based on selected month view
    const kpis = view === 'month' ? [
        { label: 'Current Spend', value: settings.formatCost(178.9), color: 'text-indigo-600', icon: <Calendar className="w-3.5 h-3.5" /> },
        { label: 'Projected Total', value: settings.formatCost(214.0), color: 'text-amber-500', icon: <DollarSign className="w-3.5 h-3.5" /> },
        { label: 'Eco Savings So Far', value: settings.formatCost(14.5), color: 'text-emerald-500', icon: <TrendingDown className="w-3.5 h-3.5" /> },
        { label: 'Avg Daily Spend', value: settings.formatCost(6.8), color: 'text-slate-600', icon: <DollarSign className="w-3.5 h-3.5" /> },
    ] : [
        { label: 'Final Month Spend', value: settings.formatCost(203.0), color: 'text-slate-700', icon: <Calendar className="w-3.5 h-3.5" /> },
        { label: 'Peak Day Cost', value: settings.formatCost(11.6), color: 'text-rose-500', icon: <DollarSign className="w-3.5 h-3.5" /> },
        { label: 'Total Saved Last Month', value: settings.formatCost(18.2), color: 'text-emerald-500', icon: <TrendingDown className="w-3.5 h-3.5" /> },
        { label: 'Avg Daily Spend', value: settings.formatCost(7.4), color: 'text-slate-600', icon: <DollarSign className="w-3.5 h-3.5" /> },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* KPI Metrics Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {kpis.map((kpi, idx) => (
                    <div key={idx} className="panel-soft rounded-2xl p-5 border border-white/60 transition-all duration-300">
                        <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-extrabold text-slate-500 tracking-wide uppercase">{kpi.label}</h4>
                            <span className="p-1 rounded-lg bg-white/60 text-slate-400">{kpi.icon}</span>
                        </div>
                        <div className={`text-2xl font-black tracking-tight drop-shadow-sm ${kpi.color}`}>
                            {kpi.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Chart Panel */}
            <div className="panel-soft rounded-3xl p-6 border border-white/60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-10 w-full">
                    <div className="flex items-center gap-3">
                        <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-indigo-500 drop-shadow-sm">
                            <DollarSign className="w-5 h-5 drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-slate-700 drop-shadow-sm">
                                Daily Cost Breakdown ({view === 'month' ? 'This Month' : 'Last Month'})
                            </h3>
                            <p className="text-xs font-bold text-slate-500 tracking-wide mt-1">
                                Electricity vs Gas consumption costs in {currencyConfig.code}.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="panel-soft-inset rounded-xl p-1 flex border border-white/40">
                            {(['month', 'last_month'] as const).map(v => (
                                <button
                                    key={v}
                                    onClick={() => setView(v)}
                                    className={`px-4 py-1.5 rounded-lg text-xs font-extrabold tracking-wide uppercase transition-all duration-300 ${
                                        view === v ? 'panel-soft text-emerald-600 shadow-sm font-black' : 'text-slate-400 hover:text-slate-600'
                                    }`}
                                >
                                    {v === 'month' ? 'This Month' : 'Last Month'}
                                </button>
                            ))}
                        </div>
                        <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                            <Settings2 className="w-5 h-5 drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="w-full h-[400px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={scaledData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} tickFormatter={(value) => `${currencyConfig.symbol}${value}`} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.4)' }}
                                contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                                itemStyle={{ fontWeight: 'bold' }}
                                labelStyle={{ color: '#64748b', fontWeight: '800', marginBottom: '4px' }}
                                formatter={(value: any) => [`${currencyConfig.symbol}${Number(value).toFixed(2)}`]}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '800', color: '#64748b' }} iconType="circle" />
                            <Bar dataKey="electricity" name="Electricity" stackId="a" fill="#0ea5e9" radius={[0, 0, 4, 4]} maxBarSize={60} isAnimationActive={true} />
                            <Bar dataKey="gas" name="Gas" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} maxBarSize={60} isAnimationActive={true} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
