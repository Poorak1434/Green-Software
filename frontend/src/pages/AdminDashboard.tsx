
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
    Users, 
    ShieldAlert, 
    UserCheck,
    Calendar,
    Mail,
    ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';

interface User {
    id: string;
    email: string;
    created_at: string;
    is_premium: boolean;
}

const fetchUsers = async (): Promise<User[]> => {
    // In a real app, you might want to read the base URL from env
    const response = await axios.get('http://localhost:8000/api/v1/admin/users');
    return response.data.users;
};

export const AdminDashboard = () => {
    const { data: users, isLoading, isError } = useQuery({
        queryKey: ['admin-users'],
        queryFn: fetchUsers,
    });

    return (
        <div className="min-h-screen bg-[#e8eef6] p-6 sm:p-10 font-[Inter,sans-serif] text-slate-800">
            {/* Top Navigation */}
            <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center bg-[#f4f7fa] p-4 rounded-2xl shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff] border border-white">
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:panel-soft transition-all font-medium text-sm">
                    <ArrowLeft className="w-4 h-4" />
                    Back to App
                </Link>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1.5 panel-soft-inset rounded-lg text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 uppercase tracking-widest">
                        Admin Mode
                    </div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent pb-1">
                            Admin Control Center
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Manage users and platform access</p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <div className="panel-soft flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white">
                            <Users className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-semibold text-slate-700">
                                {users ? users.length : 0} Total Users
                            </span>
                        </div>
                    </div>
                </div>

            {/* Users Table Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel-soft rounded-2xl overflow-hidden"
            >
                <div className="p-5 border-b border-white/40 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-emerald-500" />
                        <h2 className="font-bold text-slate-700">User Directory</h2>
                    </div>
                </div>
                
                <div className="p-4">
                    {isLoading ? (
                         <div className="flex flex-col items-center justify-center p-12 text-slate-400">
                            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                            <p className="text-sm font-medium">Loading user data...</p>
                        </div>
                    ) : isError ? (
                        <div className="flex flex-col items-center justify-center p-12 text-rose-500 bg-rose-50/50 rounded-xl border border-rose-100/50">
                            <ShieldAlert className="w-10 h-10 mb-3" />
                            <p className="font-medium">Failed to load users</p>
                            <p className="text-sm text-rose-400 mt-1">Check backend connection</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/40">
                                        <th className="pb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">User ID</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Details</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Joined Date</th>
                                        <th className="pb-3 px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Plan Tier</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users?.map((user) => (
                                        <tr 
                                            key={user.id} 
                                            className="border-b border-white/20 last:border-0 hover:bg-white/30 transition-colors"
                                        >
                                            <td className="py-4 px-4 text-sm font-medium text-slate-600 break-all">
                                                {user.id}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full panel-soft-inset flex items-center justify-center text-slate-400 shrink-0">
                                                        <Mail className="w-4 h-4" />
                                                    </div>
                                                    <span className="text-sm text-slate-700 font-medium">{user.email}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-slate-500">
                                                 <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={clsx(
                                                    "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm",
                                                    user.is_premium 
                                                        ? "bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-700 border border-emerald-200"
                                                        : "panel-soft text-slate-500"
                                                )}>
                                                    {user.is_premium ? 'Premium' : 'Free'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {users?.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="py-12 text-center text-slate-500 panel-soft-inset rounded-xl mt-4">
                                                <UserCheck className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                                                <p className="font-medium">No users found</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
        </div>
    );
};

export default AdminDashboard;
