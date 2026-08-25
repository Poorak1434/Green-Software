import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Lightbulb, Settings2 } from 'lucide-react';

const INTENSITY_VALUE = 47;
const MAX_INTENSITY = 100;

const DATA = [
    { name: 'Intensity', value: INTENSITY_VALUE, color: '#10b981' }, // emerald-500
    { name: 'Remaining', value: MAX_INTENSITY - INTENSITY_VALUE, color: '#e2e8f0' }, // slate-200
];

export const EnergyIntensityWidget = () => {
    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                <div className="flex items-center gap-3">
                    <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-emerald-500 drop-shadow-sm">
                        <Lightbulb className="w-5 h-5 drop-shadow-sm" />
                    </div>
                    <h3 className="text-sm font-extrabold tracking-wide text-slate-700 uppercase drop-shadow-sm">Energy Intensity</h3>
                </div>
                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex-1 relative min-h-[140px] flex flex-col items-center justify-end -mt-4">
                <div className="w-full h-full absolute inset-0 flex items-end justify-center pb-2 pointer-events-none">
                    <ResponsiveContainer width="100%" height="200%">
                        <PieChart>
                            <Pie
                                data={DATA}
                                cx="50%"
                                cy="100%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                            >
                                {DATA.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} style={index === 0 ? { filter: 'drop-shadow(0px 0px 6px rgba(16,185,129,0.5))' } : {}} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Center Text (Overlay inside gauge) */}
                <div className="relative z-10 flex flex-col items-center justify-end pb-4 drop-shadow-sm">
                    <span className="text-4xl font-extrabold text-slate-700 tracking-tight">{INTENSITY_VALUE}</span>
                    <span className="text-xs font-bold text-slate-500 tracking-widest uppercase mt-1">kWh / Sqft</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/60 relative z-10 w-full text-center">
                <p className="text-xs font-bold text-slate-500 tracking-wide">Intensity is <span className="text-emerald-500 font-extrabold">Optimal</span> based on historical data.</p>
            </div>
        </div>
    );
};
