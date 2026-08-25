import { UserButton, useUser } from '@clerk/clerk-react';
import { Globe, DollarSign } from 'lucide-react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { NotificationDropdown } from './NotificationDropdown';

export const TopHeader = () => {
    const { user } = useUser();
    const settings = useSettingsStore();

    const ownerName = settings.displayName || user?.fullName || 'Property Owner';
    const currencyConfig = settings.getCurrencyConfig();

    return (
        <header className="h-16 bg-[#eef2f6]/95 backdrop-blur-md shadow-[0_4px_30px_rgba(0,_0,_0,_0.03)] flex items-center justify-between px-6 z-[100] sticky top-0 w-full border-b border-white/40">
            <div className="flex items-center gap-4">
                <h1 className="text-lg font-bold text-slate-700 tracking-tight">System Dashboard</h1>
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full panel-soft-inset text-xs font-extrabold text-slate-500">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{settings.timezone.split(' ')[0]}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                {/* Global Currency Badge */}
                <div className="flex items-center gap-1.5 panel-soft-inset px-3 py-1.5 rounded-full border-white/50 border text-xs font-black text-emerald-600">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{currencyConfig.code} ({currencyConfig.symbol})</span>
                </div>

                {/* Global Connection Status */}
                <div className="flex items-center gap-2 panel-soft-inset px-3.5 py-1.5 rounded-full border-white/50 border">
                    <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 hidden xs:inline">Connected</span>
                </div>

                {/* Notifications Dropdown */}
                <NotificationDropdown />

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-slate-200/50 shadow-[1px_0_0_white]"></div>

                {/* User Profile & Clerk Button */}
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end hidden sm:flex">
                        <span className="text-sm font-semibold text-slate-700">{ownerName}</span>
                        <span className="text-[10px] font-bold text-emerald-600 panel-soft-inset px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
                    </div>
                    <div className="panel-soft rounded-full p-0.5 border-white">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-white rounded-full bg-[#f4f7fa]" } }} />
                    </div>
                </div>
            </div>
        </header>
    );
};
