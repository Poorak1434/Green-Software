import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { 
    Power, 
    ThermometerSun, 
    Settings2, 
    Droplets, 
    Zap, 
    RefreshCw,
    Wind
} from 'lucide-react';
import clsx from 'clsx';

// Interface for device state
interface DeviceState {
    id: string;
    name: string;
    icon: React.ElementType;
    isAuto: boolean;
    isOn: boolean;
    hasSlider: boolean;
    sliderValue?: number;
    sliderUnit?: string;
    sliderMin?: number;
    sliderMax?: number;
    colorClass: string;
}

export const ManualOverrides: React.FC = () => {
    // Initial mock state for devices
    const [devices, setDevices] = useState<DeviceState[]>([
        {
            id: 'hvac-1',
            name: 'Central HVAC',
            icon: Wind,
            isAuto: true,
            isOn: true,
            hasSlider: true,
            sliderValue: 72,
            sliderUnit: '°F',
            sliderMin: 60,
            sliderMax: 85,
            colorClass: 'text-sky-500'
        },
        {
            id: 'heater-1',
            name: 'Water Heater',
            icon: ThermometerSun,
            isAuto: true,
            isOn: true,
            hasSlider: true,
            sliderValue: 120,
            sliderUnit: '°F',
            sliderMin: 100,
            sliderMax: 140,
            colorClass: 'text-rose-500'
        },
        {
            id: 'pump-1',
            name: 'Main Water Pump',
            icon: Droplets,
            isAuto: true,
            isOn: false,
            hasSlider: false,
            colorClass: 'text-indigo-500'
        },
        {
            id: 'plug-1',
            name: 'Smart Plug Array',
            icon: Zap,
            isAuto: false,
            isOn: true,
            hasSlider: false,
            colorClass: 'text-emerald-500'
        }
    ]);

    const handleToggleAuto = (id: string) => {
        setDevices(prev => prev.map(d => 
            d.id === id ? { ...d, isAuto: !d.isAuto } : d
        ));
    };

    const handleTogglePower = (id: string) => {
        setDevices(prev => prev.map(d => 
            d.id === id ? { ...d, isOn: !d.isOn, isAuto: false } : d // Manually changing power turns off auto
        ));
    };

    const handleSliderChange = (id: string, value: number) => {
        setDevices(prev => prev.map(d => 
            d.id === id ? { ...d, sliderValue: value, isAuto: false } : d // Manually changing slider turns off auto
        ));
    };

    const handleResetAllToAuto = () => {
        setDevices(prev => prev.map(d => ({ ...d, isAuto: true })));
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

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-emerald-600">
                        <div className="p-2 panel-soft-inset rounded-xl drop-shadow-sm">
                            <Settings2 className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">Manual Overrides</h1>
                    </div>
                    <p className="text-slate-500 font-medium">Take direct control of automated systems. Overriding a system disables its AI schedule.</p>
                </div>

                <button
                    onClick={handleResetAllToAuto}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold tracking-wide transition-all duration-300 panel-soft text-slate-500 hover:text-emerald-600 hover:shadow-[inset_2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff]"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reset All to Auto
                </button>
            </motion.div>

            <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {devices.map((device) => {
                    const Icon = device.icon;
                    return (
                        <motion.div key={device.id} variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 relative overflow-hidden group">
                            {/* Decorative Background Blur */}
                            <div className={clsx("absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-16 -mt-16 z-0 opacity-10 transition-opacity duration-500", device.isOn ? "opacity-20" : "")} style={{ backgroundColor: device.isOn ? 'var(--tw-colors-emerald-500)' : 'var(--tw-colors-slate-300)' }}></div>

                            <div className="relative z-10 flex flex-col h-full justify-between">
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={clsx("p-4 rounded-2xl drop-shadow-sm transition-all duration-300", device.isOn ? "panel-soft-inset" : "panel-soft border border-white/50")}>
                                            {/* @ts-ignore - Lucide icon typing issue */}
                                            <Icon className={clsx("w-7 h-7 transition-colors duration-300", device.isOn ? device.colorClass : "text-slate-400")} />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-extrabold tracking-tight text-slate-700">{device.name}</h2>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className={clsx("w-2 h-2 rounded-full", device.isOn ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-slate-300")}></span>
                                                <span className="text-sm font-bold text-slate-500">{device.isOn ? 'System Online' : 'System Offline'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Auto/Manual Toggle */}
                                    <div className="flex flex-col items-end gap-2">
                                        <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Operation Mode</span>
                                        <button 
                                            onClick={() => handleToggleAuto(device.id)}
                                            className={clsx(
                                                "relative w-24 h-8 rounded-full p-1 transition-all duration-300 flex items-center",
                                                device.isAuto ? "panel-soft-inset bg-slate-100" : "panel-soft border border-white/60"
                                            )}
                                        >
                                            <div className={clsx(
                                                "absolute w-11 h-6 rounded-full flex items-center justify-center text-[10px] font-bold tracking-wider transition-all duration-300 drop-shadow-sm",
                                                device.isAuto ? "left-1 bg-white text-emerald-600" : "left-12 bg-slate-400 text-white"
                                            )}>
                                                {device.isAuto ? 'AUTO' : 'MANUAL'}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Controls */}
                                <div className={clsx("panel-soft-inset rounded-2xl p-6 transition-all duration-500", device.isAuto ? "opacity-50 pointer-events-none grayscale" : "opacity-100")}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Direct Power Control</span>
                                        <button 
                                            onClick={() => handleTogglePower(device.id)}
                                            className={clsx(
                                                "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 drop-shadow-sm",
                                                device.isOn ? "panel-soft-inset border border-emerald-100 bg-emerald-50 text-emerald-500" : "panel-soft border border-white text-slate-400 hover:text-slate-600"
                                            )}
                                        >
                                            <Power className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {device.hasSlider && (
                                        <div className="mt-6 pt-6 border-t border-slate-200/50">
                                            <div className="flex justify-between items-end mb-4">
                                                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Target Value</span>
                                                <div className="text-2xl font-black text-slate-700 tracking-tight">
                                                    {device.sliderValue}<span className="text-sm font-bold text-slate-400 ml-1">{device.sliderUnit}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="relative h-2 bg-slate-200/50 rounded-full w-full border-y border-slate-100 shadow-inner">
                                                <div 
                                                    className="absolute h-full rounded-full transition-all duration-150 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                                                    style={{ 
                                                        width: `${((device.sliderValue! - device.sliderMin!) / (device.sliderMax! - device.sliderMin!)) * 100}%`,
                                                        background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)'
                                                    }}
                                                ></div>
                                                <input 
                                                    type="range" 
                                                    min={device.sliderMin} 
                                                    max={device.sliderMax} 
                                                    value={device.sliderValue}
                                                    onChange={(e) => handleSliderChange(device.id, Number(e.target.value))}
                                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                {/* Custom Thumb indicator */}
                                                <div 
                                                    className="absolute top-1/2 -mt-3 w-6 h-6 bg-white rounded-full shadow-[2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff] border border-slate-100 pointer-events-none transition-all duration-150 flex items-center justify-center"
                                                    style={{ 
                                                        left: `calc(${((device.sliderValue! - device.sliderMin!) / (device.sliderMax! - device.sliderMin!)) * 100}% - 12px)`
                                                    }}
                                                >
                                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-inner"></div>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400">
                                                <span>{device.sliderMin}{device.sliderUnit}</span>
                                                <span>{device.sliderMax}{device.sliderUnit}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {device.isAuto && (
                                    <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none z-20">
                                        <div className="bg-slate-800/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                                            <RefreshCw className="w-3 h-3 animate-spin" />
                                            AI Automated Schedule Active
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </motion.div>
    );
};

export default ManualOverrides;
