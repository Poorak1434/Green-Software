import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { TrendingUp, Activity, AlertTriangle, Zap, BrainCircuit } from 'lucide-react';
import { Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import axios from 'axios';

const MOCK_HOME_ID = 'home-123';

interface ForecastDataPoint {
    ds: string;
    yhat: number | null;
    yhat_lower?: number | null;
    yhat_upper?: number | null;
    confidenceBand?: [number, number] | null;
    actual?: number | null;
}

export const UsageForecasting: React.FC = () => {
    const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [modelInfo, setModelInfo] = useState({ type: '', confidence: '' });

    // Simple state to toggle days ahead
    const [daysAhead, setDaysAhead] = useState(7);

    useEffect(() => {
        const fetchForecast = async () => {
            setIsLoading(true);
            
            // Add some historical mock data to blend into the forecast for visualization
            const history: ForecastDataPoint[] = [];
            const baseDate = new Date();
            baseDate.setDate(baseDate.getDate() - 14); // 14 days of history

            for (let i = 0; i < 14; i++) {
                const date = new Date(baseDate);
                date.setDate(date.getDate() + i);

                // Synthetic actual usage
                const actualUsage = 120 + (Math.sin(i) * 10) + (Math.random() * 5);

                history.push({
                    ds: date.toISOString().split('T')[0],
                    yhat: null,
                    confidenceBand: null,
                    actual: Number(actualUsage.toFixed(2))
                });
            }

            try {
                // Fetch AI forecast from the backend
                const response = await axios.get(`http://localhost:8000/api/v1/green/forecast/${MOCK_HOME_ID}?days_ahead=${daysAhead}`);

                // Map the forecast data
                const forecastChartData = response.data.forecast.map((d: any) => ({
                    ds: d.ds.split('T')[0],
                    yhat: d.yhat,
                    // Area chart range needs array format [min, max]
                    confidenceBand: [d.yhat_lower, d.yhat_upper],
                    actual: null
                }));

                setForecastData([...history, ...forecastChartData]);
                setModelInfo({
                    type: response.data.model_type,
                    confidence: response.data.confidence_interval
                });
            } catch (error) {
                console.error("Error fetching forecast:", error);
                
                // Fallback graceful degradation with synthetic forecast data
                const syntheticForecast: ForecastDataPoint[] = [];
                const forecastBaseDate = new Date();
                
                for (let i = 0; i < daysAhead; i++) {
                    const date = new Date(forecastBaseDate);
                    date.setDate(date.getDate() + i);
                    
                    const baseUsage = 125 + (Math.sin(i + 14) * 10);
                    const variance = 5 + (i * 0.5); // Uncertainty grows over time
                    
                    syntheticForecast.push({
                        ds: date.toISOString().split('T')[0],
                        yhat: Number(baseUsage.toFixed(2)),
                        confidenceBand: [
                            Number((baseUsage - variance).toFixed(2)), 
                            Number((baseUsage + variance).toFixed(2))
                        ],
                        actual: null
                    });
                }
                
                setForecastData([...history, ...syntheticForecast]);
                setModelInfo({
                    type: 'Prophet (Mock)',
                    confidence: '95%'
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchForecast();
    }, [daysAhead]);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="panel-soft rounded-2xl p-4 border border-white/60 drop-shadow-lg">
                    <p className="font-extrabold text-slate-700 mb-2">{new Date(label).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>

                    {payload.map((entry: any, index: number) => {
                        // Ignore the area range in the tooltip if it's the raw array
                        if (entry.name === "confidenceBand" || Array.isArray(entry.value)) return null;

                        return (
                            <div key={`item-${index}`} className="flex items-center gap-2 text-sm font-bold my-1">
                                <div className="w-3 h-3 rounded-full shadow-inner" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-slate-500 capitalize">{entry.name}:</span>
                                <span className="text-slate-800">{entry.value} kWh</span>
                            </div>
                        );
                    })}

                    {/* Specifically handle finding confidence band info */}
                    {payload.find((p: any) => p.dataKey === 'confidenceBand') && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs font-semibold text-slate-400">
                            Confidence Range: {payload.find((p: any) => p.dataKey === 'confidenceBand').value[0]} - {payload.find((p: any) => p.dataKey === 'confidenceBand').value[1]} kWh
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants} className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2 text-emerald-600">
                        <div className="p-2 panel-soft-inset rounded-xl drop-shadow-sm">
                            <BrainCircuit className="w-6 h-6" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 drop-shadow-sm">Usage Forecasting</h1>
                    </div>
                    <p className="text-slate-500 font-medium">AI-driven predictive analysis of future energy consumption patterns.</p>
                </div>

                <div className="panel-soft rounded-2xl p-1 flex">
                    {[7, 14, 30].map((days) => (
                        <button
                            key={days}
                            onClick={() => setDaysAhead(days)}
                            className={`px-6 py-2 rounded-xl text-sm font-extrabold tracking-wide transition-all duration-300 ${daysAhead === days ? 'panel-soft-inset text-emerald-600 shadow-[inset_2px_2px_5px_#d1d9e6,_-2px_-2px_5px_#ffffff]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            {days} DAYS
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* KPI Metrics */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-indigo-500">
                            <Zap className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Predicted<br />Average</span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-700 tracking-tighter drop-shadow-sm flex items-end gap-1">
                            125<span className="text-sm font-bold text-slate-500 mb-1">.4 kWh/day</span>
                        </div>
                        <p className="text-sm font-bold text-emerald-500 mt-2 flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" /> 2.1% lower than historic
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-sky-500">
                            <Activity className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Expected<br />Peak</span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-700 tracking-tighter drop-shadow-sm flex items-end gap-1">
                            148<span className="text-sm font-bold text-slate-500 mb-1">.2 kWh</span>
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-2">
                            In approx {daysAhead > 7 ? '12' : '4'} days
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-amber-500">
                            <AlertTriangle className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Anomaly<br />Risk</span>
                    </div>
                    <div>
                        <div className="text-3xl font-black text-slate-700 tracking-tighter drop-shadow-sm">
                            Low
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">
                            Baseline stability is high.
                        </p>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-6 border border-white/60 flex flex-col justify-between group transition-all duration-300 hover:shadow-[10px_10px_20px_#d1d9e6,_-10px_-10px_20px_#ffffff]">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 panel-soft-inset border border-white/50 rounded-2xl text-emerald-500">
                            <BrainCircuit className="w-6 h-6 drop-shadow-sm" />
                        </div>
                        <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest leading-relaxed text-right">Model<br />Details</span>
                    </div>
                    <div>
                        <div className="text-xl font-black text-slate-700 tracking-tight drop-shadow-sm">
                            {modelInfo.type || 'Prophet (Loading)'}
                        </div>
                        <p className="text-sm font-bold text-slate-500 mt-2">
                            {modelInfo.confidence} Confidence Interval
                        </p>
                    </div>
                </motion.div>
            </motion.div>

            {/* Main Forecast Chart */}
            <motion.div variants={itemVariants} className="panel-soft rounded-3xl p-8 border border-white/60 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-300/20 rounded-full blur-3xl -mr-20 -mt-20 z-0"></div>

                <div className="flex justify-between items-end mb-8 relative z-10">
                    <div>
                        <h3 className="text-xl font-extrabold tracking-tight text-slate-700 drop-shadow-sm">Consumption Forecast</h3>
                        <p className="text-sm font-semibold text-slate-500">Historical vs AI Predicted Projection with Confidence Interval</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-inner bg-slate-400"></div>
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Historical Actuals</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full shadow-inner bg-emerald-500"></div>
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">AI Forecast</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-sm border-2 border-emerald-200 bg-emerald-100/50"></div>
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest shadow-sm">Confidence Band</span>
                        </div>
                    </div>
                </div>

                <div className="h-[450px] w-full relative z-10">
                    {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center">
                                <Activity className="w-10 h-10 text-emerald-500 animate-pulse drop-shadow-sm" />
                                <span className="mt-4 text-sm font-extrabold text-slate-400 uppercase tracking-widest">Loading Predictions...</span>
                            </div>
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={forecastData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" strokeOpacity={0.4} />
                                <XAxis
                                    dataKey="ds"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }}
                                    dy={15}
                                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    minTickGap={30}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 800 }}
                                    dx={-10}
                                />
                                <Tooltip content={<CustomTooltip />} />

                                {/* Historical Line */}
                                <Line
                                    type="monotone"
                                    dataKey="actual"
                                    stroke="#94a3b8"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: '#94a3b8', stroke: '#fff', strokeWidth: 2 }}
                                    name="Actual Usage"
                                />

                                {/* Confidence Interval Band */}
                                <Area
                                    type="monotone"
                                    dataKey="confidenceBand"
                                    stroke="none"
                                    fill="#10b981"
                                    fillOpacity={0.15}
                                    name="Confidence Interval"
                                />

                                {/* Predicted Line */}
                                <Line
                                    type="monotone"
                                    dataKey="yhat"
                                    stroke="#10b981"
                                    strokeWidth={3}
                                    dot={false}
                                    strokeDasharray="5 5"
                                    activeDot={{ r: 6, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }}
                                    name="Predicted Usage"
                                />

                            </ComposedChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};
