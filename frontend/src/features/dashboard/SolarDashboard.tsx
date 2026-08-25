import { Sidebar } from './components/Sidebar';
import { RootCauseWidget, TrendAnalysisWidget, RepairMatchingWidget, SolarPRWidget } from './components/FloatingWidgets';
import { AlertOverlay } from './components/AlertOverlay';
import { Activity, Sun } from 'lucide-react';
import { ImpactMetricsGrid } from './ImpactMetricsGrid';

export const SolarDashboard = () => {
    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            <Sidebar />

            <main className="flex-1 ml-32 p-8 h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <div className="text-slate-500 text-sm font-medium mb-1 flex items-center gap-2">
                                <span>Residential</span>
                                <span className="text-slate-300">/</span>
                                <span className="text-slate-800">San Jose, California</span>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Overview</h1>
                        </div>

                        <div className="panel-soft px-4 py-2 flex items-center gap-3">
                            <Sun className="text-yellow-500 w-5 h-5 fill-yellow-500" />
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-slate-800">430.01 kWh</span>
                                <span className="text-[10px] text-slate-500 font-medium">Solar Production</span>
                            </div>
                        </div>
                    </div>

                    <ImpactMetricsGrid />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Main Content Area */}
                            <div className="panel-soft p-6 min-h-[400px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-slate-800">Inverter Performance</h2>
                                </div>

                                <div className="flex gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 flex flex-col items-center justify-center gap-2">
                                        <div className="text-slate-500 font-medium text-xs uppercase tracking-wider">Input (kW)</div>
                                        <div className="text-4xl font-bold text-green-600">10.82</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 flex flex-col items-center justify-center gap-2">
                                        <div className="text-slate-500 font-medium text-xs uppercase tracking-wider">Output (kW)</div>
                                        <div className="text-4xl font-bold text-green-600">10.75</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex-1 flex flex-col items-center justify-center gap-2">
                                        <div className="text-slate-500 font-medium text-xs uppercase tracking-wider">Efficiency</div>
                                        <div className="text-4xl font-bold text-slate-800">99.3%</div>
                                    </div>
                                </div>

                                <div className="mt-8 flex-1">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-sm font-semibold text-slate-700">Peak Output (Today)</h3>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 text-xs text-slate-600 bg-white rounded-lg border border-slate-200 hover:border-green-500 hover:text-green-600 transition-colors font-medium">Copilot</button>
                                            <button className="px-3 py-1.5 text-xs text-green-600 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors font-medium flex items-center gap-1.5"><Activity className="w-3 h-3" />Simulate</button>
                                        </div>
                                    </div>
                                    <div className="w-full h-32 bg-gradient-to-t from-green-500/10 to-transparent border-t-[2px] border-green-500 rounded-b-lg" style={{ clipPath: 'polygon(0 100%, 0 70%, 20% 60%, 40% 80%, 60% 30%, 80% 40%, 100% 80%, 100% 100%)' }}></div>
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium">
                                        <span>0 AM</span><span>2 AM</span><span>4 AM</span><span>6 AM</span><span>8 AM</span><span>10 AM</span><span>12 PM</span><span>2 PM</span><span>4 PM</span><span>6 PM</span><span>8 PM</span>
                                    </div>
                                </div>
                            </div>

                            <TrendAnalysisWidget />
                        </div>

                        {/* Right Sidebar Widgets */}
                        <div className="space-y-6">
                            <RootCauseWidget />
                            <SolarPRWidget />
                            <RepairMatchingWidget />
                        </div>
                    </div>
                </div>
            </main>
            <AlertOverlay />
        </div>
    );
};
