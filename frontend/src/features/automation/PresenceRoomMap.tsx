import React from 'react';
import { Home, Users, Zap, Wind, Sun, Power, CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export interface RoomState {
    id: string;
    name: string;
    occupied_by: string[];
    ac_status: string;
    ac_setpoint_c: number;
    ambient_temp_c: number;
    lights_status: string;
    lights_brightness: number;
    power_draw_w: number;
}

interface PresenceRoomMapProps {
    rooms: RoomState[];
    personNames: Record<string, string>;
}

export const PresenceRoomMap: React.FC<PresenceRoomMapProps> = ({ rooms, personNames }) => {
    return (
        <div className="panel-soft rounded-3xl p-6 border border-white/60 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Home className="w-6 h-6 text-emerald-600 drop-shadow-sm" />
                        Live Presence & Zone Map
                    </h2>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                        Real-time occupant tracking and automated climate & lighting control
                    </p>
                </div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full border border-emerald-300/60 uppercase tracking-widest flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Radar & BLE Active
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rooms.map((room) => {
                    const isOccupied = room.occupied_by.length > 0;
                    const occupantNames = room.occupied_by.map((id) => personNames[id] || id);

                    return (
                        <div
                            key={room.id}
                            className={`rounded-3xl p-6 border transition-all duration-300 relative overflow-hidden ${
                                isOccupied
                                    ? 'bg-gradient-to-b from-white/90 to-emerald-50/60 border-emerald-400/80 shadow-[6px_6px_16px_#b8bec5,_-6px_-6px_16px_#ffffff]'
                                    : 'panel-soft-inset border-white/40 opacity-80'
                            }`}
                        >
                            {/* Accent Glow */}
                            {isOccupied && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                            )}

                            {/* Room Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-black text-slate-800 tracking-tight">
                                    {room.name}
                                </h3>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                        isOccupied
                                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                                            : 'bg-slate-200 text-slate-500'
                                    }`}
                                >
                                    {isOccupied ? 'Occupied' : 'Vacant'}
                                </span>
                            </div>

                            {/* Occupant Badges */}
                            <div className="min-h-[36px] flex items-center gap-2 mb-4 flex-wrap">
                                {isOccupied ? (
                                    occupantNames.map((name, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5"
                                        >
                                            <UserCheck className="w-3.5 h-3.5" />
                                            {name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs font-semibold text-slate-400 italic">
                                        No presence detected
                                    </span>
                                )}
                            </div>

                            {/* Controls Status */}
                            <div className="space-y-3 pt-2 border-t border-slate-200/60">
                                {/* AC Status */}
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Wind className="w-4 h-4 text-teal-500" /> Climate / AC
                                    </span>
                                    <span className={room.ac_status.includes('ON') ? 'text-emerald-700 font-extrabold' : 'text-slate-500'}>
                                        {room.ac_status} ({room.ac_setpoint_c}°C)
                                    </span>
                                </div>

                                {/* Lighting Status */}
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Sun className="w-4 h-4 text-amber-500" /> Lighting
                                    </span>
                                    <span className={room.lights_status === 'ON' ? 'text-amber-600 font-extrabold' : 'text-slate-500'}>
                                        {room.lights_status} ({room.lights_brightness}%)
                                    </span>
                                </div>

                                {/* Power Consumption */}
                                <div className="flex items-center justify-between text-xs font-bold pt-1">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Zap className="w-4 h-4 text-indigo-500" /> Power Load
                                    </span>
                                    <span className="text-slate-800 font-black">
                                        {room.power_draw_w} W
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
