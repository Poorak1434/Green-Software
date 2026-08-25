import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, Settings2 } from 'lucide-react';

const DATA = [
    { time: '12am', tillNow: 120, predicted: 120 },
    { time: '4am', tillNow: 80, predicted: 80 },
    { time: '8am', tillNow: 250, predicted: 250 },
    { time: '12pm', tillNow: 310, predicted: 310 },
    { time: '4pm', tillNow: 360.7, predicted: 360.7 },
    { time: '8pm', predicted: 380 },
    { time: '11pm', predicted: 394.1 },
];

export const UsageEstimateWidget = () => {
    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-indigo-500 drop-shadow-sm">
                        <Activity className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold tracking-wide text-slate-700 uppercase drop-shadow-sm">Usage Estimate</h3>
                        <div className="flex gap-4 mt-1">
                            <span className="text-xs font-bold text-slate-500 tracking-wide"><span className="text-indigo-500 font-extrabold drop-shadow-sm">360.7 kWh</span> Till Now</span>
                            <span className="text-xs font-bold text-slate-500 tracking-wide"><span className="text-amber-500 font-extrabold drop-shadow-sm">394.1 kWh</span> Predicted</span>
                        </div>
                    </div>
                </div>

                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex-1 w-full min-h-[220px] mt-2 relative z-10 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={DATA} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="colorTillNow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                        <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dx={-10} />
                        <Tooltip
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                            itemStyle={{ fontWeight: 'bold' }}
                            labelStyle={{ color: '#64748b', fontWeight: '800', marginBottom: '4px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '15px', paddingLeft: '20px', fontSize: '12px', fontWeight: '800', color: '#64748b' }} iconType="circle" />

                        <Area type="monotone" dataKey="tillNow" name="Till Now" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTillNow)" activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1', filter: 'drop-shadow(0px 0px 4px rgba(99,102,241,0.8))' }} />
                        <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b', filter: 'drop-shadow(0px 0px 4px rgba(245,158,11,0.8))' }} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
