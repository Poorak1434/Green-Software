import { Activity, Power, PowerOff } from 'lucide-react';
import clsx from 'clsx';

// Connected Devices
const MOCK_DEVICES = [
    { id: 's24-ultra', name: 'Samsung Galaxy S24 Ultra', type: 'Smartphone (Wi-Fi)', status: 'online', lastSeen: 'Now (Live Stream)' },
    { id: '1', name: 'Main Water Pump', type: 'Actuator', status: 'offline', lastSeen: '2 mins ago' },
    { id: '2', name: 'Ultrasonic Tank Sensor', type: 'Sensor', status: 'online', lastSeen: 'Now' },
    { id: '3', name: 'Smart Flow Meter (Inlet)', type: 'Sensor', status: 'online', lastSeen: 'Now' },
    { id: '4', name: 'Washing Machine Relay', type: 'Actuator', status: 'online', lastSeen: '1 hr ago' },
];

export const DeviceList = () => {
    return (
        <div className="panel-soft rounded-3xl overflow-hidden border border-white/50">
            <div className="p-6 border-b border-[#d1d9e6]/50">
                <h2 className="text-xl font-extrabold text-slate-700 tracking-tight">Connected Hardware</h2>
                <p className="text-sm text-slate-500 font-bold mt-1">Nodes, Sensors, and Actuators</p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-[#f4f7fa] text-slate-400 border-b border-[#d1d9e6]/50 uppercase text-xs tracking-widest font-extrabold">
                        <tr>
                            <th className="px-6 py-4">Device Name</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Last Seen</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#d1d9e6]/30 bg-transparent">
                        {MOCK_DEVICES.map((device) => (
                            <tr key={device.id} className="hover:bg-white/40 transition-colors duration-300 group">
                                <td className="px-6 py-4 font-bold text-slate-700 flex items-center gap-4">
                                    <div className="w-10 h-10 panel-soft flex items-center justify-center rounded-xl text-slate-500 group-hover:text-emerald-500 group-hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] transition-all duration-300 border border-white/60">
                                        <Activity className="w-5 h-5 drop-shadow-sm" />
                                    </div>
                                    <span className="tracking-wide">{device.name}</span>
                                </td>
                                <td className="px-6 py-4 font-bold text-slate-500 tracking-wide">{device.type}</td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-extrabold tracking-widest uppercase border border-white/50",
                                        device.status === 'online'
                                            ? "panel-soft shadow-[inset_1px_1px_2px_#ffffff,_inset_-1px_-1px_2px_#d1d9e6,_2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff] text-emerald-600"
                                            : "panel-soft-inset text-slate-500"
                                    )}>
                                        {device.status === 'online' ? <Power className="w-3.5 h-3.5 drop-shadow-sm" /> : <PowerOff className="w-3.5 h-3.5 opacity-70" />}
                                        {device.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-slate-400 font-bold tracking-wide">{device.lastSeen}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
