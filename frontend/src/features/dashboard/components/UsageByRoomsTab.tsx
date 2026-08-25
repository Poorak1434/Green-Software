import { Home, Settings2 } from 'lucide-react';

const ROOMS = ['Master Bedroom', 'Bedroom 1', 'Drawing Room', 'Living Room', 'Kitchen', 'Garage', 'Others'];
const DAYS = Array.from({ length: 30 }, (_, i) => i + 1);

// Generate mock heat data
const generateHeatData = () => {
    const data: Record<string, number[]> = {};
    ROOMS.forEach(room => {
        data[room] = DAYS.map(() => {
            // Bias kitchen and living room higher
            const max = (room === 'Kitchen' || room === 'Living Room') ? 5 : 3.5;
            return Number((Math.random() * max).toFixed(1));
        });
    });
    return data;
};

const HEAT_DATA = generateHeatData();

// Helper to determine cell color based on value
const getHeatColor = (val: number) => {
    if (val === 0) return 'bg-[#f8fafc]'; // slate-50
    if (val <= 1) return 'bg-[#bae6fd] opacity-60'; // sky-200
    if (val <= 2) return 'bg-[#7dd3fc] opacity-80'; // sky-300
    if (val <= 3) return 'bg-[#38bdf8]'; // sky-400
    if (val <= 4) return 'bg-[#0ea5e9]'; // sky-500
    return 'bg-[#0284c7] shadow-[0_0_8px_rgba(2,_132,_199,_0.5)] z-10'; // sky-600
};

export const UsageByRoomsTab = () => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="panel-soft rounded-3xl p-6 border border-white/60 overflow-x-auto hide-scrollbar">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 min-w-[600px] relative z-20">
                    <div className="flex items-center gap-3">
                        <div className="p-3 panel-soft-inset border border-white/40 rounded-xl text-sky-500 drop-shadow-sm">
                            <Home className="w-5 h-5 drop-shadow-sm" />
                        </div>
                        <div>
                            <h3 className="text-lg font-extrabold tracking-tight text-slate-700 drop-shadow-sm">Usage By Rooms</h3>
                            <p className="text-xs font-bold text-slate-500 tracking-wide mt-1">Heatmap of daily consumption across property zones (kWh).</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 items-center text-xs font-bold text-slate-500">
                            <div className="w-3 h-3 rounded bg-[#bae6fd]"></div> 0-1
                            <div className="w-3 h-3 rounded bg-[#7dd3fc]"></div> 1-2
                            <div className="w-3 h-3 rounded bg-[#38bdf8]"></div> 2-3
                            <div className="w-3 h-3 rounded bg-[#0ea5e9]"></div> 3-4
                            <div className="w-3 h-3 rounded bg-[#0284c7]"></div> &gt;4
                        </div>
                        <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 hover:text-emerald-500 transition-colors cursor-pointer">
                            <Settings2 className="w-5 h-5 drop-shadow-sm" />
                        </div>
                    </div>
                </div>

                <div className="min-w-[800px] pb-4 relative z-10">
                    <div className="grid grid-cols-[140px_1fr] gap-2">
                        {/* Y-Axis Label space */}
                        <div></div>

                        {/* X-Axis labels (Days) */}
                        <div className="flex justify-between px-2 mb-2">
                            {DAYS.map(day => (
                                <div key={`day-${day}`} className="text-[10px] font-extrabold text-slate-400 w-6 text-center">{day}</div>
                            ))}
                        </div>

                        {/* Heatmap Rows */}
                        {ROOMS.map(room => (
                            <div key={room} className="contents group">
                                <div className="text-xs font-extrabold text-slate-600 flex items-center justify-end pr-4 uppercase tracking-wide group-hover:text-sky-500 transition-colors">
                                    {room}
                                </div>
                                <div className="flex justify-between gap-1">
                                    {HEAT_DATA[room].map((val, idx) => (
                                        <div
                                            key={`${room}-day-${idx}`}
                                            className={`flex-1 aspect-square rounded cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-110 relative group/cell ${getHeatColor(val)}`}
                                            title={`${room}, Day ${idx + 1}: ${val} kWh`}
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute hidden group-hover/cell:block bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#eef2f6] text-slate-700 text-[10px] font-extrabold px-2 py-1 rounded shadow-lg border border-white border-b-sky-200 z-50 whitespace-nowrap">
                                                {val} kWh
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
