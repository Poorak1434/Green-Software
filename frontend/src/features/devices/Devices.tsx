import { DeviceList } from './DeviceList';
import { PumpControlPanel } from './PumpControlPanel';
import { AutomationRulesManager } from './AutomationRulesManager';
import { Plus } from 'lucide-react';

export const Devices = () => {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Device Management</h1>
                    <p className="text-slate-500 mt-2 font-bold tracking-wide">Configure hardware, view status, and set automation rules.</p>
                </div>

                <button className="flex items-center gap-2 btn-soft-primary bg-emerald-500 group">
                    <Plus className="w-5 h-5 drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                    Add Device
                </button>
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
        </div>
    );
};
