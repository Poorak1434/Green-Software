import { Save, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';

export const AutomationRulesManager = () => {
    // We would normally fetch current state, but for MVP we track it locally and mutate to the backend
    const [isDryRunEnabled, setIsDryRunEnabled] = useState(true);

    // MOCK_RULE_ID representing the dry-run protection rule in the DB
    const MOCK_RULE_ID = '00000000-0000-0000-0000-000000000010';

    const toggleRuleMutation = useMutation({
        mutationFn: async (newState: boolean) => {
            await axios.put(`http://localhost:8000/api/v1/green/automations/${MOCK_RULE_ID}?is_enabled=${newState}`);
            return newState;
        },
        onMutate: (newState) => {
            // Optimistic update
            setIsDryRunEnabled(newState);
        },
        onError: () => {
            // Revert on error
            setIsDryRunEnabled(!isDryRunEnabled);
            alert("Failed to update rule on the server.");
        }
    });

    return (
        <div className="panel-soft rounded-3xl overflow-hidden flex flex-col border border-white/50 relative group">
            <div className="p-6 border-b border-[#d1d9e6]/50">
                <div className="flex justify-between items-center relative z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-700 tracking-tight">Automation Logic</h2>
                        <p className="text-sm text-slate-500 font-bold mt-1 tracking-wide">Configure pump triggers</p>
                    </div>

                    {/* Global switch for automation vs manual */}
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input type="checkbox" className="sr-only" defaultChecked />
                            <div className="block bg-emerald-500 border border-emerald-400/50 shadow-[inset_2px_2px_5px_rgba(0,_0,_0,_0.1)] w-14 h-8 rounded-full transition-colors duration-300"></div>
                            <div className="dot absolute left-1.5 top-1.5 bg-white w-5 h-5 rounded-full transition transform translate-x-6 drop-shadow-md"></div>
                        </div>
                    </label>
                </div>
            </div>

            <div className="p-6 space-y-8 flex-1 relative z-10">

                {/* Rule 1: Auto Fill */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-extrabold text-slate-700 tracking-wide">Auto-fill Thresholds</label>
                        <span className="text-[10px] font-extrabold px-3 py-1.5 panel-soft-inset text-emerald-600 rounded-xl border border-white/40 tracking-widest uppercase shadow-[inset_1px_1px_2px_#ffffff,_inset_-1px_-1px_2px_#d1d9e6]">
                            Active
                        </span>
                    </div>
                    <div className="p-5 panel-soft-inset rounded-2xl border border-white/40 grid grid-cols-2 gap-6 relative">
                        <div className="absolute inset-0 shadow-[inset_4px_4px_8px_#d1d9e6,_inset_-4px_-4px_8px_#ffffff] rounded-2xl pointer-events-none"></div>
                        <div className="relative z-10">
                            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wide uppercase">Start Motor Below (%)</label>
                            <input type="number" defaultValue={20} className="w-full px-4 py-3 panel-soft rounded-xl text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-white border-t-[#d1d9e6]/20 transition-all duration-300" />
                        </div>
                        <div className="relative z-10">
                            <label className="block text-xs font-bold text-slate-500 mb-2 tracking-wide uppercase">Stop Motor At (%)</label>
                            <input type="number" defaultValue={95} className="w-full px-4 py-3 panel-soft rounded-xl text-sm font-extrabold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 border border-white border-t-[#d1d9e6]/20 transition-all duration-300" />
                        </div>
                    </div>
                </div>

                {/* Rule 2: Dry Run Protection */}
                <div className="space-y-4 pt-4 relative">
                    <div className="absolute top-0 left-0 w-full border-t border-white/60 shadow-[0_-1px_1px_#d1d9e6]"></div>
                    <div className="flex justify-between items-center relative z-10">
                        <label className="text-sm font-extrabold text-slate-700 flex items-center gap-2 tracking-wide">
                            Dry-Run Protection
                            {toggleRuleMutation.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500 drop-shadow-sm" />}
                        </label>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative" onClick={(e) => {
                                e.preventDefault();
                                toggleRuleMutation.mutate(!isDryRunEnabled);
                            }}>
                                <input type="checkbox" className="sr-only" checked={isDryRunEnabled} readOnly />
                                <div className={`block w-14 h-8 rounded-full transition-colors duration-300 border border-white/50 shadow-[inset_2px_2px_5px_rgba(209,_217,_230,_0.8),_inset_-2px_-2px_5px_rgba(255,_255,_255,_0.8)] ${isDryRunEnabled ? 'bg-emerald-500 border-emerald-400/50' : 'bg-[#eef2f6]'}`}></div>
                                <div className={`absolute left-1.5 top-1.5 bg-white w-5 h-5 rounded-full transition transform drop-shadow-md ${isDryRunEnabled ? 'translate-x-6' : ''}`}></div>
                            </div>
                        </label>
                    </div>
                    <p className="text-xs font-bold text-slate-400 tracking-wide leading-relaxed relative z-10">
                        Automatically shuts down the pump if current draw drops below normal threshold (suggests empty inlet).
                    </p>
                </div>

            </div>

            <div className="p-5 flex justify-end relative z-10">
                <div className="absolute top-0 left-0 w-full border-t border-white/60 shadow-[0_-1px_1px_#d1d9e6]"></div>
                <button className="flex items-center gap-2 btn-soft-primary bg-emerald-500 group relative z-10">
                    <Save className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                    Save Rules
                </button>
            </div>
        </div >
    );
};
