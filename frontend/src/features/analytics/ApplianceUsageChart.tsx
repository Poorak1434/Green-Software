import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Loader2, AlertTriangle } from 'lucide-react';

export const ApplianceUsageChart = () => {
    // 1. Hardcoded UUID for Demo
    const MOCK_DEVICE_ID = '00000000-0000-0000-0000-000000000001';

    // 2. Fetch data from backend
    const { data: analytics_data, isLoading, isError } = useQuery({
        queryKey: ['device-analytics', MOCK_DEVICE_ID],
        queryFn: async () => {
            const response = await axios.get(`http://localhost:8000/api/v1/green/devices/${MOCK_DEVICE_ID}/analytics`);
            return response.data;
        }
    });

    return (
        <div className="panel-soft p-6 h-[26rem] flex flex-col relative group">
            <div className="mb-6 relative z-10">
                <h2 className="text-xl font-extrabold text-slate-700 tracking-tight">Weekly Appliance Usage</h2>
                <p className="text-sm text-slate-500 font-bold mt-1">Water (L) and Energy (kWh) consumption over the last 7 days.</p>
            </div>

            <div className="flex-1 min-h-0 w-full relative z-10">
                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#f4f7fa]/80 backdrop-blur-sm z-20 rounded-2xl panel-soft-inset">
                        <Loader2 className="w-8 h-8 animate-spin text-emerald-500 mb-2 drop-shadow-sm" />
                        <span className="text-slate-500 font-bold tracking-wide text-sm">Loading telemetry...</span>
                    </div>
                )}

                {isError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-rose-50/80 backdrop-blur-sm z-20 rounded-2xl panel-soft-inset border border-rose-200">
                        <AlertTriangle className="w-8 h-8 text-rose-500 mb-2 drop-shadow-sm" />
                        <span className="text-rose-600 font-bold tracking-wide text-sm">Failed to load analytics</span>
                    </div>
                )}

                {analytics_data && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            // We construct the expected dual-key obj by mapping the hypothetical single value API response
                            data={analytics_data.historical_data.map((d: any) => ({
                                name: d.day,
                                water: d.value,
                                energy: d.value * 0.035 // Mocking dependent energy correlation since API only sends one value currently
                            }))}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            barSize={16}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1d9e6" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                stroke="#10b981"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                stroke="#f59e0b"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }}
                            />
                            <Tooltip
                                cursor={{ fill: '#eef2f6' }}
                                contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.8)', boxShadow: '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff', backgroundColor: '#f4f7fa', fontWeight: 'bold', color: '#334155' }}
                            />
                            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 'bold' }} iconType="circle" />

                            <Bar yAxisId="left" dataKey="water" name="Water (L)" stackId="a" fill="url(#colorWater)" radius={[4, 4, 0, 0]} />
                            <Bar yAxisId="right" dataKey="energy" name="Energy (kWh)" fill="url(#colorEnergy)" radius={[4, 4, 0, 0]} />

                            <defs>
                                <linearGradient id="colorWater" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                </linearGradient>
                                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.8} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};
