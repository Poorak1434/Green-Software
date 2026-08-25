import { Leaf, Wind, Settings2 } from 'lucide-react';

export const CarbonFootprintWidget = () => {
    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">

            <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <h3 className="text-sm font-extrabold tracking-wide text-slate-500 uppercase">Carbon Footprint</h3>
                <div className="p-2 panel-soft-inset rounded-xl border border-white/40 text-slate-400 group-hover:text-emerald-500 transition-colors cursor-pointer">
                    <Settings2 className="w-4 h-4 drop-shadow-sm" />
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full relative z-10">
                {/* Emissions Progress */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                            <Wind className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-extrabold text-slate-600 tracking-wide uppercase">Emission</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-extrabold text-slate-700 drop-shadow-sm tracking-tight border-b-2 border-indigo-400">36.4 <span className="text-xs text-slate-500 font-bold uppercase">Kg</span></span>
                            <span className="text-xs font-bold text-slate-400 ml-2">/ 181.8 Kg (Predicted)</span>
                        </div>
                    </div>
                    <div className="h-4 w-full panel-soft-inset rounded-full overflow-hidden border border-white/50 p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-500 rounded-full relative shadow-[0_0_10px_rgba(99,_102,_241,_0.5)]"
                            style={{ width: `${(36.4 / 181.8) * 100}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full mx-1 mt-px blur-[1px]"></div>
                        </div>
                    </div>
                </div>

                {/* Green Energy Progress */}
                <div>
                    <div className="flex justify-between items-end mb-2">
                        <div className="flex items-center gap-2">
                            <Leaf className="w-4 h-4 text-emerald-500 drop-shadow-sm" />
                            <span className="text-xs font-extrabold text-emerald-600 tracking-wide uppercase">Green Energy Generated</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-extrabold text-slate-700 drop-shadow-sm tracking-tight border-b-2 border-emerald-400">21.2 <span className="text-xs text-slate-500 font-bold uppercase">kWh</span></span>
                            <span className="text-xs font-bold text-slate-400 ml-2">/ 50 kWh (Goal)</span>
                        </div>
                    </div>
                    <div className="h-4 w-full panel-soft-inset rounded-full overflow-hidden border border-white/50 p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full relative shadow-[0_0_10px_rgba(16,_185,_129,_0.5)]"
                            style={{ width: `${(21.2 / 50) * 100}%` }}
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-white/30 rounded-full mx-1 mt-px blur-[1px]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/60 relative z-10 w-full flex justify-center">
                <p className="text-xs font-bold text-slate-500 tracking-wide text-center">On track to meet monthly emission targets.</p>
            </div>
        </div>
    );
};
