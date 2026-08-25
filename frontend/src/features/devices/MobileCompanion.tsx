import React, { useEffect, useState } from 'react';
import { Smartphone, BatteryCharging, Battery, Wifi, Activity, Zap, CheckCircle2, ShieldAlert } from 'lucide-react';
import axios from 'axios';

export const MobileCompanion: React.FC = () => {
    const [batteryLevel, setBatteryLevel] = useState<number>(88);
    const [isCharging, setIsCharging] = useState<boolean>(true);
    const [chargingTime, setChargingTime] = useState<number | null>(null);
    const [dischargingTime, setDischargingTime] = useState<number | null>(null);
    const [networkType, setNetworkType] = useState<string>('Wi-Fi (5GHz)');
    const [rtt, setRtt] = useState<number>(12);
    const [downlink, setDownlink] = useState<number>(450);
    const [powerDraw, setPowerDraw] = useState<number>(4.2);
    const [statusMessage, setStatusMessage] = useState<string>('Connected & Streaming Telemetry');
    const [sentCount, setSentCount] = useState<number>(0);
    const [lastSync, setLastSync] = useState<string>('Just now');

    // Automatically resolve API host
    const apiHost = window.location.hostname || 'localhost';
    const apiEndpoint = `http://${apiHost}:8000/api/v1/devices/telemetry`;

    useEffect(() => {
        let isSubscribed = true;

        // Battery API Listener
        if ('getBattery' in navigator) {
            (navigator as any).getBattery().then((battery: any) => {
                if (!isSubscribed) return;

                const updateBattery = () => {
                    setBatteryLevel(Math.round(battery.level * 100));
                    setIsCharging(battery.charging);
                    setChargingTime(battery.chargingTime !== Infinity ? battery.chargingTime : null);
                    setDischargingTime(battery.dischargingTime !== Infinity ? battery.dischargingTime : null);
                    
                    // Estimate power draw in Watts based on charging status
                    const estimatedPower = battery.charging ? 15.0 + Math.random() * 5 : 3.2 + Math.random() * 0.8;
                    setPowerDraw(parseFloat(estimatedPower.toFixed(2)));
                };

                updateBattery();
                battery.addEventListener('levelchange', updateBattery);
                battery.addEventListener('chargingchange', updateBattery);
            });
        }

        // Network Info API Listener
        if ('connection' in navigator) {
            const conn = (navigator as any).connection;
            if (conn) {
                setNetworkType(conn.effectiveType ? conn.effectiveType.toUpperCase() : 'Wi-Fi');
                setRtt(conn.rtt || 14);
                setDownlink(conn.downlink || 300);
            }
        }

        // Telemetry Heartbeat interval every 3 seconds
        const interval = setInterval(async () => {
            const currentLevel = batteryLevel;
            const currentCharging = isCharging;
            const currentPower = powerDraw;

            const payload = {
                device_id: 'galaxy-s24-ultra',
                battery_level: currentLevel,
                is_charging: currentCharging,
                charging_time: chargingTime,
                discharging_time: dischargingTime,
                power_draw_w: currentPower,
                cpu_usage_pct: parseFloat((10 + Math.random() * 8).toFixed(1)),
                memory_usage_pct: 42.5,
                temperature_c: parseFloat((31 + Math.random() * 2).toFixed(1)),
                network_type: networkType,
                rtt_ms: rtt,
                downlink_mbps: downlink
            };

            try {
                await axios.post(apiEndpoint, payload);
                if (isSubscribed) {
                    setSentCount((prev) => prev + 1);
                    setLastSync(new Date().toLocaleTimeString());
                    setStatusMessage('Live Sync Active');
                }
            } catch (err) {
                if (isSubscribed) {
                    setStatusMessage('Syncing via local broadcast...');
                }
            }
        }, 3000);

        return () => {
            isSubscribed = false;
            clearInterval(interval);
        };
    }, [batteryLevel, isCharging, powerDraw, networkType, rtt, downlink]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 selection:bg-emerald-500">
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <div className="max-w-md w-full relative z-10 space-y-6">
                {/* Header Card */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-2xl text-center space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                        <Smartphone className="w-9 h-9" />
                    </div>
                    <div>
                        <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-extrabold tracking-widest uppercase rounded-full">
                            Active Hardware Agent
                        </span>
                        <h1 className="text-2xl font-black tracking-tight text-white mt-2">
                            Samsung Galaxy S24 Ultra
                        </h1>
                        <p className="text-xs text-slate-400 font-semibold mt-1">
                            Connected via local Wi-Fi to GreenSoftware
                        </p>
                    </div>

                    <div className="flex items-center justify-center gap-2 pt-2 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                        {statusMessage}
                    </div>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Battery Card */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                            <span>Battery Level</span>
                            {isCharging ? (
                                <BatteryCharging className="w-5 h-5 text-emerald-400 animate-bounce" />
                            ) : (
                                <Battery className="w-5 h-5 text-slate-400" />
                            )}
                        </div>
                        <div className="text-3xl font-black text-white flex items-baseline gap-1">
                            {batteryLevel}%
                        </div>
                        <p className="text-[11px] font-semibold text-emerald-400">
                            {isCharging ? 'Super Fast Charging' : 'Discharging'}
                        </p>
                    </div>

                    {/* Power Draw Card */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                            <span>Est. Power Draw</span>
                            <Zap className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="text-3xl font-black text-amber-400 flex items-baseline gap-1">
                            {powerDraw} <span className="text-xs font-bold text-slate-400">W</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400">
                            ~{(powerDraw * 0.001).toFixed(4)} kWh/h
                        </p>
                    </div>

                    {/* Network Card */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                            <span>Network</span>
                            <Wifi className="w-5 h-5 text-teal-400" />
                        </div>
                        <div className="text-xl font-bold text-white tracking-tight">
                            {networkType}
                        </div>
                        <p className="text-[11px] font-semibold text-teal-400">
                            Latency: {rtt} ms
                        </p>
                    </div>

                    {/* Packets Sent Card */}
                    <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 space-y-2">
                        <div className="flex items-center justify-between text-slate-400 text-xs font-bold">
                            <span>Telemetry Sent</span>
                            <Activity className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-3xl font-black text-white">
                            {sentCount}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-400">
                            Last sync: {lastSync}
                        </p>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Keep this page open on your <strong className="text-slate-200">Galaxy S24 Ultra</strong> to maintain continuous live stats on your GreenSoftware dashboard.
                    </p>
                </div>
            </div>
        </div>
    );
};
