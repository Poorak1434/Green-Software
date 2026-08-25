import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

export const AlertOverlay = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="fixed top-8 right-8 w-[420px] bg-white border border-rose-100 p-5 rounded-2xl shadow-lg shadow-rose-500/10 z-50"
        >
            <div className="flex justify-between items-start mb-2">
                <h2 className="text-slate-800 text-lg font-bold">Panel underperforming</h2>
                <span className="bg-rose-50 text-rose-600 text-xs px-2.5 py-1 rounded-full font-medium border border-rose-100">Action required</span>
            </div>

            <p className="text-slate-600 text-sm mb-4">
                <span className="text-slate-800 font-semibold">7.10 W</span> detected, significantly lower than expected.
            </p>

            <div className="space-y-3 mb-6 relative">
                <div className="flex gap-3 text-sm text-slate-500 items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Inspect the panel for obstructions, dirt, or damage</span>
                </div>
                <div className="flex gap-3 text-sm text-slate-500 items-start">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Verify electrical connections and inverter functionality</span>
                </div>
            </div>

            <button className="flex items-center justify-center w-full gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
                Acknowledge Alert
            </button>
        </motion.div>
    );
};
