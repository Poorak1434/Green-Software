import React, { useEffect, useState } from 'react';
import { Users, UserCheck, Wind, Sun, Zap, Clock, CloudSun, ShieldCheck, Play, ArrowRightLeft, Sparkles, CheckCircle2, Thermometer } from 'lucide-react';
import { PresenceRoomMap, type RoomState } from '../features/automation/PresenceRoomMap';
import axios from 'axios';

interface FamilyProfile {
    id: string;
    name: string;
    role: string;
    avatar_color: string;
    preferred_temp_c: number;
    lighting_mood: string;
    assigned_room: string;
    typical_arrival_time: string;
    eco_mode_enabled: boolean;
    current_presence: {
        is_present: boolean;
        room_id: string | null;
        last_detected: string;
    };
}

export const FamilyProfilesPage: React.FC = () => {
    const [profiles, setProfiles] = useState<FamilyProfile[]>([
        {
            id: 'fam-01',
            name: 'Poorak Pandey',
            role: 'Primary Resident',
            avatar_color: 'from-emerald-400 to-teal-600',
            preferred_temp_c: 22.0,
            lighting_mood: 'Warm Day (75%)',
            assigned_room: 'Home Office',
            typical_arrival_time: '17:30',
            eco_mode_enabled: true,
            current_presence: { is_present: true, room_id: 'home-office', last_detected: 'Now' }
        },
        {
            id: 'fam-02',
            name: 'Ananya Pandey',
            role: 'Family Member',
            avatar_color: 'from-purple-400 to-indigo-600',
            preferred_temp_c: 24.0,
            lighting_mood: 'Soft Cool (60%)',
            assigned_room: 'Master Bedroom',
            typical_arrival_time: '18:15',
            eco_mode_enabled: true,
            current_presence: { is_present: false, room_id: null, last_detected: '1 hr ago' }
        },
        {
            id: 'fam-03',
            name: 'Rajesh Pandey',
            role: 'Family Member',
            avatar_color: 'from-amber-400 to-orange-600',
            preferred_temp_c: 23.5,
            lighting_mood: 'Daylight (90%)',
            assigned_room: 'Living Room',
            typical_arrival_time: '19:00',
            eco_mode_enabled: true,
            current_presence: { is_present: false, room_id: null, last_detected: '2 hrs ago' }
        }
    ]);

    const [rooms, setRooms] = useState<RoomState[]>([
        {
            id: 'home-office',
            name: 'Home Office',
            occupied_by: ['fam-01'],
            ac_status: 'ON',
            ac_setpoint_c: 22.0,
            ambient_temp_c: 22.5,
            lights_status: 'ON',
            lights_brightness: 75,
            power_draw_w: 650
        },
        {
            id: 'master-bedroom',
            name: 'Master Bedroom',
            occupied_by: [],
            ac_status: 'OFF (Pre-Cooling Scheduled)',
            ac_setpoint_c: 24.0,
            ambient_temp_c: 27.0,
            lights_status: 'OFF',
            lights_brightness: 0,
            power_draw_w: 0
        },
        {
            id: 'living-room',
            name: 'Living Room',
            occupied_by: [],
            ac_status: 'OFF',
            ac_setpoint_c: 23.5,
            ambient_temp_c: 26.2,
            lights_status: 'OFF',
            lights_brightness: 0,
            power_draw_w: 0
        }
    ]);

    const [selectedPersonId, setSelectedPersonId] = useState<string>('fam-01');
    const [selectedRoomId, setSelectedRoomId] = useState<string>('home-office');
    const [notification, setNotification] = useState<string | null>(null);

    const apiHost = window.location.hostname || 'localhost';

    const fetchFamilyData = async () => {
        try {
            const res = await axios.get(`http://${apiHost}:8000/api/v1/family/profiles`, { timeout: 2000 });
            if (res.data && res.data.profiles) {
                setProfiles(res.data.profiles);
                if (res.data.rooms) setRooms(res.data.rooms);
            }
        } catch (err) {
            console.warn('Backend family API timeout, running local simulation mode');
        }
    };

    useEffect(() => {
        fetchFamilyData();
    }, []);

    const triggerPresenceAction = async (action: 'ENTER' | 'LEAVE') => {
        const person = profiles.find((p) => p.id === selectedPersonId);
        const targetRoom = rooms.find((r) => r.id === selectedRoomId);

        if (!person || !targetRoom) return;

        try {
            await axios.post(`http://${apiHost}:8000/api/v1/family/presence`, {
                person_id: selectedPersonId,
                room_id: selectedRoomId,
                action: action
            }, { timeout: 2000 });
        } catch (e) {
            // Local simulation state fallback
        }

        // Local state update
        setProfiles((prevProfiles) =>
            prevProfiles.map((p) => {
                if (p.id === selectedPersonId) {
                    return {
                        ...p,
                        current_presence: {
                            is_present: action === 'ENTER',
                            room_id: action === 'ENTER' ? selectedRoomId : null,
                            last_detected: 'Just now'
                        }
                    };
                }
                return p;
            })
        );

        setRooms((prevRooms) =>
            prevRooms.map((r) => {
                if (r.id === selectedRoomId) {
                    if (action === 'ENTER') {
                        const newOccupants = r.occupied_by.includes(selectedPersonId)
                            ? r.occupied_by
                            : [...r.occupied_by, selectedPersonId];
                        return {
                            ...r,
                            occupied_by: newOccupants,
                            ac_status: 'ON',
                            ac_setpoint_c: person.preferred_temp_c,
                            ambient_temp_c: person.preferred_temp_c,
                            lights_status: 'ON',
                            lights_brightness: 80,
                            power_draw_w: 680
                        };
                    } else {
                        const newOccupants = r.occupied_by.filter((id) => id !== selectedPersonId);
                        const isVacant = newOccupants.length === 0;
                        return {
                            ...r,
                            occupied_by: newOccupants,
                            ac_status: isVacant ? 'OFF (Auto Cutoff)' : r.ac_status,
                            lights_status: isVacant ? 'OFF' : r.lights_status,
                            lights_brightness: isVacant ? 0 : r.lights_brightness,
                            power_draw_w: isVacant ? 0 : 450
                        };
                    }
                }
                return r;
            })
        );

        const msg = action === 'ENTER'
            ? `⚡ ${person.name} entered ${targetRoom.name}! AC set to ${person.preferred_temp_c}°C, Lights ON.`
            : `🌙 ${person.name} left ${targetRoom.name}. Devices automatically shut OFF to save energy.`;

        setNotification(msg);
        setTimeout(() => setNotification(null), 4000);
    };

    const personNames = profiles.reduce((acc, p) => {
        acc[p.id] = p.name;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2 relative z-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm flex items-center gap-3">
                        <Users className="w-8 h-8 text-emerald-600 drop-shadow-sm" />
                        AI Family Profiles & Room Automations
                    </h1>
                    <p className="text-slate-500 mt-2 font-bold tracking-wide">
                        Personalized climate & lighting preferences, presence auto-triggers, and predictive arrival pre-cooling.
                    </p>
                </div>
            </div>

            {/* Notification Banner */}
            {notification && (
                <div className="p-4 bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-500/20 flex items-center gap-3 animate-fade-in">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span>{notification}</span>
                </div>
            )}

            {/* Presence Room Map Component */}
            <PresenceRoomMap rooms={rooms} personNames={personNames} />

            {/* Interactive Presence Simulation Panel */}
            <div className="panel-soft rounded-3xl p-6 border border-white/60 space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-2">
                            <ArrowRightLeft className="w-5 h-5 text-indigo-500" />
                            Live Room Presence Simulator
                        </h2>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">
                            Simulate family member entering/leaving a room to test instant device auto-sync
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Member Select */}
                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                            Select Family Member
                        </label>
                        <select
                            value={selectedPersonId}
                            onChange={(e) => setSelectedPersonId(e.target.value)}
                            className="w-full bg-[#e0e5ec] border border-white/80 font-bold text-sm text-slate-700 p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] outline-none"
                        >
                            {profiles.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} ({p.preferred_temp_c}°C)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Room Select */}
                    <div>
                        <label className="block text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2">
                            Target Room / Zone
                        </label>
                        <select
                            value={selectedRoomId}
                            onChange={(e) => setSelectedRoomId(e.target.value)}
                            className="w-full bg-[#e0e5ec] border border-white/80 font-bold text-sm text-slate-700 p-3 rounded-2xl shadow-[inset_3px_3px_6px_#b8bec5,_inset_-3px_-3px_6px_#ffffff] outline-none"
                        >
                            {rooms.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex items-end gap-2">
                        <button
                            onClick={() => triggerPresenceAction('ENTER')}
                            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                            <UserCheck className="w-4 h-4" /> Enter Room
                        </button>
                        <button
                            onClick={() => triggerPresenceAction('LEAVE')}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                        >
                            Leave Room
                        </button>
                    </div>
                </div>
            </div>

            {/* Family Member Profiles Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Family Profiles & Preferences</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {profiles.map((p) => (
                        <div key={p.id} className="panel-soft rounded-3xl p-6 border border-white/60 space-y-4 relative overflow-hidden">
                            {/* Header */}
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${p.avatar_color} flex items-center justify-center text-white font-black text-lg shadow-md`}>
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-800">{p.name}</h3>
                                    <p className="text-xs font-bold text-slate-500">{p.role}</p>
                                </div>
                            </div>

                            {/* Preferences List */}
                            <div className="space-y-3 pt-2 border-t border-slate-200/60 text-xs">
                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Thermometer className="w-4 h-4 text-emerald-500" /> Preferred AC Temp
                                    </span>
                                    <span className="text-slate-800 font-extrabold text-sm">{p.preferred_temp_c}°C</span>
                                </div>

                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Sun className="w-4 h-4 text-amber-500" /> Lighting Mood
                                    </span>
                                    <span className="text-slate-700">{p.lighting_mood}</span>
                                </div>

                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-slate-500 flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-indigo-500" /> Typical Arrival
                                    </span>
                                    <span className="text-slate-700">{p.typical_arrival_time}</span>
                                </div>

                                <div className="flex items-center justify-between font-bold">
                                    <span className="text-slate-500">Eco-Optimization Mode</span>
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md font-extrabold text-[10px] uppercase">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Predictive Pre-Cooling & Weather Energy Saver Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Predictive Pre-Cooling Card */}
                <div className="panel-soft rounded-3xl p-6 border border-white/60 space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 panel-soft-inset rounded-2xl text-teal-600">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800">Predictive Arrival Pre-Cooling</h3>
                                <p className="text-xs font-bold text-slate-500">AI predicts commute times and pre-cools rooms 15m prior to entry</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="p-4 panel-soft-inset border border-white/40 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-800">Ananya Pandey • Master Bedroom</h4>
                                <p className="text-xs font-bold text-slate-500">Expected Arrival: 18:15 • Target: 24.0°C</p>
                            </div>
                            <span className="px-3 py-1.5 bg-teal-100 text-teal-800 text-xs font-black rounded-xl">
                                Scheduled (18:00)
                            </span>
                        </div>

                        <div className="p-4 panel-soft-inset border border-white/40 rounded-2xl flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-extrabold text-slate-800">Rajesh Pandey • Living Room</h4>
                                <p className="text-xs font-bold text-slate-500">Expected Arrival: 19:00 • Target: 23.5°C</p>
                            </div>
                            <span className="px-3 py-1.5 bg-teal-100 text-teal-800 text-xs font-black rounded-xl">
                                Scheduled (18:45)
                            </span>
                        </div>
                    </div>
                </div>

                {/* Weather & Electricity Saver Card */}
                <div className="panel-soft rounded-3xl p-6 border border-white/60 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 panel-soft-inset rounded-2xl text-amber-500">
                            <CloudSun className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800">Weather Energy Optimization</h3>
                            <p className="text-xs font-bold text-slate-500">Outdoor temperature & humidity dynamic climate modulation</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 panel-soft-inset rounded-2xl text-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">Outdoor Weather</span>
                            <div className="text-xl font-black text-slate-800 mt-0.5">34.2°C</div>
                            <span className="text-[10px] font-bold text-slate-500">68% Humidity</span>
                        </div>

                        <div className="p-3.5 panel-soft-inset rounded-2xl text-center">
                            <span className="text-[11px] font-bold text-slate-400 uppercase">AI Recommended Setpoint</span>
                            <div className="text-xl font-black text-emerald-600 mt-0.5">24.5°C</div>
                            <span className="text-[10px] font-bold text-emerald-600">Saves ~30% kWh</span>
                        </div>
                    </div>

                    <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/60 flex items-center justify-between text-xs font-bold text-emerald-800">
                        <span>Daily Estimated Electricity Cost Saved:</span>
                        <span className="text-sm font-black text-emerald-700">₹42.50 / day</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
