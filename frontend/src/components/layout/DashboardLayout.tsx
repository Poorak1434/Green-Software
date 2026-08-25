import { Outlet, useLocation } from 'react-router-dom';
import { SidebarNavigation } from './SidebarNavigation';
import { TopHeader } from './TopHeader';
import { AnimatePresence, motion } from 'framer-motion';

export const DashboardLayout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen w-screen bg-[#eef2f6] overflow-hidden font-sans text-slate-800">
            {/* Left Sidebar */}
            <SidebarNavigation />

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 overflow-hidden relative">
                {/* Top User & Notification Bar */}
                <TopHeader />

                {/* Dynamic Page Content */}
                <main className="flex-1 overflow-y-auto w-full p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.3, ease: 'easeOut' }}
                            className="h-full"
                        >
                            <Outlet />
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
};
