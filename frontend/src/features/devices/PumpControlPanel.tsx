import { useState } from 'react';
import { Power, Settings2, Loader2 } from 'lucide-react';
import clsx from 'clsx';

export const PumpControlPanel = () => {
    const [isPumpOn, setIsPumpOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Mock API Call to /api/devices/{id}/toggle
    const togglePump = async () => {
        setIsLoading(true);

        // Simulate network delay
        setTimeout(() => {
            setIsPumpOn(!isPumpOn);
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="panel-soft p-6 col-span-1 flex flex-col h-full relative group">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-700 tracking-tight">Main Water Pump</h2>
                    <p className="text-sm font-bold text-slate-500 mt-1 tracking-wide">Manual Override Control</p>
                </div>
                <div className="w-10 h-10 panel-soft-inset flex items-center justify-center rounded-xl text-slate-400 border border-white/30">
                    <Settings2 className="w-5 h-5" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-6 relative z-10">
                <button
                    onClick={togglePump}
                    disabled={isLoading}
                    className={clsx(
                        "relative flex items-center justify-center w-32 h-32 rounded-full transition-all duration-500 border border-white/50 disabled:opacity-75 disabled:cursor-not-allowed",
                        isPumpOn
                            ? "panel-soft shadow-[12px_12px_24px_#d1d9e6,_-12px_-12px_24px_#ffffff,_inset_-4px_-4px_8px_rgba(255,_255,_255,_0.8),_inset_4px_4px_8px_rgba(209,_217,_230,_0.5)]"
                            : "panel-soft-inset text-slate-400 shadow-[inset_8px_8px_16px_#d1d9e6,_inset_-8px_-8px_16px_#ffffff]"
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin drop-shadow-sm" />
                    ) : (
                        <Power className={clsx(
                            "w-12 h-12 transition-colors duration-500 drop-shadow-sm",
                            isPumpOn ? "text-emerald-500" : "text-slate-400"
                        )} />
                    )}

                    {/* Pulse effect when active */}
                    {isPumpOn && !isLoading && (
                        <div className="absolute inset-0 rounded-full border-[6px] border-emerald-400 animate-ping opacity-30 shadow-[0_0_20px_#10b981]" />
                    )}
                </button>

                <div className="mt-10 text-center">
                    <p className={clsx(
                        "text-3xl font-extrabold mb-2 tracking-tight transition-colors duration-500 drop-shadow-sm",
                        isPumpOn ? "text-emerald-600" : "text-slate-700"
                    )}>
                        {isPumpOn ? 'Motor Running' : 'Motor Offline'}
                    </p>
                    <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">
                        {isPumpOn ? 'Pumping water to main tank' : 'Idle state'}
                    </p>
                </div>
            </div>

            <div className="mt-auto px-5 py-4 panel-soft rounded-2xl border border-white/60 text-sm text-slate-600 flex justify-between items-center relative z-10">
                <span className="font-bold text-slate-500 tracking-wide uppercase text-xs">Current Draw:</span>
                <span className={clsx(
                    "font-extrabold text-lg tracking-tight drop-shadow-sm",
                    isPumpOn ? "text-sky-500" : "text-slate-600"
                )}>
                    {isPumpOn ? '8.4 Amps' : '0.0 Amps'}
                </span>
            </div>
        </div>
    );
};
