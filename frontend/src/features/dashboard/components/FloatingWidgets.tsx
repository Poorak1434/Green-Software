import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, PenTool } from 'lucide-react';
import { useSettingsStore } from '../../../store/useSettingsStore';

export const RootCauseWidget = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="panel-soft p-5 border-l-4 border-l-green-500"
    >
        <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="text-amber-500 w-5 h-5" />
            <h3 className="text-slate-800 font-semibold text-base">Root cause analysis</h3>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
            The power of inverter INV097 in Mr. Liu's House is abnormal. In 2023/11/01, from 18:00 to 20:00, the power fluctuated by more than 80%, resulting in poor power generation stability.
        </p>
    </motion.div>
);

export const TrendAnalysisWidget = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="panel-soft p-5"
    >
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                <TrendingUp className="text-green-500 w-5 h-5" />
                <h3 className="text-slate-800 font-semibold">Trend analysis</h3>
            </div>
            <span className="bg-red-50 text-red-600 text-xs px-2.5 py-1 rounded-full font-medium border border-red-100">Serious</span>
        </div>
        <div className="text-sm text-slate-500 mb-4">PV string PV7 power analysis</div>
        {/* Mock chart */}
        <div className="h-32 w-full mt-4 flex items-end justify-between gap-1 relative border-b border-l border-slate-200 pb-1 pl-1">
            {[20, 30, 45, 60, 50, 65, 30, 20].map((v, i) => (
                <div key={i} className="w-full bg-green-200 rounded-t-sm transition-all hover:bg-green-300" style={{ height: `${v}%` }}></div>
            ))}
            {/* Warning zone */}
            <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-red-50 border-l border-dashed border-red-200"></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
            <span>04 AM</span>
            <span>08 AM</span>
            <span>12 PM</span>
            <span>04 PM</span>
        </div>
    </motion.div>
);

export const SolarPRWidget = () => {
    const settings = useSettingsStore();
    const currencyConfig = settings.getCurrencyConfig();

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="panel-soft p-5"
        >
            <h3 className="text-slate-800 font-semibold mb-6">Solar PR | MTD</h3>

            <div className="relative h-32 flex items-end justify-center mb-6">
                {/* Simple CSS-based Gauge simulation */}
                <div className="absolute top-0 w-48 h-24 rounded-t-full border-[12px] border-slate-100 border-b-0"></div>
                <div className="absolute top-0 w-48 h-24 rounded-t-full border-[12px] border-green-500 border-b-0 border-r-transparent border-t-transparent origin-bottom -rotate-45"></div>
                <div className="absolute top-0 w-48 h-24 rounded-t-full border-[12px] border-emerald-400 border-b-0 border-l-transparent border-t-transparent origin-bottom rotate-45"></div>

                <div className="absolute top-2 w-1 h-20 bg-slate-300 origin-bottom transform rotate-[20deg] rounded-full shadow-sm"></div>

                <div className="flex w-full justify-between px-8 text-center mt-auto pb-4">
                    <div>
                        <div className="text-slate-800 text-2xl font-bold">875</div>
                        <div className="text-slate-500 text-xs font-medium">West Panels</div>
                    </div>
                    <div>
                        <div className="text-green-600 text-2xl font-bold">458</div>
                        <div className="text-slate-500 text-xs font-medium">East Panels</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 mt-4">
                <div>
                    <div className="text-slate-800 text-lg font-bold">{currencyConfig.symbol}{(89.5 * currencyConfig.rateVsUSD).toFixed(1)}<span className="text-sm text-slate-500 font-medium">K</span></div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Total Spends</div>
                </div>
                <div>
                    <div className="text-red-500 text-lg font-bold">{settings.formatCost(120.32)}</div>
                    <div className="text-slate-500 text-xs font-medium mt-1">Avg. spend / sqft</div>
                </div>
            </div>
        </motion.div>
    );
};

export const RepairMatchingWidget = () => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="panel-soft p-5"
    >
        <div className="flex items-center gap-2 mb-4">
            <PenTool className="w-5 h-5 text-green-500" />
            <h3 className="text-slate-800 font-semibold">Repair matching</h3>
        </div>
        <button className="w-full text-center text-sm bg-white border border-slate-200 hover:border-green-500 hover:text-green-600 px-4 py-2 rounded-lg text-slate-600 font-medium mb-4 transition-colors shadow-sm">
            + Create task
        </button>
        <div className="flex gap-3 items-start mt-2 border border-slate-100 bg-slate-50 p-3 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold flex-shrink-0">
                JJ
            </div>
            <div>
                <div className="text-slate-800 text-sm font-semibold">John Jessie</div>
                <div className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Closest maintenance personnel to the site. Estimated solution time: 19 hours.
                </div>
            </div>
        </div>
    </motion.div>
);
