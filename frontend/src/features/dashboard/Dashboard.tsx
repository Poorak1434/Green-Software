import { ImpactMetricsGrid } from './ImpactMetricsGrid';
import { RealtimeTankWidget } from './RealtimeTankWidget';
import { DownloadCloud } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
};

export const Dashboard = () => {
    return (
        <motion.div
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight">Household Overview</h1>
                    <p className="text-slate-500 mt-1 font-medium">Real-time metrics and system status.</p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 btn-soft"
                >
                    <DownloadCloud className="w-4 h-4" />
                    Export Report
                </motion.button>
            </motion.div>

            <motion.div variants={itemVariants}>
                <ImpactMetricsGrid />
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <RealtimeTankWidget />

                {/* Placeholder for Quick Actions or a Mini Chart */}
                <div className="panel-soft p-6 col-span-1">
                    <h3 className="text-sm font-bold text-slate-600 mb-4 uppercase tracking-wider">Quick Actions</h3>
                    <div className="space-y-3">
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left btn-soft-primary"
                        >
                            Start Evening Irrigation
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full text-left btn-soft"
                        >
                            Run Diagnostic
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};
