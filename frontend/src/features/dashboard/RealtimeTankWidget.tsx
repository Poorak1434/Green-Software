import { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';

export const RealtimeTankWidget = () => {
    // Real-time state representing water percentage 0-100
    const [waterLevelPct, setWaterLevelPct] = useState(65);

    useEffect(() => {
        // TODO: Implement WebSocket listener for topic 'home/+/telemetry'
        // const socket = io(URL);
        // socket.on('telemetry', (data) => {
        //    if (data.sensor === 'main_tank_ultrasonic') {
        //         const percentage = calculatePercentageFromDistance(data.value);
        //         setWaterLevelPct(percentage);
        //    }
        // });

        // Fallback simulation for MVP Demo
        const interval = setInterval(() => {
            setWaterLevelPct(prev => {
                const jitter = Math.random() * 2 - 1; // -1 to +1
                const newLevel = prev + jitter;
                return Math.min(Math.max(newLevel, 0), 100);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="panel-soft p-6 flex flex-col h-96 relative overflow-hidden group">
            {/* Background glowing effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-sky-200/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -mr-10 -mt-10 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-3 tracking-tight">
                        <div className="p-2 rounded-xl shadow-[inset_2px_2px_5px_rgba(209,_217,_230,_0.5),_inset_-2px_-2px_5px_rgba(255,_255,_255,_0.8)] bg-[#f4f7fa] text-sky-500">
                            <Waves className="w-5 h-5 drop-shadow-sm" />
                        </div>
                        Main Storage Tank
                    </h2>
                    <p className="text-sm text-slate-400 font-bold mt-1">Live Ultrasonic Telemetry</p>
                </div>
                <div className="text-right">
                    <span className="text-4xl font-extrabold text-sky-500 tracking-tight drop-shadow-sm">
                        {Math.round(waterLevelPct)}%
                    </span>
                    <p className="text-xs text-slate-400 font-bold tracking-widest uppercase mt-1">CAPACITY</p>
                </div>
            </div>

            <div className="flex-1 rounded-3xl bg-[#f4f7fa] shadow-[inset_8px_8px_16px_#d1d9e6,_inset_-8px_-8px_16px_#ffffff] relative overflow-hidden mx-12 border border-[#d1d9e6]/50">
                {/* Animated Water Fill */}
                <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-sky-500 to-sky-300 transition-all duration-1000 ease-in-out flex flex-col justify-start opacity-90 shadow-[0_-5px_20px_rgba(14,_165,_233,_0.3)]"
                    style={{ height: `${waterLevelPct}%` }}
                >
                    {/* SVG Wave Effect at the top of the water */}
                    <svg className="w-full absolute -top-[1.2rem] text-sky-300 opacity-90 drop-shadow-sm" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,133.3C672,128,768,160,864,176C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>

                {/* Tank Measurements Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between py-6 px-4 opacity-20 pointer-events-none">
                    <div className="w-full border-t border-slate-700/50 border-dashed drop-shadow-sm" />
                    <div className="w-full border-t border-slate-700/50 border-dashed drop-shadow-sm" />
                    <div className="w-full border-t border-slate-700/50 border-dashed drop-shadow-sm" />
                    <div className="w-full border-t border-slate-700/50 border-dashed drop-shadow-sm" />
                </div>
            </div>
        </div>
    );
};
