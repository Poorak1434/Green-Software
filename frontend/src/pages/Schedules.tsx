import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
    CalendarClock, 
    Zap, 
    Leaf, 
    Clock, 
    Sun, 
    Moon, 
    Home, 
    Briefcase
} from 'lucide-react';
import axios from 'axios';
import clsx from 'clsx';

const MOCK_HOME_ID = 'home-123';

interface ScheduleRoutine {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    timeWindow: string;
    isActive: boolean;
    devicesCount: number;
    colorClass: string;
}

interface TimelineEvent {
    id: string;
    time: string;
    title: string;
    device: string;
    action: string;
    type: 'on' | 'off' | 'adjust';
}

export const Schedules: React.FC = () => {
    const [routines, setRoutines] = useState<ScheduleRoutine[]>([]);
    const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                // Mocking an API call
                const response = await axios.get(`http://localhost:8000/api/v1/green/schedules/${MOCK_HOME_ID}`);
                setRoutines(response.data.routines);
                setTimeline(response.data.timeline);
            } catch (error) {
                console.error("Error fetching schedules:", error);
                
                // Fallback: Mock Data
                setRoutines([
                    {
                        id: 'sch-001',
                        title: 'Morning Eco Start',
                        description: 'Gradually warm up the house and turn on essential appliances.',
                        icon: Sun,
                        timeWindow: '06:00 AM - 08:30 AM',
                        isActive: true,
                        devicesCount: 4,
                        colorClass: 'text-amber-500'
                    },
                    {
                        id: 'sch-002',
                        title: 'Away Mode',
                        description: 'Minimize energy consumption while no one is home.',
                        icon: Briefcase,
                        timeWindow: '08:30 AM - 05:30 PM',
                        isActive: true,
                        devicesCount: 8,
                        colorClass: 'text-slate-500'
                    },
                    {
                        id: 'sch-003',
                        title: 'Evening Comfort',
                        description: 'Optimize lighting and HVAC for evening relaxation.',
                        icon: Home,
                        timeWindow: '05:30 PM - 10:30 PM',
                        isActive: false,
                        devicesCount: 6,
                        colorClass: 'text-indigo-500'
                    },
                    {
                        id: 'sch-004',
                        title: 'Nighttime Security',
                        description: 'Turn off all non-essential loads, secure perimeter lighting.',
                        icon: Moon,
                        timeWindow: '10:30 PM - 06:00 AM',
                        isActive: true,
                        devicesCount: 12,
                        colorClass: 'text-indigo-800'
                    }
                ]);

                setTimeline([
                    { id: 'evt-1', time: '06:00 AM', title: 'HVAC System', device: 'Central Heating', action: 'Set to 70°F', type: 'adjust' },
                    { id: 'evt-2', time: '06:30 AM', title: 'Water Heater', device: 'Main Unit', action: 'Turned ON', type: 'on' },
                    { id: 'evt-3', time: '08:30 AM', title: 'All Smart Plugs', device: 'Zone 1 & 2', action: 'Turned OFF', type: 'off' },
                    { id: 'evt-4', time: '05:30 PM', title: 'HVAC System', device: 'Central Heating', action: 'Set to 72°F', type: 'adjust' },
                    { id: 'evt-5', time: '06:00 PM', title: 'Garden Sprinklers', device: 'Main Pump', action: 'Turned ON', type: 'on' },
                    { id: 'evt-6', time: '06:30 PM', title: 'Garden Sprinklers', device: 'Main Pump', action: 'Turned OFF', type: 'off' },
                ]);
            }
        };

        fetchSchedules();
    }, []);

    const handleToggleRoutine = (id: string) => {
        setRoutines(prev => prev.map(r => 
            r.id === id ? { ...r, isActive: !r.isActive } : r
        ));
    };

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

    const activeCount = routines.filter(r => r.isActive).length;

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
                            <CalendarClock className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">Automated Schedules</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Manage daily routines and let AI optimize your energy consumption automatically.</p>
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-emerald-500">
                            <Clock className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Active<br />Routines</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            {activeCount} <span className="text-lg text-slate-400 font-bold">/ {routines.length}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-sky-500">
                            <Zap className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">AI Handled<br />Events</span>
                    </div>
                    <div>
                        <div className="text-4xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            128
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">Automated actions today</p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-300/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-emerald-600">
                            <Leaf className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest text-right">Est. Monthly<br />Savings</span>
                    </div>
                    <div className="relative z-10">
                        <div className="text-4xl font-black text-emerald-600 tracking-tighter drop-shadow-sm">
                            $42.50
                        </div>
                        <p className="text-sm font-bold text-emerald-600/70 mt-2">Based on current active routines</p>
                    </div>
                </motion.div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Timeline Column */}
                <motion.div variants={itemVariants} className="lg:col-span-1">
                    <div className="panel-soft rounded-3xl p-6 border border-white/60 h-full">
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm mb-6">Today's Timeline</h3>
                        
                        <div className="relative pl-6 border-l-2 border-slate-200 space-y-8">
                            {timeline.map((event) => (
                                <div key={event.id} className="relative">
                                    {/* Timeline Node */}
                                    <div className={clsx(
                                        "absolute -left-[33px] w-4 h-4 rounded-full border-4 border-white drop-shadow-sm",
                                        event.type === 'on' ? "bg-emerald-500" :
                                        event.type === 'off' ? "bg-slate-400" : "bg-sky-500"
                                    )}></div>
                                    
                                    <div className="text-xs font-extrabold text-slate-400 mb-1">{event.time}</div>
                                    <div className="panel-soft-inset p-4 rounded-2xl bg-white/40">
                                        <h4 className="font-bold text-slate-700">{event.title}</h4>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="text-xs font-semibold text-slate-500">{event.device}</span>
                                            <span className={clsx(
                                                "text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full",
                                                event.type === 'on' ? "bg-emerald-100/50 text-emerald-600" :
                                                event.type === 'off' ? "bg-slate-200/50 text-slate-500" : "bg-sky-100/50 text-sky-600"
                                            )}>
                                                {event.action}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Routines Grid */}
                <motion.div variants={containerVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {routines.map((routine) => {
                        const Icon = routine.icon;
                        return (
                            <motion.div key={routine.id} variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between h-full group hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff] transition-all duration-300">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={clsx("p-3 panel-soft-inset border border-white/50 rounded-2xl", routine.isActive ? routine.colorClass : "text-slate-400")}>
                                            {/* @ts-ignore */}
                                            <Icon className="w-6 h-6 drop-shadow-sm" />
                                        </div>
                                        
                                        {/* Toggle Switch */}
                                        <button 
                                            onClick={() => handleToggleRoutine(routine.id)}
                                            className={clsx(
                                                "relative w-14 h-7 rounded-full transition-all duration-300 drop-shadow-sm",
                                                routine.isActive ? "bg-emerald-400" : "panel-soft-inset bg-slate-200"
                                            )}
                                        >
                                            <div className={clsx(
                                                "absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300",
                                                routine.isActive ? "left-8" : "left-1"
                                            )}></div>
                                        </button>
                                    </div>
                                    
                                    <h3 className={clsx("text-lg font-extrabold tracking-tight mb-2 transition-colors", routine.isActive ? "text-slate-700" : "text-slate-500")}>
                                        {routine.title}
                                    </h3>
                                    <p className="text-sm font-medium text-slate-500 mb-4 line-clamp-2">
                                        {routine.description}
                                    </p>
                                </div>

                                <div className="mt-auto pt-4 border-t border-slate-200/50 flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 bg-white/50 px-2.5 py-1 rounded-lg">
                                        <Clock className="w-3.5 h-3.5" />
                                        {routine.timeWindow}
                                    </div>
                                    <div className="text-xs font-bold text-slate-400">
                                        {routine.devicesCount} devices
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Schedules;
