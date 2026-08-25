import { useState } from 'react';
import { ToggleRight, ToggleLeft, Settings2, Droplets, Zap, ShieldAlert } from 'lucide-react';

export const Automations = () => {
    // Basic local state to simulate logic changes
    const [autoCutoff, setAutoCutoff] = useState(true);
    const [dryRunProtection, setDryRunProtection] = useState(true);
    const [routeCondensate, setRouteCondensate] = useState(true);
    const [soakCycle, setSoakCycle] = useState(false);

    // Simulate saving state
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 800);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">System Logic & Automations</h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Configure pump rules and water recycling flows.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={`btn-soft-primary bg-emerald-500 font-extrabold tracking-wide uppercase text-xs !px-6 ${isSaving ? 'opacity-50 cursor-wait' : 'hover:scale-105 shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]'} transition-all duration-300`}
                >
                    {isSaving ? 'Saving...' : 'Save Configurations'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Pump Rules Panel */}
                <div className="panel-soft rounded-3xl p-8 border border-white/60 relative group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 panel-soft-inset border border-white/40 rounded-2xl text-sky-500 drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <Zap className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Pump Control Rules</h2>
                    </div>

                    <div className="space-y-6">
                        {/* Auto Cut-off */}
                        <div className="flex items-start justify-between p-5 panel-soft-inset border border-white/40 rounded-2xl transition-all duration-300 hover:panel-soft hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] group/item cursor-pointer" onClick={() => setAutoCutoff(!autoCutoff)}>
                            <div className="pr-4">
                                <h3 className="text-sm font-extrabold text-slate-700 mb-1 tracking-wide group-hover/item:text-emerald-500 transition-colors">Auto Cut-off (Tank Full)</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed tracking-wide">Automatically stops the pump when the primary tank reaches 100% capacity to prevent overflow.</p>
                            </div>
                            {autoCutoff ? <ToggleRight className="w-10 h-10 text-emerald-500 shrink-0 drop-shadow-md group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-300 shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} />}
                        </div>

                        {/* Dry-run Protection */}
                        <div className="flex items-start justify-between p-5 panel-soft-inset border border-white/40 rounded-2xl transition-all duration-300 hover:panel-soft hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] group/item cursor-pointer" onClick={() => setDryRunProtection(!dryRunProtection)}>
                            <div className="pr-4 flex flex-col gap-2">
                                <div>
                                    <h3 className="text-sm font-extrabold text-slate-700 mb-1 flex items-center gap-2 tracking-wide group-hover/item:text-emerald-500 transition-colors">
                                        Dry-run Protection
                                        <ShieldAlert className="w-4 h-4 text-amber-500 drop-shadow-sm" />
                                    </h3>
                                    <p className="text-xs font-bold text-slate-500 leading-relaxed tracking-wide">System halts pumping if no water flow is detected within 30 seconds to prevent motor burnout.</p>
                                </div>
                            </div>
                            {dryRunProtection ? <ToggleRight className="w-10 h-10 text-emerald-500 shrink-0 drop-shadow-md group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-300 shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} />}
                        </div>

                        {/* Schedule (Mock Static) */}
                        <div className="mt-8 pt-6 border-t border-white/60 relative z-10">
                            <h3 className="text-sm font-extrabold text-slate-700 mb-4 tracking-wide uppercase flex items-center gap-2"><Settings2 className="w-5 h-5 text-slate-400 drop-shadow-sm" /> Active Schedule</h3>
                            <div className="panel-soft-inset border border-white/40 rounded-xl p-4 text-xs font-bold tracking-wide text-slate-500 box-border">
                                Everyday • <span className="text-slate-700 px-1 font-extrabold">06:00 AM</span> to <span className="text-slate-700 px-1 font-extrabold">08:00 AM</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recycling Configurations */}
                <div className="panel-soft rounded-3xl p-8 border border-white/60 relative group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3.5 panel-soft-inset border border-white/40 rounded-2xl text-indigo-500 drop-shadow-sm transition-transform duration-300 group-hover:scale-110">
                            <Droplets className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <h2 className="text-xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Recycling Flows</h2>
                    </div>

                    <div className="space-y-6">
                        {/* AC Condensate Routing */}
                        <div className="flex items-start justify-between p-5 panel-soft-inset border border-white/40 rounded-2xl transition-all duration-300 hover:panel-soft hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] group/item cursor-pointer" onClick={() => setRouteCondensate(!routeCondensate)}>
                            <div className="pr-4">
                                <h3 className="text-sm font-extrabold text-slate-700 mb-1 tracking-wide group-hover/item:text-indigo-500 transition-colors">Route AC Condensate</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed tracking-wide">Divert water from Air Conditioning units to the secondary flush/garden tank.</p>
                            </div>
                            {routeCondensate ? <ToggleRight className="w-10 h-10 text-indigo-500 shrink-0 drop-shadow-md group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-300 shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} />}
                        </div>

                        {/* Washing Machine Soak */}
                        <div className="flex items-start justify-between p-5 panel-soft-inset border border-white/40 rounded-2xl transition-all duration-300 hover:panel-soft hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff] group/item cursor-pointer" onClick={() => setSoakCycle(!soakCycle)}>
                            <div className="pr-4">
                                <h3 className="text-sm font-extrabold text-slate-700 mb-1 flex items-center gap-2 tracking-wide group-hover/item:text-indigo-500 transition-colors">Enabled 'Eco-Soak' Wait State</h3>
                                <p className="text-xs font-bold text-slate-500 leading-relaxed tracking-wide">Pauses drainage after the wash cycle for 30 mins to allow sediment settling before routing to greywater filtration.</p>
                            </div>
                            {soakCycle ? <ToggleRight className="w-10 h-10 text-indigo-500 shrink-0 drop-shadow-md group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} /> : <ToggleLeft className="w-10 h-10 text-slate-300 shrink-0 drop-shadow-sm group-hover/item:scale-110 transition-transform duration-300" strokeWidth={1.5} />}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Automations;
