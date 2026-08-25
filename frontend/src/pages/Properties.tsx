import React, { useState, useEffect } from 'react';
import { Home, Droplet, Zap } from 'lucide-react';
import HouseBlueprint3D, { type ApplianceData } from '../components/ui/HouseBlueprint3D';

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-500 bg-red-50 rounded-xl overflow-auto h-full border border-red-200">
        <h2 className="font-bold text-lg mb-2">3D Map Crashed</h2>
        <pre className="text-xs">{this.state.error?.message}</pre>
        <pre className="text-xs mt-2">{this.state.error?.stack}</pre>
      </div>;
    }
    return this.props.children;
  }
}

const PROPERTIES = [
    { id: 1, name: 'Main Residence', lat: 37.7749, lng: -122.4194, status: 'good', waterSaved: 120, energySaved: 15 },
    { id: 2, name: 'Guest House', lat: 37.7755, lng: -122.4180, status: 'warning', waterSaved: 40, energySaved: 3 },
    { id: 3, name: 'Mountain Cabin', lat: 39.0968, lng: -120.0324, status: 'good', waterSaved: 85, energySaved: 10 },
];

const PROPERTY_APPLIANCES: Record<number, ApplianceData[]> = {
    1: [ // Main Residence
        { id: 'hvac', name: 'Main HVAC', isActive: true, position: [1.5, 0.5, 3.5], color: '#f59e0b' },
        { id: 'water', name: 'Water Heater', isActive: false, position: [3.5, 0.5, 3.5], color: '#ef4444' },
        { id: 'ev', name: 'EV Charger', isActive: true, position: [3.5, 0.5, 1.5], color: '#3b82f6' },
        { id: 'fridge', name: 'Smart Fridge', isActive: true, position: [1.5, 0.5, -2], color: '#10b981' },
        { id: 'plug1', name: 'TV Plug', isActive: false, position: [-2, 0.5, -3], color: '#8b5cf6' },
        { id: 'solar', name: 'Solar Inverter', isActive: true, position: [4.5, 0.5, 4.5], color: '#f59e0b' },
    ],
    2: [ // Guest House
        { id: 'gh-hvac', name: 'Mini-Split AC', isActive: true, position: [-2, 0.5, 2], color: '#f59e0b' },
        { id: 'gh-water', name: 'Tankless Water', isActive: true, position: [2, 0.5, 2], color: '#ef4444' },
        { id: 'gh-fridge', name: 'Mini Fridge', isActive: false, position: [2, 0.5, -2], color: '#10b981' },
        { id: 'gh-lights', name: 'Smart Lights', isActive: true, position: [0, 0.5, 0], color: '#fcd34d' },
    ],
    3: [ // Mountain Cabin
        { id: 'mc-heat', name: 'Pellet Stove', isActive: true, position: [0, 0.5, 3], color: '#ef4444' },
        { id: 'mc-pump', name: 'Well Pump', isActive: false, position: [3, 0.5, 3], color: '#3b82f6' },
        { id: 'mc-batt', name: 'Off-Grid Battery', isActive: true, position: [-3, 0.5, 3], color: '#10b981' },
        { id: 'mc-gen', name: 'Backup Gen', isActive: false, position: [-3, 0.5, -3], color: '#f59e0b' },
        { id: 'mc-sec', name: 'Security Cam', isActive: true, position: [3, 0.5, -3], color: '#8b5cf6' },
    ]
};

export const Properties = () => {
    const [selectedProperty, setSelectedProperty] = useState(PROPERTIES[0]);
    const [appliances, setAppliances] = useState<ApplianceData[]>(PROPERTY_APPLIANCES[1]);

    // Update base appliances when property changes
    useEffect(() => {
        setAppliances(PROPERTY_APPLIANCES[selectedProperty.id] || []);
    }, [selectedProperty.id]);

    // Randomize appliance states to make the 3D map feel "live"
    useEffect(() => {
        const interval = setInterval(() => {
            setAppliances(prev => prev.map(app => 
                // 10% chance to toggle state every 3 seconds to simulate live data
                Math.random() > 0.9 ? { ...app, isActive: !app.isActive } : app
            ));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0 relative z-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm">Multi-Home Management</h1>
                    <p className="text-slate-500 mt-2 font-bold tracking-wide">Monitor multiple installations across regions via Google Maps.</p>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0 relative z-10">
                {/* Properties List */}
                <div className="w-80 flex flex-col gap-4 overflow-y-auto hide-scrollbar shrink-0">
                    {PROPERTIES.map(prop => (
                        <div
                            key={prop.id}
                            onClick={() => setSelectedProperty(prop)}
                            className={`p-5 rounded-2xl cursor-pointer transition-all duration-300 border ${selectedProperty.id === prop.id ? 'panel-soft-inset border-emerald-400 shadow-[inset_2px_2px_5px_#d1d9e6,_inset_-2px_-2px_5px_#ffffff]' : 'panel-soft border-white/60 hover:shadow-[5px_5px_10px_#d1d9e6,_-5px_-5px_10px_#ffffff]'}`}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className={`p-2 rounded-xl text-white ${prop.status === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' : 'bg-emerald-500 shadow-[0_0_10px_#10b981]'}`}>
                                    <Home className="w-4 h-4" />
                                </div>
                                <h3 className="font-extrabold text-slate-700">{prop.name}</h3>
                            </div>
                            <div className="flex justify-between text-xs font-bold text-slate-500 tracking-wide mt-2 pt-3 border-t border-white/40">
                                <span className="flex items-center gap-1"><Droplet className="w-3 h-3 text-sky-500" /> {prop.waterSaved}L</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-amber-500" /> {prop.energySaved}kWh</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 3D Interactive Blueprint */}
                <div className="flex-1 overflow-hidden relative rounded-3xl">
                    <ErrorBoundary>
                        <HouseBlueprint3D appliances={appliances} propertyId={selectedProperty.id} />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default Properties;
