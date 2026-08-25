import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    BarChart3,
    TrendingUp,
    Bell,
    Power,
    CalendarClock,
    Cpu,
    RefreshCw,
    Building,
    Settings,
    Users,
    Smartphone
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';

interface SidebarNavigationProps {
    isCollapsed?: boolean;
}

interface NavItem {
    name: string;
    path: string;
    icon: any; // Lucide icon type
    hasBadge?: boolean;
    isPremium?: boolean;
}

interface NavGroup {
    groupName: string;
    items: NavItem[];
}

const sidebarVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300 } }
};

export const SidebarNavigation = ({ isCollapsed = false }: SidebarNavigationProps) => {

    const { user } = useUser();
    const isAdmin = user?.publicMetadata?.role === 'admin';

    const navGroups: NavGroup[] = [
        {
            groupName: "Overview & Insights",
            items: [
                { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                { name: 'Appliance Analytics', path: '/analytics', icon: BarChart3 },
            ]
        },
        {
            groupName: "Intelligence & Alerts",
            items: [
                { name: 'AI Family & Presence', path: '/family', icon: Users },
                { name: 'Usage Forecasting', path: '/forecasting', icon: TrendingUp },
                { name: 'Alerts & Anomalies', path: '/alerts', icon: Bell, hasBadge: true },
            ]
        },
        {
            groupName: "Control & Automation",
            items: [
                { name: 'Device Management', path: '/devices', icon: Smartphone },
                { name: 'Manual Overrides', path: '/controls', icon: Power },
                { name: 'Schedules', path: '/schedules', icon: CalendarClock },
                { name: 'Pump Automations', path: '/automations', icon: Cpu },
            ]
        },
        {
            groupName: "System & Configuration",
            items: [
                { name: 'Recycling Flows', path: '/recycling', icon: RefreshCw },
                { name: 'Multi-Home Mgt.', path: '/properties', icon: Building, isPremium: true },
                ...(isAdmin ? [{ name: 'Admin Dashboard', path: '/admin', icon: Users }] : []),
            ]
        }
    ];

    return (
        <div className={clsx(
            "flex flex-col h-full bg-[#f4f7fa] border-r border-[#ffffff] shadow-[10px_0_20px_rgba(209,_217,_230,_0.5)] relative z-20 transition-all duration-300",
            isCollapsed ? "w-20" : "w-72"
        )}>
            {/* Brand Logo Header */}
            <div className="h-16 flex items-center justify-center border-b border-[#d1d9e6]/30 shrink-0">
                <div className={clsx("flex items-center gap-3", isCollapsed ? "justify-center" : "w-full px-6")}>
                    <div className="w-8 h-8 rounded-xl bg-[#f4f7fa] border border-white flex items-center justify-center font-bold shadow-[3px_3px_6px_#d1d9e6,_-3px_-3px_6px_#ffffff] shrink-0">
                        <span className="bg-gradient-to-br from-emerald-400 to-emerald-600 bg-clip-text text-transparent transform scale-90">GS</span>
                    </div>
                    {!isCollapsed && <span className="font-bold text-slate-700 tracking-tight">GreenSoftware</span>}
                </div>
            </div>

            {/* Navigation Links */}
            <motion.nav
                className="flex-1 overflow-y-auto py-6 space-y-6"
                variants={sidebarVariants}
                initial="hidden"
                animate="show"
            >

                {navGroups.map((group, groupIndex) => (
                    <div key={groupIndex} className="px-3">
                        {/* Group Header */}
                        {!isCollapsed && (
                            <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                                {group.groupName}
                            </p>
                        )}

                        {/* Group Items */}
                        <div className="space-y-2">
                            {group.items.map((rawItem) => {
                                const item = rawItem as NavItem;
                                return (
                                    <motion.div key={item.name} variants={itemVariants}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                clsx(
                                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm group relative border",
                                                    isActive
                                                        ? "panel-soft-inset text-emerald-600 border-white/40"
                                                        : "text-slate-500 border-transparent hover:panel-soft hover:text-emerald-500"
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="relative">
                                                        <item.icon className={clsx("w-5 h-5 shrink-0 transition-colors", isActive ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-400")} />
                                                        {/* Notification Badge */}
                                                        {item.hasBadge && (
                                                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 shadow-[0_0_5px_#f43f5e] rounded-full border-2 border-[#f4f7fa]"></span>
                                                        )}
                                                    </div>

                                                    {!isCollapsed && (
                                                        <div className="flex flex-1 items-center justify-between truncate">
                                                            <span className="truncate">{item.name}</span>
                                                            {item.isPremium && (
                                                                <span className="ml-2 text-[9px] font-bold text-yellow-600 shadow-[inset_1px_1px_2px_#d1d9e6,_inset_-1px_-1px_2px_#ffffff] bg-[#f4f7fa] px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                                                                    Premium
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </motion.nav>

            {/* Bottom Settings Action */}
            <div className="p-4 border-t border-[#d1d9e6]/30 shrink-0">
                <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                        clsx(
                            "flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium transition-colors border rounded-xl overflow-hidden group",
                            isActive
                                ? "panel-soft-inset text-emerald-600 border-white/40"
                                : "text-slate-500 border-transparent hover:panel-soft hover:text-emerald-500"
                        )
                    }
                >
                    {({ isActive }) => (
                        <>
                            <Settings className={clsx("w-5 h-5 shrink-0 transition-colors", isActive ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-400")} />
                            {!isCollapsed && <span>Settings</span>}
                        </>
                    )}
                </NavLink>
            </div>
        </div>
    );
};
