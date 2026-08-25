import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Settings2 } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const PERCENTAGE_CHANGE = 5.42;

export const CostChangeWidget = () => {
    const settings = useSettingsStore();
    const currencyConfig = settings.getCurrencyConfig();

    const data = [
        { month: 'Jan', cost: Number((203 * currencyConfig.rateVsUSD).toFixed(2)), color: '#94a3b8' },
        { month: 'Feb', cost: Number((214 * currencyConfig.rateVsUSD).toFixed(2)), color: '#0ea5e9' },
    ];

    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                <h3 className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">Change In Cost</h3>
                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex-1 min-h-[140px] w-full mt-2 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 0, bottom: 0, left: 0 }}>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }} dy={10} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.4)', radius: 8 }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.6)', backgroundColor: '#eef2f6', boxShadow: '5px 5px 10px #d1d9e6, -5px -5px 10px #ffffff' }}
                            itemStyle={{ fontWeight: 'bold', color: '#334155' }}
                            formatter={(value: any) => [`${currencyConfig.symbol}${value}`, 'Cost']}
                        />
                        <Bar dataKey="cost" radius={[6, 6, 0, 0]} maxBarSize={45}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 pt-4 border-t border-white/60 relative z-10 w-full flex justify-center">
                <div className="flex items-center gap-2 panel-soft-inset px-4 py-2 rounded-2xl border border-white/30 text-rose-500 shadow-[inset_2px_2px_4px_#d1d9e6,_inset_-2px_-2px_4px_#ffffff]">
                    <TrendingUp className="w-4 h-4 drop-shadow-sm" />
                    <span className="text-xs font-extrabold tracking-widest uppercase">{PERCENTAGE_CHANGE}% INCREASE IN COST</span>
                </div>
            </div>
        </div>
    );
};
