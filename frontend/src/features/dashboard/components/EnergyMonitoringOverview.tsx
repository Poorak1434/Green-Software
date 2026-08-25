import { useState } from 'react';
import Overview from '../../../pages/Overview';
import { CostAnalysisTab } from './CostAnalysisTab';
import { ApplianceDeepDiveTab } from './ApplianceDeepDiveTab';
import { UsageByRoomsTab } from './UsageByRoomsTab';
import { EmissionsTab } from './EmissionsTab';
import { LayoutDashboard, IndianRupee, Cpu, Home, Wind } from 'lucide-react';

const TABS = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cost', label: 'Cost', icon: <IndianRupee className="w-4 h-4" /> },
    { id: 'appliances', label: 'Appliances', icon: <Cpu className="w-4 h-4" /> },
    { id: 'rooms', label: 'Usage by Rooms', icon: <Home className="w-4 h-4" /> },
    { id: 'emissions', label: 'Emissions', icon: <Wind className="w-4 h-4" /> },
] as const;

type TabId = typeof TABS[number]['id'];

export const EnergyMonitoringOverview = () => {
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    const renderSecondaryNav = () => (
        <div className="flex justify-center mb-8 sticky top-0 z-20 py-4 bg-[#eef2f6]/80 backdrop-blur-md">
            <div className="panel-soft-inset p-1.5 rounded-2xl border border-white/50 flex flex-wrap justify-center gap-1 sm:gap-2 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff]">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all duration-300 ${activeTab === tab.id
                            ? 'panel-soft text-emerald-500 shadow-[4px_4px_8px_#d1d9e6,_-4px_-4px_8px_#ffffff]'
                            : 'text-slate-400 hover:text-slate-600 hover:panel-soft bg-transparent shadow-none'
                            }`}
                    >
                        {tab.icon} <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-full pb-12 w-full max-w-7xl mx-auto">
            {renderSecondaryNav()}

            <div className="px-4 sm:px-8">
                {activeTab === 'overview' && <Overview />}
                {activeTab === 'cost' && <CostAnalysisTab />}
                {activeTab === 'appliances' && <ApplianceDeepDiveTab />}
                {activeTab === 'rooms' && <UsageByRoomsTab />}
                {activeTab === 'emissions' && <EmissionsTab />}
            </div>
        </div>
    );
};
