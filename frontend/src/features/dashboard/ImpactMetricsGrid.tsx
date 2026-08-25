import { Droplet, Zap, AlertTriangle, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { motion } from 'framer-motion';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit: string;
    trend?: string;
    icon: React.ComponentType<{ className?: string }>;
    status?: 'good' | 'warning' | 'danger';
}

const MetricCard = ({ title, value, unit, trend, icon: Icon, status = 'good' }: MetricCardProps) => {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="panel-soft p-6 flex flex-col cursor-default"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
                <div className={clsx(
                    "p-2.5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(209,_217,_230,_0.5),_inset_-2px_-2px_5px_rgba(255,_255,_255,_0.8)]",
                    status === 'good' && "bg-[#f4f7fa] text-emerald-500",
                    status === 'warning' && "bg-[#f4f7fa] text-amber-500",
                    status === 'danger' && "bg-[#f4f7fa] text-rose-500",
                )}>
                    <Icon className="w-5 h-5 drop-shadow-sm" />
                </div>
            </div>

            <div className="mt-auto">
                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-slate-700 tracking-tight">{value}</span>
                    <span className="text-sm font-bold text-slate-400">{unit}</span>
                </div>

                {trend && (
                    <p className="text-sm mt-3 flex items-center gap-1 font-bold text-emerald-500 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
                        {trend}
                    </p>
                )}
            </div>
        </motion.div>
    );
};

export const ImpactMetricsGrid = () => {
    // 1. Hardcoded UUID for Demo MVP (This would come from Auth Context normally)
    const MOCK_HOME_ID = '00000000-0000-0000-0000-000000000000';

    // 2. Fetch data from FastAPI Backend
    const { data: summary, isLoading, isError } = useQuery({
        queryKey: ['dashboard-summary', MOCK_HOME_ID],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8000/api/v1/green/homes/${MOCK_HOME_ID}/dashboard-summary`);
            return response.data;
        }
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-32 mb-8 panel-soft">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                <span className="ml-3 text-slate-500 font-bold tracking-wide">Loading live metrics...</span>
            </div>
        );
    }

    if (isError || !summary) {
        return (
            <div className="flex justify-center items-center h-32 mb-8 panel-soft border-rose-200">
                <AlertTriangle className="w-6 h-6 text-rose-400 drop-shadow-sm" />
                <span className="ml-3 text-rose-500 font-bold tracking-wide">Failed to connect to backend telemetry</span>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <MetricCard
                title="Water Saved"
                value={summary.water_saved_liters}
                unit="L/day"
                trend="↑ 12% vs last week"
                icon={Droplet}
                status="good"
            />

            <MetricCard
                title="Electricity Saved"
                value={summary.energy_saved_kwh}
                unit="kWh/mo"
                trend="↑ 8% vs last month"
                icon={Zap}
                status="good"
            />

            <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="panel-soft p-6 flex flex-col border border-rose-100/50 shadow-[5px_5px_15px_rgba(244,_63,_94,_0.1),_-5px_-5px_15px_#ffffff] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">System Status</h3>
                    <div className="p-2.5 rounded-2xl shadow-[inset_2px_2px_5px_rgba(209,_217,_230,_0.5),_inset_-2px_-2px_5px_rgba(255,_255,_255,_0.8)] bg-[#f4f7fa] text-rose-500">
                        <AlertTriangle className="w-5 h-5 drop-shadow-sm" />
                    </div>
                </div>

                <div className="mt-auto relative z-10">
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-extrabold text-rose-600 tracking-tight">Warning Active</span>
                        <span className="text-sm font-medium text-rose-500/80">Minor leak detected in Guest Bathroom</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
