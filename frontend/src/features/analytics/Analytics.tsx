import { ApplianceUsageChart } from './ApplianceUsageChart';
import { PredictionOverlay } from './PredictionOverlay';
import { RecyclingFlowVisualizer } from './RecyclingFlowVisualizer';
import { DownloadCloud, Filter } from 'lucide-react';

export const Analytics = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Predictive Analytics</h1>
                    <p className="text-slate-500 mt-1">AI-driven forecasts and detailed consumption breakdowns.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm">
                        <Filter className="w-4 h-4" />
                        Last 7 Days
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 border border-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm shadow-sm">
                        <DownloadCloud className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            {/* Top Row: Two main charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ApplianceUsageChart />
                <PredictionOverlay />
            </div>

            {/* Bottom Row: Graywater Recycling Logic flow */}
            <div className="grid grid-cols-1 gap-6">
                <RecyclingFlowVisualizer />
            </div>

        </div>
    );
};
