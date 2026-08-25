import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
    Recycle, 
    Droplets, 
    Flame, 
    Activity,
    CheckCircle2,
    AlertTriangle,
    BatteryCharging
} from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const MOCK_HOME_ID = 'home-123';

interface FlowMetrics {
    waterRecoveredGal: number;
    energyReusedKwh: number;
    systemEfficiency: number;
}

interface SystemComponent {
    id: string;
    name: string;
    type: 'filter' | 'pump' | 'battery' | 'inverter';
    health: 'optimal' | 'warning' | 'critical';
    lastMaintenance: string;
}

export const RecyclingFlows: React.FC = () => {
    const [metrics, setMetrics] = useState<FlowMetrics>({ waterRecoveredGal: 0, energyReusedKwh: 0, systemEfficiency: 0 });
    const [components, setComponents] = useState<SystemComponent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecyclingData = async () => {
            setIsLoading(true);
            try {
                // Mocking an API call
                const response = await axios.get(`http://localhost:8000/api/v1/green/recycling/${MOCK_HOME_ID}`);
                setMetrics(response.data.metrics);
                setComponents(response.data.components);
            } catch (error) {
                console.error("Error fetching recycling data:", error);
                
                // Fallback: Mock Data
                setMetrics({
                    waterRecoveredGal: 1450,
                    energyReusedKwh: 342,
                    systemEfficiency: 94
                });

                setComponents([
                    { id: 'comp-1', name: 'Main Greywater Filter', type: 'filter', health: 'optimal', lastMaintenance: '2 weeks ago' },
                    { id: 'comp-2', name: 'Irrigation Pump A', type: 'pump', health: 'warning', lastMaintenance: '6 months ago' },
                    { id: 'comp-3', name: 'Heat Exchanger Core', type: 'filter', health: 'optimal', lastMaintenance: '1 month ago' },
                    { id: 'comp-4', name: 'Solar Battery Bank 1', type: 'battery', health: 'optimal', lastMaintenance: '3 months ago' },
                    { id: 'comp-5', name: 'Grid Tie Inverter', type: 'inverter', health: 'optimal', lastMaintenance: '1 year ago' },
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecyclingData();
    }, []);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const getHealthIcon = (health: string) => {
        switch (health) {
            case 'optimal': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
            case 'critical': return <Activity className="w-5 h-5 text-rose-500" />;
            default: return null;
        }
    };

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-emerald-600">
                        <div className="p-2 panel-soft-inset rounded-xl drop-shadow-sm">
                            <Recycle className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">Recycling & Recovery</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Monitor active resource recovery systems and overall sustainability impact.</p>
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-sky-500">
                            <Droplets className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Water<br />Recovered</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            {metrics.waterRecoveredGal.toLocaleString()} <span className="text-lg text-slate-400 font-bold">Gal</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">Current month total</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-amber-500">
                            <Flame className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Energy<br />Reused</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            {metrics.energyReusedKwh.toLocaleString()} <span className="text-lg text-slate-400 font-bold">kWh</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">Thermal & electrical recovery</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-emerald-600">
                            <Activity className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">System<br />Efficiency</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black text-emerald-600 tracking-tighter drop-shadow-sm">
                            {metrics.systemEfficiency}<span className="text-lg text-emerald-600/70 font-bold">%</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-600/70 mt-2">Operating at peak capacity</p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Flow Visualizers */}
                <motion.div variants={containerVariants} className="lg:col-span-2 space-y-6">
                    {/* Greywater Flow */}
                    <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-8 border border-white/60">
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm mb-8 flex items-center gap-3">
                            <Droplets className="w-6 h-6 text-sky-500" />
                            Greywater Recovery System
                        </h3>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                            {/* Animated Flow Line Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-transparent via-sky-400 to-transparent w-1/3"
                                    animate={{ x: ['-100%', '300%'] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                />
                            </div>

                            <div className="panel-soft border border-white/80 p-4 rounded-2xl z-10 bg-slate-50 w-full md:w-auto text-center md:text-left flex flex-col items-center">
                                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Source</div>
                                <div className="font-bold text-slate-700">Showers & Sinks</div>
                                <div className="text-sky-500 text-sm font-bold mt-1">~40 gal/day</div>
                            </div>

                            <div className="panel-soft-inset p-4 rounded-2xl z-10 bg-slate-100 border border-white w-full md:w-auto flex flex-col items-center">
                                <Recycle className="w-8 h-8 text-emerald-500 mb-2 drop-shadow-sm" />
                                <div className="font-bold text-slate-700 text-center">Active Filtration</div>
                                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">UV + Carbon</div>
                            </div>

                            <div className="panel-soft border border-white/80 p-4 rounded-2xl z-10 bg-slate-50 w-full md:w-auto text-center md:text-right flex flex-col items-center">
                                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Destination</div>
                                <div className="font-bold text-slate-700">Garden Irrigation</div>
                                <div className="text-emerald-500 text-sm font-bold mt-1">100% Reused</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Thermal Flow */}
                    <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-8 border border-white/60">
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm mb-8 flex items-center gap-3">
                            <Flame className="w-6 h-6 text-amber-500" />
                            Thermal Energy Recovery
                        </h3>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                            {/* Animated Flow Line Background */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2 z-0 hidden md:block rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-transparent via-amber-400 to-transparent w-1/3"
                                    animate={{ x: ['-100%', '300%'] }}
                                    transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                                />
                            </div>

                            <div className="panel-soft border border-white/80 p-4 rounded-2xl z-10 bg-slate-50 w-full md:w-auto text-center flex flex-col items-center">
                                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Source</div>
                                <div className="font-bold text-slate-700">HVAC Waste Heat</div>
                                <div className="text-amber-500 text-sm font-bold mt-1">~12 kWh/day</div>
                            </div>

                            <div className="panel-soft-inset p-4 rounded-2xl z-10 bg-slate-100 border border-white w-full md:w-auto flex flex-col items-center">
                                <Activity className="w-8 h-8 text-rose-500 mb-2 drop-shadow-sm" />
                                <div className="font-bold text-slate-700 text-center">Heat Exchanger</div>
                                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">Coil Transfer</div>
                            </div>

                            <div className="panel-soft border border-white/80 p-4 rounded-2xl z-10 bg-slate-50 w-full md:w-auto text-center flex flex-col items-center">
                                <div className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">Destination</div>
                                <div className="font-bold text-slate-700">Water Heater Base</div>
                                <div className="text-rose-500 text-sm font-bold mt-1">Pre-heated</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* System Status List */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <div className="panel-soft rounded-3xl p-6 border border-white/60 h-full">
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm mb-6">Component Health</h3>
                        
                        <div className="space-y-4">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <Activity className="w-8 h-8 text-emerald-500 animate-pulse" />
                                </div>
                            ) : (
                                components.map(comp => (
                                    <div key={comp.id} className={clsx(
                                        "p-4 rounded-2xl transition-all duration-300 flex items-center justify-between",
                                        comp.health === 'warning' ? "panel-soft-inset border border-amber-200/50 bg-amber-50/30" : "panel-soft border border-white/50 hover:shadow-[5px_5px_15px_#d1d9e6,_-5px_-5px_15px_#ffffff]"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 panel-soft-inset rounded-xl">
                                                {comp.type === 'filter' ? <Recycle className="w-4 h-4 text-slate-500" /> :
                                                 comp.type === 'pump' ? <Droplets className="w-4 h-4 text-slate-500" /> :
                                                 comp.type === 'inverter' ? <Activity className="w-4 h-4 text-slate-500" /> :
                                                 <BatteryCharging className="w-4 h-4 text-slate-500" />}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-700 text-sm">{comp.name}</h4>
                                                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">Maint: {comp.lastMaintenance}</div>
                                            </div>
                                        </div>
                                        <div>
                                            {getHealthIcon(comp.health)}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default RecyclingFlows;
