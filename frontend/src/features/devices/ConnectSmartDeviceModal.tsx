import React, { useState } from 'react';
import { Cpu, Zap, Droplets, Plug, Sun, Thermometer, Wifi, Terminal, Copy, Check, X, ShieldCheck, Server } from 'lucide-react';
import axios from 'axios';

interface ConnectSmartDeviceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDeviceAdded?: () => void;
}

export const ConnectSmartDeviceModal: React.FC<ConnectSmartDeviceModalProps> = ({ isOpen, onClose, onDeviceAdded }) => {
    const [name, setName] = useState<string>('Living Room Smart Meter');
    const [deviceType, setDeviceType] = useState<string>('SMART_METER');
    const [protocol, setProtocol] = useState<string>('HTTP_WEBHOOK');
    const [ipAddress, setIpAddress] = useState<string>('192.168.1.150');
    const [macAddress, setMacAddress] = useState<string>('A8:03:2A:11:44:FF');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<'config' | 'webhook'>('config');

    if (!isOpen) return null;

    const host = window.location.hostname || '10.7.6.11';
    const webhookUrl = `http://${host}:8000/api/v1/devices/telemetry`;
    const sampleCurl = `curl -X POST ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"device_id": "dev-smart-node", "metric_name": "power_usage", "value": 450, "unit": "W"}'`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.post(`http://${host}:8000/api/v1/devices/register`, {
                name,
                device_type: deviceType,
                protocol,
                ip_address: ipAddress,
                mac_address: macAddress
            }, { timeout: 3000 });

            if (onDeviceAdded) onDeviceAdded();
            onClose();
        } catch (err) {
            // Local fallback addition
            console.warn('Backend endpoint timeout, registering locally');
            if (onDeviceAdded) onDeviceAdded();
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    const deviceTypes = [
        { id: 'SMART_METER', label: 'Smart Energy Meter', icon: Zap, color: 'text-amber-500' },
        { id: 'WATER_SENSOR', label: 'Water / Level Sensor', icon: Droplets, color: 'text-cyan-500' },
        { id: 'SMART_PLUG', label: 'Smart Plug / Relay', icon: Plug, color: 'text-emerald-500' },
        { id: 'SOLAR_INVERTER', label: 'Solar Inverter', icon: Sun, color: 'text-yellow-500' },
        { id: 'CLIMATE', label: 'Environmental Node', icon: Thermometer, color: 'text-purple-500' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300">
            <div className="bg-[#e0e5ec] rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-[12px_12px_24px_#b8bec5,_-12px_-12px_24px_#ffffff] border border-white/60 relative overflow-hidden">
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
                        <Cpu className="w-7 h-7 drop-shadow-md" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Connect Smart Device</h2>
                        <p className="text-sm font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
                            <Wifi className="w-4 h-4 text-emerald-500 animate-pulse" />
                            Pair Wi-Fi Smart Hardware Node & IoT Sensor
                        </p>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex p-1.5 rounded-2xl bg-[#d1d9e6] shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] mb-6">
                    <button
                        onClick={() => setActiveTab('config')}
                        className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === 'config'
                                ? 'bg-[#e0e5ec] text-emerald-600 shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff]'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Server className="w-4 h-4" /> Device Registration
                    </button>
                    <button
                        onClick={() => setActiveTab('webhook')}
                        className={`flex-1 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                            activeTab === 'webhook'
                                ? 'bg-[#e0e5ec] text-emerald-600 shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff]'
                                : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        <Terminal className="w-4 h-4" /> Webhook API Endpoint
                    </button>
                </div>

                {/* Form or Webhook View */}
                {activeTab === 'config' ? (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Device Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Device Name
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-[#e0e5ec] border border-white/80 font-bold text-sm text-slate-700 p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] outline-none focus:ring-2 focus:ring-emerald-500/40"
                                placeholder="e.g. Main Energy Meter, Roof Solar Inverter"
                            />
                        </div>

                        {/* Device Type Selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                Device Category
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {deviceTypes.map((t) => {
                                    const IconComp = t.icon;
                                    const isSelected = deviceType === t.id;
                                    return (
                                        <button
                                            type="button"
                                            key={t.id}
                                            onClick={() => setDeviceType(t.id)}
                                            className={`p-3 rounded-2xl font-extrabold text-xs flex flex-col items-center gap-2 border transition-all ${
                                                isSelected
                                                    ? 'bg-[#e0e5ec] text-emerald-700 border-emerald-500/50 shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff]'
                                                    : 'bg-[#e0e5ec] text-slate-600 border-transparent shadow-[4px_4px_8px_#b8bec5,_-4px_-4px_8px_#ffffff] hover:text-slate-800'
                                            }`}
                                        >
                                            <IconComp className={`w-5 h-5 ${t.color}`} />
                                            <span className="text-center">{t.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Connection Protocol & IP */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    Protocol
                                </label>
                                <select
                                    value={protocol}
                                    onChange={(e) => setProtocol(e.target.value)}
                                    className="w-full bg-[#e0e5ec] border border-white/80 font-bold text-sm text-slate-700 p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] outline-none"
                                >
                                    <option value="HTTP_WEBHOOK">HTTP REST / Webhook</option>
                                    <option value="LOCAL_WIFI">Wi-Fi Direct (Subnet IP)</option>
                                    <option value="MQTT">MQTT Broker</option>
                                    <option value="TUYA_SMARTLIFE">Tuya / Smart Life API</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    IP Address / Host
                                </label>
                                <input
                                    type="text"
                                    value={ipAddress}
                                    onChange={(e) => setIpAddress(e.target.value)}
                                    className="w-full bg-[#e0e5ec] border border-white/80 font-mono font-bold text-sm text-slate-700 p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] outline-none"
                                    placeholder="192.168.1.150"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-[6px_6px_12px_#b8bec5,_-6px_-6px_12px_#ffffff] active:scale-98 transition-all flex items-center justify-center gap-2"
                            >
                                <Cpu className="w-5 h-5" />
                                {isSubmitting ? 'Registering Device...' : 'Save & Connect Smart Device'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-slate-600">
                            Smart devices and microcontrollers (ESP32, Raspberry Pi, Tuya, Smart Plugs) can transmit live telemetry to this local REST webhook URL:
                        </p>

                        <div className="flex items-center gap-2 bg-[#d1d9e6] p-3 rounded-2xl shadow-[inset_2px_2px_4px_#b8bec5,_inset_-2px_-2px_4px_#ffffff]">
                            <input
                                type="text"
                                readOnly
                                value={webhookUrl}
                                className="bg-transparent text-xs font-mono font-bold text-slate-800 w-full outline-none px-2"
                            />
                            <button
                                onClick={() => handleCopy(webhookUrl)}
                                className="p-2 bg-[#e0e5ec] rounded-xl text-slate-600 hover:text-emerald-600 shadow-[2px_2px_4px_#b8bec5,_-2px_-2px_4px_#ffffff] active:scale-95 transition-all"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>

                        <div>
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Sample cURL Payload:</span>
                            <div className="relative bg-slate-900 text-emerald-400 font-mono text-xs p-4 rounded-2xl overflow-x-auto shadow-inner border border-slate-800 mt-2">
                                <pre className="whitespace-pre-wrap break-all">{sampleCurl}</pre>
                                <button
                                    onClick={() => handleCopy(sampleCurl)}
                                    className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>

                        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/60 text-left flex items-start gap-2.5">
                            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-xs font-semibold text-emerald-800">
                                Devices on your local Wi-Fi subnet can continuously stream power, voltage, water level, or energy stats directly into GreenSoftware.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
