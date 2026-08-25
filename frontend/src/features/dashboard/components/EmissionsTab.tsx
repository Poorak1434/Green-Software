import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Wind, Leaf, Settings2 } from 'lucide-react';

const DATA_EMISSIONS = [
    { day: '1', current: 20, predicted: 22, threshold: 120 },
    { day: '5', current: 45, predicted: 48, threshold: 120 },
    { day: '10', current: 75, predicted: 72, threshold: 120 },
    { day: '15', current: 95, predicted: 90, threshold: 120 },
    { day: '20', current: 110, predicted: 105, threshold: 120 },
    { day: '25', current: 125, predicted: 115, threshold: 120 },
    { day: '30', current: 140, predicted: 130, threshold: 120 },
];

const DATA_GREEN = [
    { day: '1', generated: 5, goal: 30 },
    { day: '5', generated: 15, goal: 30 },
    { day: '10', generated: 22, goal: 30 },
    { day: '15', generated: 28, goal: 30 },
    { day: '20', generated: 35, goal: 30 },
    { day: '25', generated: 42, goal: 30 },
    { day: '30', generated: 55, goal: 30 },
];

export const EmissionsTab = () => {
    const [subTab, setSubTab] = useState<'footprint' | 'green'>('footprint');

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Dual Sub-Tabs */}
            <div className="flex gap-4">
                <button
                    onClick={() => setSubTab('footprint')}
                    className={`flex-1 panel-soft rounded-2xl p-6 border transition-all duration-300 ${subTab === 'footprint' ? 'border-indigo-400 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff]' : 'border-white/60 hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]'}`}
                >
                    <div className={`flex items-center gap-3 mb-2 ${subTab === 'footprint' ? 'text-indigo-500' : 'text-slate-400'}`}>
                        <Wind className="w-5 h-5 drop-shadow-sm" />
                        <h4 className="text-sm font-extrabold uppercase tracking-wide">Carbon Footprint</h4>
                    </div>
                    <div className="flex items-end gap-2 mt-4">
                        <span className="text-3xl font-extrabold text-slate-700 drop-shadow-sm tracking-tight">174.8 <span className="text-sm uppercase text-slate-500">kg</span></span>
                        <span className="text-xs font-bold text-emerald-500 mb-1 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">↓ 3.93% Last Month</span>
                    </div>
                </button>

                <button
                    onClick={() => setSubTab('green')}
                    className={`flex-1 panel-soft rounded-2xl p-6 border transition-all duration-300 ${subTab === 'green' ? 'border-emerald-400 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff]' : 'border-white/60 hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]'}`}
                >
                    <div className={`flex items-center gap-3 mb-2 ${subTab === 'green' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        <Leaf className="w-5 h-5 drop-shadow-sm" />
                        <h4 className="text-sm font-extrabold uppercase tracking-wide">Green Energy Stats</h4>
                    </div>
                    <div className="flex items-end gap-2 mt-4">
                        <span className="text-3xl font-extrabold text-slate-700 drop-shadow-sm tracking-tight">207.7 <span className="text-sm uppercase text-slate-500">kWh</span></span>
                        <span className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-widest pl-2 border-l border-slate-300">Total Generated</span>
                    </div>
                </button>
            </div>

            {/* Main Chart Panel */}
            <div className="panel-soft rounded-3xl p-6 border border-white/60">
                <div className="flex justify-between items-start mb-8 relative z-10 w-full">
                    <div>
                        <h3 className="text-lg font-extrabold tracking-tight text-slate-700 drop-shadow-sm">
                            {subTab === 'footprint' ? 'Cumulative Emissions' : 'Green Energy Output'}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 tracking-wide mt-1">
                            {subTab === 'footprint' ? 'Comparing current trajectory vs predicted and threshold limits.' : 'Tracking sustainable energy generation against target goals.'}
                        </p>
                    </div>
                    <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                        <Settings2 className="w-5 h-5 drop-shadow-sm" />
                    </div>
                </div>

                <div className="w-full h-[350px] relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                        {subTab === 'footprint' ? (
                            <LineChart data={DATA_EMISSIONS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    labelStyle={{ color: '#64748b', fontWeight: '800', marginBottom: '4px' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '800', color: '#64748b' }} iconType="circle" />

                                <ReferenceLine y={120} label={{ position: 'top', value: 'Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 800 }} stroke="#ef4444" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="current" name="Current Emission" stroke="#6366f1" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0, fill: '#6366f1', filter: 'drop-shadow(0px 0px 5px rgba(99,102,241,0.8))' }} dot={false} />
                                <Line type="monotone" dataKey="predicted" name="Predicted" stroke="#94a3b8" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        ) : (
                            <LineChart data={DATA_GREEN} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                                    itemStyle={{ fontWeight: 'bold' }}
                                    labelStyle={{ color: '#64748b', fontWeight: '800', marginBottom: '4px' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '800', color: '#64748b' }} iconType="circle" />

                                <ReferenceLine y={30} label={{ position: 'top', value: 'Goal', fill: '#10b981', fontSize: 10, fontWeight: 800 }} stroke="#10b981" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="generated" name="Energy Generated" stroke="#10b981" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981', filter: 'drop-shadow(0px 0px 5px rgba(16,185,129,0.8))' }} dot={false} />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
