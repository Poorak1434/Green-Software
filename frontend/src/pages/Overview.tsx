import React, { useEffect, useState } from 'react';
import { AlertCircle, Power } from 'lucide-react';
import { CostPredictedWidget } from '../features/dashboard/components/CostPredictedWidget';
import { CostChangeWidget } from '../features/dashboard/components/CostChangeWidget';
import { UsageEstimateWidget } from '../features/dashboard/components/UsageEstimateWidget';
import { ActiveAppliancesWidget } from '../features/dashboard/components/ActiveAppliancesWidget';
import { EnergyIntensityWidget } from '../features/dashboard/components/EnergyIntensityWidget';
import { CarbonFootprintWidget } from '../features/dashboard/components/CarbonFootprintWidget';

// --- Types ---
interface TankLevelWidgetProps {
    currentLevel: number;
    capacity: number;
    status: 'filling' | 'draining' | 'idle';
}

const TankLevelWidget: React.FC<TankLevelWidgetProps> = ({ currentLevel, capacity, status }) => {
    const isWarning = currentLevel < 15;
    const fillPercentage = Math.min(100, Math.max(0, currentLevel));

    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col items-center justify-center h-full min-h-[320px] relative overflow-hidden group">
            <div className="flex justify-between w-full items-start mb-8 relative z-10">
                <h3 className="text-sm font-extrabold text-slate-700 tracking-wide uppercase">Primary Water Tank</h3>
                <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-widest panel-soft-inset px-3 py-1.5 rounded-xl border border-white/40 shadow-[inset_1px_1px_2px_#ffffff,_inset_-1px_-1px_2px_#d1d9e6]">Live Data</span>
            </div>

            <div className="relative w-36 h-48 rounded-t-lg rounded-b-3xl border-[6px] border-slate-100 overflow-hidden bg-white shadow-inner flex flex-col justify-end isolate">

                {/* Fill Level Background */}
                <div
                    className={`w-full transition-all duration-1000 ease-in-out relative ${isWarning ? 'tank-water-warning' : 'tank-water-gradient'}`}
                    style={{ height: `${fillPercentage}%` }}
                >
                    {/* Surface reflection */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/30 rounded-full mx-1 mt-0.5 blur-[1px]"></div>
                </div>

                {/* Overlay Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center font-bold pb-2 z-10 w-full drop-shadow-md mix-blend-plus-lighter">
                    <span className={`text-4xl tracking-tighter ${isWarning ? 'text-red-900' : 'text-ocean-900'}`}>{Math.round(fillPercentage)}<span className="text-xl">%</span></span>
                </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2.5 w-full border-t border-white/60 pt-5 relative z-10">
                <div className="flex justify-between w-full text-sm font-extrabold text-slate-600 tracking-wide">
                    <span>Volume</span>
                    <span>{Math.round((fillPercentage / 100) * capacity)}<span className="text-slate-400 text-xs ml-0.5 font-bold tracking-widest uppercase">/ {capacity} L</span></span>
                </div>
                <div className="flex justify-between w-full text-sm font-extrabold text-slate-600 tracking-wide">
                    <span>Status</span>
                    <span className={`uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-xl border border-white/50 shadow-sm font-bold ${status === 'filling' ? 'panel-soft text-ocean-600' : status === 'draining' ? 'panel-soft text-amber-500' : 'panel-soft-inset text-slate-500'}`}>
                        {status}
                    </span>
                </div>

                {isWarning && (
                    <div className="w-full mt-2 bg-red-50 text-red-600 text-xs font-semibold px-3 py-2 rounded-lg flex items-center justify-center gap-2 animate-pulse border border-red-100">
                        <AlertCircle size={14} /> Critical: Low Water Level
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Main Page Component ---
export const Overview: React.FC = () => {
    // Simulate WebSocket connection for real-time tank data
    const [tankData, setTankData] = useState<{ level: number; status: 'filling' | 'draining' | 'idle' }>({
        level: 68,
        status: 'idle'
    });

    const [pumpActive, setPumpActive] = useState(false);
    const [isToggling, setIsToggling] = useState(false);

    useEffect(() => {
        // Mock incoming WebSocket messages every 3 seconds to simulate dynamic tank changes
        // If pump is active, it fills fast. If not, it drains slowly.
        const interval = setInterval(() => {
            setTankData(prev => {
                let delta = 0;
                if (pumpActive) {
                    delta = 8; // Filling quickly
                } else {
                    delta = -1.5; // Draining slowly
                }

                const newLevel = Math.max(5, Math.min(100, prev.level + delta));
                return {
                    level: newLevel,
                    status: newLevel === 100 ? 'idle' : pumpActive ? 'filling' : 'draining'
                };
            });
        }, 3000);
        return () => clearInterval(interval);
    }, [pumpActive]);

    const handleTogglePump = () => {
        setIsToggling(true);
        // Simulate network request delay
        setTimeout(() => {
            setPumpActive(!pumpActive);
            setIsToggling(false);
        }, 600);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Impact & Overview</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Real-time metrics and system health for your property.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: KPI Metrics & New Widgets */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CostPredictedWidget />
                    <CostChangeWidget />

                    <div className="md:col-span-2 h-72">
                        <UsageEstimateWidget />
                    </div>

                    <ActiveAppliancesWidget />
                    <EnergyIntensityWidget />

                    <div className="md:col-span-2">
                        <CarbonFootprintWidget />
                    </div>

                    {/* Quick Actions Panel */}
                    <div className="md:col-span-2 panel-soft rounded-3xl p-8 border border-white/60 mt-4 relative group">
                        <h3 className="text-sm font-extrabold text-slate-700 tracking-wide uppercase mb-6 relative z-10">Quick Actions</h3>
                        <div className="flex gap-4 relative z-10">

                            <div className="flex-1 panel-soft-inset border border-white/30 rounded-2xl p-5 flex items-center justify-between">
                                <div>
                                    <div className="font-extrabold text-slate-700 tracking-tight text-lg">Main Water Pump</div>
                                    <div className="text-xs font-bold text-slate-400 tracking-wide uppercase mt-1">Overrides automation schedule</div>
                                </div>

                                <button
                                    onClick={handleTogglePump}
                                    disabled={isToggling}
                                    className={`relative flex items-center justify-center w-16 h-16 rounded-full transition-all duration-300 border border-white/50 ${isToggling ? 'panel-soft-inset text-emerald-500 cursor-wait' :
                                        pumpActive ? 'panel-soft shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff,_inset_-2px_-2px_6px_rgba(255,_255,_255,_0.8),_inset_2px_2px_6px_rgba(209,_217,_230,_0.5)] text-emerald-500 hover:scale-105' : 'panel-soft text-slate-400 hover:text-emerald-500 hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]'
                                        }`}
                                >
                                    <Power size={26} className={`${isToggling ? 'animate-pulse' : 'drop-shadow-sm'} transition-colors duration-300`} />
                                    {/* Optional pulse ring when active */}
                                    {pumpActive && !isToggling && <span className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30 shadow-[0_0_15px_#10b981]"></span>}
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Right Column: Real-time Visualizer */}
                <div className="lg:col-span-1 h-full">
                    <TankLevelWidget
                        currentLevel={tankData.level}
                        capacity={1000}
                        status={tankData.status}
                    />
                </div>

            </div>
        </div>
    );
};

export default Overview;
