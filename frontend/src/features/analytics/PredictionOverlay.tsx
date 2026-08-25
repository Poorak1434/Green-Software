import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', actual: 120, predicted: 125 },
    { name: 'Tue', actual: 132, predicted: 130 },
    { name: 'Wed', actual: 101, predicted: 110 },
    { name: 'Thu', actual: 150, predicted: 145 },
    { name: 'Fri', actual: 90, predicted: 95 },
    { name: 'Sat', actual: null, predicted: 180 }, // Future prediction
    { name: 'Sun', actual: null, predicted: 165 }, // Future prediction
];

export const PredictionOverlay = () => {
    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96 flex flex-col">
            <div className="mb-6 flex justify-between items-start">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        Usage Forecast
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] font-bold tracking-wide uppercase border border-indigo-100">AI Powered</span>
                    </h2>
                    <p className="text-sm text-slate-500">Historical data overlaid with AI velocity predictions.</p>
                </div>
            </div>

            <div className="flex-1 min-h-0 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 12 }}
                        />
                        <Tooltip
                            cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="plainline" />

                        <Line
                            type="monotone"
                            dataKey="actual"
                            name="Actual Usage"
                            stroke="#0f172a"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#0f172a' }}
                            activeDot={{ r: 6 }}
                            connectNulls
                        />
                        <Line
                            type="monotone"
                            dataKey="predicted"
                            name="Predicted Forecast"
                            stroke="#818cf8"
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
