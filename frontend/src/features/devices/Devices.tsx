import React, { useState } from 'react';
import { DeviceList } from './DeviceList';
import { PumpControlPanel } from './PumpControlPanel';
import { AutomationRulesManager } from './AutomationRulesManager';
import { GalaxyS24UltraWidget } from './GalaxyS24UltraWidget';
import { PairDeviceModal } from './PairDeviceModal';
import { Plus, Smartphone } from 'lucide-react';

export const Devices = () => {
    const [isPairModalOpen, setIsPairModalOpen] = useState<boolean>(false);

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Device Management</h1>
                    <p className="text-slate-500 mt-2 font-bold tracking-wide">Configure Wi-Fi hardware nodes, smartphones, and automation rules.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsPairModalOpen(true)}
                        className="flex items-center gap-2 btn-soft-primary bg-emerald-500 group shadow-lg shadow-emerald-500/20"
                    >
                        <Smartphone className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        Pair Galaxy S24 Ultra
                    </button>

                    <button
                        onClick={() => setIsPairModalOpen(true)}
                        className="flex items-center gap-2 btn-soft-primary group"
                    >
                        <Plus className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                        Add Device
                    </button>
                </div>
            </div>

            {/* Galaxy S24 Ultra Live Telemetry Section */}
            <div className="w-full">
                <GalaxyS24UltraWidget />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Device Table expands more */}
                <div className="lg:col-span-2 space-y-6">
                    <DeviceList />
                </div>

                {/* Right Column: Controls and Automation */}
                <div className="lg:col-span-1 space-y-6 flex flex-col">
                    <PumpControlPanel />
                    <AutomationRulesManager />
                </div>
            </div>

            {/* Pair Device Modal */}
            <PairDeviceModal
                isOpen={isPairModalOpen}
                onClose={() => setIsPairModalOpen(false)}
            />
        </div>
    );
};
