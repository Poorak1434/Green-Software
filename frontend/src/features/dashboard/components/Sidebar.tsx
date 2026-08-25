import { LayoutDashboard, Settings, Activity, BatteryCharging } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const Sidebar = () => {
    return (
        <div className="absolute left-6 top-6 bottom-6 w-20 panel-soft flex flex-col items-center py-8 z-10 transition-all hover:w-24">
            {/* Logo */}
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-white font-bold text-lg mb-12 shadow-md">
                GS
            </div>

            {/* Nav Items */}
            <nav className="flex flex-col gap-8 w-full items-center flex-1">
                <NavLink to="/dashboard" className={({ isActive }) => `transition-colors group relative ${isActive ? 'text-green-600' : 'text-slate-400 hover:text-green-500'}`}>
                    <LayoutDashboard size={24} />
                    <span className="absolute left-[150%] top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-white border border-slate-100 shadow-md rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-slate-700 font-medium">Overview</span>
                </NavLink>
                <NavLink to="/devices" className={({ isActive }) => `transition-colors group relative ${isActive ? 'text-green-600' : 'text-slate-400 hover:text-green-500'}`}>
                    <BatteryCharging size={24} />
                    <span className="absolute left-[150%] top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-white border border-slate-100 shadow-md rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-slate-700 font-medium">Devices</span>
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => `transition-colors group relative ${isActive ? 'text-green-600' : 'text-slate-400 hover:text-green-500'}`}>
                    <Activity size={24} />
                    <span className="absolute left-[150%] top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-white border border-slate-100 shadow-md rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-slate-700 font-medium">Analytics</span>
                </NavLink>
            </nav>

            <button className="text-slate-400 hover:text-green-500 transition-colors group relative mt-auto">
                <Settings size={24} />
                <span className="absolute left-[150%] top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-white border border-slate-100 shadow-md rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 text-slate-700 font-medium">Settings</span>
            </button>
        </div>
    );
};
