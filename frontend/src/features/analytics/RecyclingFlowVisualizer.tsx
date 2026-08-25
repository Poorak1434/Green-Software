import { ArrowRight, Droplet, Wind, WashingMachine, Archive } from 'lucide-react';

export const RecyclingFlowVisualizer = () => {
    return (
        <div className="panel-soft p-6 col-span-1 lg:col-span-2 overflow-hidden relative group">
            <div className="mb-8 relative z-10">
                <h2 className="text-xl font-extrabold text-slate-700 tracking-tight">Active Recycling Flows</h2>
                <p className="text-sm text-slate-500 font-bold mt-1">Real-time status of configured grey-water routing.</p>
            </div>

            <div className="space-y-12 py-4 relative z-10 w-full overflow-x-auto overflow-y-hidden pb-8 sm:pb-4 hide-scrollbar">

                {/* Flow 1: AC Condensate to Aux Tank */}
                <div className="relative min-w-[700px] sm:min-w-fit">
                    <div className="absolute top-1/2 left-0 w-full h-[6px] shadow-[inset_1px_1px_3px_#d1d9e6,_inset_-1px_-1px_3px_#ffffff] bg-[#f4f7fa] -translate-y-1/2 rounded-full z-0 overflow-hidden">
                        {/* Animated flow line */}
                        <div className="h-full bg-emerald-400 w-[150%] Origin-left animate-[flow_2s_linear_infinite]" style={{ transformOrigin: 'left', animation: 'flow 2.5s linear infinite', background: 'linear-gradient(90deg, transparent, #10b981, transparent)', backgroundSize: '15% 100%' }}></div>
                    </div>

                    <div className="relative z-10 flex justify-between items-center px-4 w-full">

                        <div className="flex flex-col items-center gap-2 panel-soft-inset px-6 py-3 border border-white/40">
                            <div className="w-14 h-14 rounded-2xl panel-soft flex items-center justify-center text-blue-500 border border-white relative group-hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                                <Wind className="w-7 h-7 drop-shadow-sm" />
                                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#f4f7fa] rounded-full shadow-[0_0_8px_#10b981]"></span>
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">Master AC Unit</span>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Source</span>
                        </div>

                        <div className="panel-soft px-5 py-2 z-10">
                            <span className="text-[11px] font-extrabold text-emerald-500 flex items-center gap-1.5 uppercase tracking-wide">
                                <Droplet className="w-3.5 h-3.5" />
                                12 L/hr flowing
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 panel-soft-inset px-6 py-3 border border-white/40">
                            <div className="w-14 h-14 rounded-2xl panel-soft flex items-center justify-center text-emerald-500 border border-white group-hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                                <Archive className="w-7 h-7 drop-shadow-sm" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">Garden Aux Tank</span>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Destination</span>
                        </div>

                    </div>
                </div>

                {/* Flow 2: Washing Machine Marinate */}
                <div className="relative min-w-[700px] sm:min-w-fit mt-8">
                    <div className="absolute top-1/2 left-0 w-full h-[6px] shadow-[inset_1px_1px_3px_#d1d9e6,_inset_-1px_-1px_3px_#ffffff] bg-[#f4f7fa] -translate-y-1/2 rounded-full z-0">
                        {/* Not flowing currently */}
                    </div>

                    <div className="relative z-10 flex justify-between items-center px-4 w-full">

                        <div className="flex flex-col items-center gap-2 panel-soft px-6 py-3 border border-white/40">
                            <div className="w-14 h-14 rounded-2xl panel-soft-inset flex items-center justify-center text-indigo-500 border border-white scale-95">
                                <WashingMachine className="w-7 h-7 drop-shadow-sm" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">Washing Machine</span>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Routine</span>
                        </div>

                        <div className="panel-soft px-5 py-2 z-10">
                            <span className="text-[11px] font-extrabold text-amber-500 flex items-center gap-1.5 tracking-wide">
                                SOAKING (15m remaining)
                            </span>
                        </div>

                        <div className="flex flex-col items-center gap-2 panel-soft px-6 py-3 border border-white/40 opacity-60">
                            <div className="w-14 h-14 rounded-2xl fill-[#f4f7fa] flex items-center justify-center text-slate-400">
                                <div className="absolute inset-0 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff] rounded-2xl w-full h-full"></div>
                                <ArrowRight className="w-7 h-7 drop-shadow-sm relative z-10" />
                            </div>
                            <span className="text-xs font-bold text-slate-600 mt-2">Main Drain</span>
                            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">Paused</span>
                        </div>

                    </div>
                </div>

            </div>

            {/* Add inline styles for animation keyframes since tailwind arbitrarily doesn't support complex translating out of box */}
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes flow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

        </div>
    );
};
