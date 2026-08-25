import { Outlet } from 'react-router-dom';
import { SidebarNavigation } from './SidebarNavigation';
import { TopHeader } from './TopHeader';

export const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
            <SidebarNavigation />

            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <TopHeader />

                <main className="flex-1 overflow-auto p-8 relative">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
