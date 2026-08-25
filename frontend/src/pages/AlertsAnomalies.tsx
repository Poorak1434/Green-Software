import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
    Bell, 
    AlertTriangle, 
    ShieldAlert, 
    Activity, 
    AlertOctagon, 
    CheckCircle2, 
    Info 
} from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const MOCK_HOME_ID = 'home-123';

interface Alert {
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    message: string;
    timestamp: string;
    source: string;
    resolved: boolean;
}

export const AlertsAnomalies: React.FC = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unresolved'>('all');

    useEffect(() => {
        const fetchAlerts = async () => {
            setIsLoading(true);
            try {
                // Try fetching from the backend
                const response = await axios.get(`http://localhost:8000/api/v1/green/alerts/${MOCK_HOME_ID}`);
                setAlerts(response.data.alerts);
            } catch (error) {
                console.error("Error fetching alerts:", error);
                
                // Robust Fallback: Synthetic Mock Data
                const syntheticAlerts: Alert[] = [
                    {
                        id: 'alt-001',
                        severity: 'critical',
                        message: 'HVAC system running 40% above baseline. Potential compressor failure.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
                        source: 'HVAC Controller',
                        resolved: false
                    },
                    {
                        id: 'alt-002',
                        severity: 'high',
                        message: 'Unusual nighttime energy consumption detected in Zone B.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
                        source: 'Smart Meter 02',
                        resolved: false
                    },
                    {
                        id: 'alt-003',
                        severity: 'medium',
                        message: 'Smart plug #4 offline for > 12 hours.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(), // 14 hours ago
                        source: 'Network Gateway',
                        resolved: false
                    },
                    {
                        id: 'alt-004',
                        severity: 'low',
                        message: 'Routine firmware update required for Water Heater module.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
                        source: 'System Manager',
                        resolved: true
                    },
                    {
                        id: 'alt-005',
                        severity: 'high',
                        message: 'Solar inverter efficiency dropped by 15%.',
                        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
                        source: 'Solar Array',
                        resolved: true
                    }
                ];
                setAlerts(syntheticAlerts);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAlerts();
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

    const activeAlerts = alerts.filter(a => !a.resolved);
    const criticalAlerts = activeAlerts.filter(a => a.severity === 'critical' || a.severity === 'high');
    const systemHealth = activeAlerts.length === 0 ? 100 : Math.max(10, 100 - (criticalAlerts.length * 15) - (activeAlerts.length * 5));

    const displayedAlerts = filter === 'unresolved' ? activeAlerts : alerts;

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return <AlertOctagon className="w-5 h-5 text-rose-500" />;
            case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
            case 'medium': return <Info className="w-5 h-5 text-amber-500" />;
            case 'low': return <Bell className="w-5 h-5 text-emerald-500" />;
            default: return <Bell className="w-5 h-5 text-slate-500" />;
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
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">Alerts & Anomalies</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Real-time system monitoring, automated anomaly detection, and resolution tracking.</p>
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-rose-500">
                            <AlertOctagon className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Critical<br />Issues</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            {criticalAlerts.length}
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">Requires immediate attention</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-amber-500">
                            <Bell className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Active<br />Alerts</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            {activeAlerts.length}
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">Total unresolved system notifications</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-emerald-500">
                            <Activity className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">System<br />Health</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm flex items-end gap-1">
                            {systemHealth}<span className="text-lg font-bold text-slate-500 mb-1.5">%</span>
                        </div>
                        <p className={clsx("text-sm font-bold mt-2", systemHealth > 80 ? "text-emerald-500" : systemHealth > 50 ? "text-amber-500" : "text-rose-500")}>
                            {systemHealth > 80 ? 'Optimal' : systemHealth > 50 ? 'Degraded' : 'Critical'} status
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Alerts List */}
            <motion.div variants={itemVariants} className="panel-soft rounded-3xl border border-white/60 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-300/10 rounded-full blur-3xl -ml-20 -mt-20 z-0"></div>
                
                <div className="p-6 border-b border-white/40 flex justify-between items-center relative z-10">
                    <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm">Recent Activity Log</h3>
                    
                    <div className="panel-soft rounded-2xl p-1 flex">
                        <button
                            onClick={() => setFilter('unresolved')}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 ${filter === 'unresolved' ? 'panel-soft-inset text-emerald-600 shadow-[inset_2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            UNRESOLVED
                        </button>
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all duration-300 ${filter === 'all' ? 'panel-soft-inset text-emerald-600 shadow-[inset_2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            ALL LOGS
                        </button>
                    </div>
                </div>

                <div className="p-6 relative z-10">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <Activity className="w-10 h-10 text-emerald-500 animate-pulse drop-shadow-sm" />
                            <span className="mt-4 text-sm font-extrabold text-slate-400 uppercase tracking-widest">Loading Alerts...</span>
                        </div>
                    ) : displayedAlerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 drop-shadow-sm" />
                            <p className="font-extrabold tracking-tight text-lg text-slate-600">All Clear!</p>
                            <p className="text-sm font-semibold mt-1">No alerts or anomalies detected.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {displayedAlerts.map((alert) => (
                                <div 
                                    key={alert.id} 
                                    className={clsx(
                                        "p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4 hover:-translate-y-0.5",
                                        alert.resolved 
                                            ? "panel-soft-inset border-white/30 opacity-70" 
                                            : "panel-soft border-white/80 hover:shadow-[8px_8px_16px_#d1d9e6,_-8px_-8px_16px_#ffffff]"
                                    )}
                                >
                                    <div className={clsx(
                                        "p-3 rounded-xl flex-shrink-0 drop-shadow-sm",
                                        alert.resolved ? "panel-soft-inset" : "panel-soft border border-white/50"
                                    )}>
                                        {alert.resolved ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : getSeverityIcon(alert.severity)}
                                    </div>
                                    
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={clsx(
                                                "font-bold",
                                                alert.resolved ? "text-slate-500" : "text-slate-800"
                                            )}>
                                                {alert.message}
                                            </h4>
                                            <span className="text-xs font-semibold text-slate-400 whitespace-nowrap ml-4">
                                                {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                <span className="mx-1">•</span>
                                                {new Date(alert.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs font-bold text-slate-500 bg-white/40 px-2.5 py-1 rounded-lg">
                                                {alert.source}
                                            </span>
                                            {!alert.resolved && (
                                                <span className={clsx(
                                                    "text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full border",
                                                    alert.severity === 'critical' ? "bg-rose-100/50 text-rose-600 border-rose-200" :
                                                    alert.severity === 'high' ? "bg-orange-100/50 text-orange-600 border-orange-200" :
                                                    alert.severity === 'medium' ? "bg-amber-100/50 text-amber-600 border-amber-200" :
                                                    "bg-emerald-100/50 text-emerald-600 border-emerald-200"
                                                )}>
                                                    {alert.severity}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AlertsAnomalies;
