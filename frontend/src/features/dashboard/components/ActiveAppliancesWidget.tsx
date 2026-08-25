import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, Settings2 } from 'lucide-react';

const DATA = [
    { appliance: 'Heating & AC', usage: 1.4, color: '#f43f5e' },   // rose-500
    { appliance: 'EV Charge', usage: 0.9, color: '#8b5cf6' },      // violet-500
    { appliance: 'Plug Loads', usage: 0.8, color: '#0ea5e9' },     // sky-500
    { appliance: 'Refrigeration', usage: 0.7, color: '#10b981' },  // emerald-500
    { appliance: 'Lighting', usage: 0.4, color: '#f59e0b' },       // amber-500
    { appliance: 'Others', usage: 0.2, color: '#94a3b8' },         // slate-400
];

export const ActiveAppliancesWidget = () => {
    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-rose-500 drop-shadow-sm">
                        <Cpu className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <div>
                        <h3 className="text-sm font-extrabold tracking-wide text-slate-700 uppercase drop-shadow-sm">Active Appliances</h3>
                        <p className="text-xs font-bold text-slate-500 tracking-wide mt-1">Top 3 make up <span className="text-rose-500 font-extrabold drop-shadow-sm">70.3%</span> of net usage.</p>
                    </div>
                </div>

                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex-1 w-full min-h-[200px] mt-2 relative z-10 -ml-6">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={DATA} layout="vertical" margin={{ top: 0, right: 30, bottom: 0, left: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="appliance" type="category" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 11, fontWeight: 800 }} width={100} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.4)', radius: 8 }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                            itemStyle={{ fontWeight: 'bold' }}
                            formatter={(value: any) => [`${value} kWh`, 'Usage']}
                        />
                        <Bar dataKey="usage" radius={[0, 6, 6, 0]} barSize={16}>
                            {DATA.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
