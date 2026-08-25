import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Settings2 } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

const BASE_ELECTRICITY = 168.96;
const BASE_GAS = 45.04;
const BASE_TOTAL = 214;

export const CostPredictedWidget = () => {
    const settings = useSettingsStore();
    const currencyConfig = settings.getCurrencyConfig();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const totalConverted = BASE_TOTAL * currencyConfig.rateVsUSD;

    const data = [
        { name: 'Electricity', value: BASE_ELECTRICITY * currencyConfig.rateVsUSD, color: '#0ea5e9' },
        { name: 'Gas', value: BASE_GAS * currencyConfig.rateVsUSD, color: '#f59e0b' },
    ];

    const activeItem = hoveredIndex !== null ? data[hoveredIndex] : null;

    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
            <div className="flex justify-between items-start mb-2 relative z-10 w-full">
                <h3 className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">Cost Predicted</h3>
                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex-1 relative min-h-[170px] flex items-center justify-center -mt-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={64}
                            outerRadius={84}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                            onMouseEnter={(_, index) => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                    className="transition-all duration-300 cursor-pointer"
                                    style={{
                                        filter: hoveredIndex === index
                                            ? 'drop-shadow(0px 0px 8px rgba(14,165,233,0.5)) scale(1.03)'
                                            : 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))',
                                        transformOrigin: 'center center'
                                    }}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Donut Display: Seamlessly shows Total or Hovered Slice */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-sm transition-all duration-300">
                    <span
                        className="text-[10px] font-extrabold uppercase tracking-widest transition-colors duration-300"
                        style={{ color: activeItem ? activeItem.color : '#94a3b8' }}
                    >
                        {activeItem ? activeItem.name : 'Predicted Total'}
                    </span>

                    <span className="text-lg sm:text-xl font-black text-slate-700 tracking-tight leading-none mt-1 transition-all duration-300">
                        {activeItem
                            ? `${currencyConfig.symbol}${activeItem.value.toFixed(2)}`
                            : settings.formatCost(BASE_TOTAL)
                        }
                    </span>

                    {activeItem && (
                        <span className="text-[10px] font-bold text-slate-400 mt-1 animate-fade-in">
                          {((activeItem.value / totalConverted) * 100).toFixed(1)}% of total
                        </span>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-4 pt-4 border-t border-white/60 relative z-10 w-full gap-2">
                {data.map((item, idx) => (
                    <div
                        key={item.name}
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className={`flex flex-col gap-1 items-center flex-1 p-1.5 rounded-xl cursor-pointer transition-all duration-200 ${
                            hoveredIndex === idx ? 'bg-white/70 shadow-sm border border-white/80' : ''
                        }`}
                    >
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full shadow-inner" style={{ backgroundColor: item.color }}></div>
                            <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">{item.name}</span>
                        </div>
                        <span className="text-sm font-extrabold text-slate-700 drop-shadow-sm">
                            {currencyConfig.symbol}{item.value.toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};
