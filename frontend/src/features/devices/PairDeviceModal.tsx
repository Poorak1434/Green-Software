import React, { useState, useEffect } from 'react';
import { Smartphone, QrCode, Wifi, Copy, Check, Terminal, ShieldCheck, X } from 'lucide-react';

interface PairDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PairDeviceModal: React.FC<PairDeviceModalProps> = ({ isOpen, onClose }) => {
    const [localIp, setLocalIp] = useState<string>('10.7.6.11');
    const [copied, setCopied] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'qr' | 'script'>('qr');

    useEffect(() => {
        // If loaded via IP directly in browser, use that IP; otherwise use Mac LAN Wi-Fi IP 10.7.6.11
        const host = window.location.hostname;
        if (host && host !== 'localhost' && host !== '127.0.0.1') {
            setLocalIp(host);
        } else {
            setLocalIp('10.7.6.11');
        }
    }, []);

    if (!isOpen) return null;

    const companionUrl = `http://${localIp}:5173/companion`;
    const curlScript = `curl -X POST http://${localIp}:8000/api/v1/devices/telemetry \\
  -H "Content-Type: application/json" \\
  -d '{"device_id": "galaxy-s24-ultra", "battery_level": 88, "is_charging": true, "power_draw_w": 4.5}'`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
            <div className="bg-[#e0e5ec] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[12px_12px_24px_#b8bec5,_-12px_-12px_24px_#ffffff] border border-white/60 relative overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-2xl bg-[#e0e5ec] text-slate-500 hover:text-slate-800 shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff] active:shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-[6px_6px_12px_#b8bec5,_-6px_-6px_12px_#ffffff]">
                        <Smartphone className="w-7 h-7 drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Connect Wi-Fi Device</h2>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
                            Pairing Samsung Galaxy S24 Ultra
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1.5 rounded-2xl bg-[#d1d9e6] shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] mb-6">
                    <button
                        onClick={() => setActiveTab('qr')}
                        className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === 'qr'
                                ? 'bg-[#e0e5ec] text-emerald-600 shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff]'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <QrCode className="w-4 h-4" /> QR Code Pairing
                    </button>
                    <button
                        onClick={() => setActiveTab('script')}
                        className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === 'script'
                                ? 'bg-[#e0e5ec] text-emerald-600 shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff]'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Terminal className="w-4 h-4" /> Termux / cURL Script
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'qr' ? (
                    <div className="text-center space-y-5">
                        <div className="p-6 bg-white rounded-3xl inline-block shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#ffffff] border border-slate-100">
                            {/* Stylized QR Code Visual */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(companionUrl)}`}
                                alt="Scan QR Code to connect Galaxy S24 Ultra"
                                className="w-44 h-44 mx-auto rounded-xl"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
                                <span>Mac Wi-Fi IP Address:</span>
                                <input
                                    type="text"
                                    value={localIp}
                                    onChange={(e) => setLocalIp(e.target.value)}
                                    className="w-28 text-center bg-[#d1d9e6] font-mono text-xs font-bold text-emerald-700 py-1 px-2 rounded-xl shadow-[inset_2px_2px_4px_#b8bec5,_inset_-2px_-2px_4px_#ffffff] outline-none"
                                />
                            </div>

                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                Scan with Samsung Galaxy S24 Ultra Camera
                            </p>
                            <div className="flex items-center gap-2 bg-[#d1d9e6] p-2.5 rounded-2xl shadow-[inset_2px_2px_4px_#b8bec5,_inset_-2px_-2px_4px_#ffffff]">
                                <input
                                    type="text"
                                    readOnly
                                    value={companionUrl}
                                    className="bg-transparent text-xs font-mono font-bold text-slate-700 w-full outline-none px-2"
                                />
                                <button
                                    onClick={() => handleCopy(companionUrl)}
                                    className="p-2 bg-[#e0e5ec] rounded-xl text-slate-600 hover:text-emerald-600 shadow-[2px_2px_4px_#b8bec5,_-2px_-2px_4px_#ffffff] active:scale-95 transition-all"
                                    title="Copy Link"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-left flex items-start gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-emerald-800">
                                Make sure your Galaxy S24 Ultra is connected to the same Wi-Fi network as this Mac.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-600">
                            Run this cURL telemetry command on your phone (using Termux, Tasker, or cURL):
                        </p>
                        <div className="relative bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl overflow-x-auto shadow-inner border border-slate-800">
                            <pre className="whitespace-pre-wrap break-all">{curlScript}</pre>
                            <button
                                onClick={() => handleCopy(curlScript)}
                                className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-500 font-semibold">
                            Supports continuous streaming every 5s to report battery %, temperature, and power consumption.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
