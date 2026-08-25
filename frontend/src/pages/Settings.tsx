import React, { useState } from 'react';
import {
  User,
  Bell,
  Zap,
  Droplet,
  Cpu,
  DollarSign,
  Leaf,
  Check,
  Save,
  Key,
  Globe,
  Sliders,
  Lock,
  RefreshCw,
  Copy,
  ShieldCheck
} from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { useSettingsStore } from '../store/useSettingsStore';

export const Settings: React.FC = () => {
  const { user } = useUser();
  const settings = useSettingsStore();
  const updateSettings = settings.updateSettings;

  const [activeTab, setActiveTab] = useState<'profile' | 'eco' | 'alerts' | 'iot' | 'tariffs' | 'privacy'>('profile');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State initialized from store
  const [displayName, setDisplayName] = useState(settings.displayName || user?.fullName || 'Poorak Pandey');
  const [timezone, setTimezone] = useState(settings.timezone);
  const [currency, setCurrency] = useState(settings.currency);

  const [targetWaterSaving, setTargetWaterSaving] = useState(settings.targetWaterSaving);
  const [targetEnergySaving, setTargetEnergySaving] = useState(settings.targetEnergySaving);
  const [autoEcoMode, setAutoEcoMode] = useState(settings.autoEcoMode);
  const [harvestRainwater, setHarvestRainwater] = useState(settings.harvestRainwater);
  const [condensateRecycling, setCondensateRecycling] = useState(settings.condensateRecycling);

  const [leakPushAlerts, setLeakPushAlerts] = useState(settings.leakPushAlerts);
  const [leakSmsAlerts, setLeakSmsAlerts] = useState(settings.leakSmsAlerts);
  const [powerSpikeAlerts, setPowerSpikeAlerts] = useState(settings.powerSpikeAlerts);
  const [dailyDigest, setDailyDigest] = useState(settings.dailyDigest);
  const [anomalySensitivity, setAnomalySensitivity] = useState(settings.anomalySensitivity);

  const [mqttHost, setMqttHost] = useState(settings.mqttHost);
  const [mqttPort, setMqttPort] = useState(settings.mqttPort);
  const [hardwareProtocol, setHardwareProtocol] = useState(settings.hardwareProtocol);
  const [apiKey, setApiKey] = useState(settings.apiKey);
  const [showApiKey, setShowApiKey] = useState(false);

  const [peakElectricityRate, setPeakElectricityRate] = useState(String(settings.peakElectricityRate));
  const [offPeakElectricityRate, setOffPeakElectricityRate] = useState(String(settings.offPeakElectricityRate));
  const [waterRate, setWaterRate] = useState(String(settings.waterRate));
  const [solarFeedInCredit, setSolarFeedInCredit] = useState(String(settings.solarFeedInCredit));

  const [telemetryOptIn, setTelemetryOptIn] = useState(settings.telemetryOptIn);
  const [anonymizeData, setAnonymizeData] = useState(settings.anonymizeData);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // Persist changes to global Zustand store
    updateSettings({
      displayName,
      timezone,
      currency,
      targetWaterSaving,
      targetEnergySaving,
      autoEcoMode,
      harvestRainwater,
      condensateRecycling,
      leakPushAlerts,
      leakSmsAlerts,
      powerSpikeAlerts,
      dailyDigest,
      anomalySensitivity,
      mqttHost,
      mqttPort,
      hardwareProtocol,
      apiKey,
      peakElectricityRate: parseFloat(peakElectricityRate) || 0.18,
      offPeakElectricityRate: parseFloat(offPeakElectricityRate) || 0.09,
      waterRate: parseFloat(waterRate) || 2.40,
      solarFeedInCredit: parseFloat(solarFeedInCredit) || 0.07,
      telemetryOptIn,
      anonymizeData,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-700 tracking-tight drop-shadow-sm flex items-center gap-3">
            System & Eco Settings
          </h1>
          <p className="text-slate-500 mt-1 font-bold tracking-wide">
            Configure property preferences, eco threshold targets, notification channels, and IoT hardware integrations.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="btn-soft-primary flex items-center gap-2 px-5 py-2.5 rounded-2xl text-emerald-600 font-extrabold shadow-md hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          {savedSuccess ? <Check className="w-5 h-5 text-emerald-600" /> : <Save className="w-5 h-5 text-emerald-600" />}
          <span>{savedSuccess ? 'Settings Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-fade-in shadow-sm">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your system configuration and eco targets have been successfully saved.</span>
        </div>
      )}

      {/* Main Layout Grid: Tabs Left, Content Right */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Navigation Sidebar Tabs */}
        <div className="md:col-span-1 space-y-2">
          <div className="panel-soft p-3 space-y-1.5">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'profile'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <User className="w-4 h-4 text-emerald-500" />
              <span>User Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('eco')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'eco'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Leaf className="w-4 h-4 text-emerald-500" />
              <span>Eco Targets</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'alerts'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>Alerts & Notifications</span>
            </button>

            <button
              onClick={() => setActiveTab('iot')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'iot'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Cpu className="w-4 h-4 text-sky-500" />
              <span>IoT & Hardware</span>
            </button>

            <button
              onClick={() => setActiveTab('tariffs')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'tariffs'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>Utility Tariffs</span>
            </button>

            <button
              onClick={() => setActiveTab('privacy')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all ${
                activeTab === 'privacy'
                  ? 'panel-soft-inset text-emerald-600 border border-emerald-400/50'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-white/40'
              }`}
            >
              <Lock className="w-4 h-4 text-purple-500" />
              <span>Data & Privacy</span>
            </button>
          </div>

          {/* Account Status Badge */}
          <div className="panel-soft p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-[0_0_10px_#10b981]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Plan Status</p>
                <p className="text-sm font-extrabold text-slate-700">GreenSoftware Premium</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 font-bold leading-relaxed">
              Full AI anomaly monitoring, predictive trend modeling, and unlimited IoT actuators enabled.
            </p>
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="panel-soft p-8 space-y-8">

            {/* --- TAB 1: USER PROFILE --- */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-500" /> User Profile & Localization
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Manage display preferences and user identity.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={user?.primaryEmailAddress?.emailAddress || 'owner@greensoftware.io'}
                      disabled
                      className="w-full px-4 py-3 rounded-2xl bg-slate-100/60 text-slate-400 font-bold text-sm border border-slate-200 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Timezone</label>
                    <div className="relative">
                      <select
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40 appearance-none bg-no-repeat"
                      >
                        <option>Asia/Kolkata (GMT+5:30)</option>
                        <option>America/New_York (GMT-4:00)</option>
                        <option>Europe/London (GMT+1:00)</option>
                        <option>Asia/Tokyo (GMT+9:00)</option>
                        <option>UTC (GMT+0:00)</option>
                      </select>
                      <Globe className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Display Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    >
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                      <option>INR (₹)</option>
                      <option>JPY (¥)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 2: ECO TARGETS --- */}
            {activeTab === 'eco' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-emerald-500" /> Eco & Sustainability Thresholds
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Set conservation targets and automated green recycling behavior.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Water Saving Target Slider */}
                  <div className="panel-soft-inset p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-sky-500" /> Monthly Water Target
                      </span>
                      <span className="text-sm font-black text-sky-600">{targetWaterSaving} Liters</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="5000"
                      step="100"
                      value={targetWaterSaving}
                      onChange={(e) => setTargetWaterSaving(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 font-bold">Goal for reduced municipal water draw.</p>
                  </div>

                  {/* Energy Saving Target Slider */}
                  <div className="panel-soft-inset p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-4 h-4 text-amber-500" /> Monthly Energy Target
                      </span>
                      <span className="text-sm font-black text-amber-600">{targetEnergySaving} kWh</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="300"
                      step="5"
                      value={targetEnergySaving}
                      onChange={(e) => setTargetEnergySaving(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 font-bold">Goal for reduced grid power consumption.</p>
                  </div>
                </div>

                {/* Eco Toggles */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider">Automated Conservation Rules</h3>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Auto Eco-Mode Routing</p>
                      <p className="text-xs text-slate-500 font-bold">Automatically route greywater to secondary flush tanks when primary level exceeds 80%.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAutoEcoMode(!autoEcoMode)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${autoEcoMode ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Rainwater Harvesting Priority</p>
                      <p className="text-xs text-slate-500 font-bold">Prioritize rainwater cistern over main water line during irrigation cycles.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHarvestRainwater(!harvestRainwater)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${harvestRainwater ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">AC Condensate Collector Integration</p>
                      <p className="text-xs text-slate-500 font-bold">Divert HVAC condensation drip directly into garden drip lines.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCondensateRecycling(!condensateRecycling)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${condensateRecycling ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 3: ALERTS & NOTIFICATIONS --- */}
            {activeTab === 'alerts' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-amber-500" /> Alerts & Anomaly Sensitivity
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Configure leak notifications, power spike warnings, and ML anomaly sensitivity.</p>
                </div>

                {/* Sensitivity Selector */}
                <div className="panel-soft-inset p-5 space-y-3">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-emerald-500" /> ML Z-Score Anomaly Sensitivity
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Low', 'Medium', 'High'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setAnomalySensitivity(level)}
                        className={`py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                          anomalySensitivity === level
                            ? 'bg-emerald-500 text-white shadow-md'
                            : 'bg-white/60 text-slate-600 hover:bg-white'
                        }`}
                      >
                        {level} Sensitivity
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-bold">
                    {anomalySensitivity === 'Low' && 'Flag only extreme outliers (Z-Score > 3.5). Minimal false alarms.'}
                    {anomalySensitivity === 'Medium' && 'Standard ML detection balance (Z-Score > 2.5). Recommended.'}
                    {anomalySensitivity === 'High' && 'Aggressive early detection (Z-Score > 1.8). May report minor flow drops.'}
                  </p>
                </div>

                {/* Notification Toggles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Instant Pipe Leak Push Notifications</p>
                      <p className="text-xs text-slate-500 font-bold">Send immediate high-priority alerts to mobile app on abnormal flow rates.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLeakPushAlerts(!leakPushAlerts)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${leakPushAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Emergency SMS Alerts</p>
                      <p className="text-xs text-slate-500 font-bold">SMS text warning if automated cutoff valves trigger during dry run or leak.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLeakSmsAlerts(!leakSmsAlerts)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${leakSmsAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Unusual Power Draw Warnings</p>
                      <p className="text-xs text-slate-500 font-bold">Alert when an appliance exceeds 150% of its normal operating wattage.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPowerSpikeAlerts(!powerSpikeAlerts)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${powerSpikeAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Daily Eco Digest Email</p>
                      <p className="text-xs text-slate-500 font-bold">Receive a 24-hour summary of total water saved, energy metrics, and cost.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDailyDigest(!dailyDigest)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${dailyDigest ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 4: IOT & HARDWARE --- */}
            {activeTab === 'iot' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-sky-500" /> IoT Gateway & Hardware Protocols
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Configure telemetry brokers, smart valves, and API authentication credentials.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">MQTT Broker Host</label>
                    <input
                      type="text"
                      value={mqttHost}
                      onChange={(e) => setMqttHost(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">MQTT SSL Port</label>
                    <input
                      type="text"
                      value={mqttPort}
                      onChange={(e) => setMqttPort(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Hardware Protocol Mesh</label>
                  <select
                    value={hardwareProtocol}
                    onChange={(e) => setHardwareProtocol(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                  >
                    <option>Matter / Thread Mesh</option>
                    <option>Zigbee 3.0 Standard</option>
                    <option>Z-Wave Plus V2</option>
                    <option>Modbus TCP / Industrial RS485</option>
                  </select>
                </div>

                {/* API Key Box */}
                <div className="panel-soft-inset p-5 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="w-4 h-4 text-emerald-500" /> Ingestion Secret Key
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setApiKey('gs_live_' + Math.random().toString(36).substring(2, 12) + '_prod')}
                        className="text-xs font-extrabold text-slate-500 hover:text-slate-700 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                      </button>
                      <button
                        type="button"
                        onClick={copyApiKey}
                        className="text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Key
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="flex-1 px-4 py-2.5 rounded-xl bg-white/70 text-slate-700 font-mono text-xs font-bold border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="px-3 py-2 rounded-xl bg-slate-200/70 text-slate-600 text-xs font-extrabold hover:bg-slate-300 transition-all"
                    >
                      {showApiKey ? 'Hide' : 'Reveal'}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 font-bold">Use this header key (`X-GS-API-KEY`) for IoT hardware telemetry posts.</p>
                </div>
              </div>
            )}

            {/* --- TAB 5: UTILITY TARIFFS --- */}
            {activeTab === 'tariffs' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-500" /> Utility Tariffs & Rate Structures
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Input regional utility costs for precise financial savings estimates.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Peak Electricity Rate ($ / kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={peakElectricityRate}
                      onChange={(e) => setPeakElectricityRate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Off-Peak Electricity Rate ($ / kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={offPeakElectricityRate}
                      onChange={(e) => setOffPeakElectricityRate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Municipal Water Rate ($ / 1,000 Liters)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={waterRate}
                      onChange={(e) => setWaterRate(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-600 uppercase tracking-wider">Solar Feed-In Credit ($ / kWh)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={solarFeedInCredit}
                      onChange={(e) => setSolarFeedInCredit(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl panel-soft-inset text-slate-700 font-extrabold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 border border-white/40"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* --- TAB 6: DATA & PRIVACY --- */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-700 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-purple-500" /> Data Governance & Privacy
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-1">Control telemetry retention, local storage policies, and ML data anonymization.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Anonymous ML Model Improvement</p>
                      <p className="text-xs text-slate-500 font-bold">Share stripped time-series metrics to help train regional water conservation models.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAnonymizeData(!anonymizeData)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${anonymizeData ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl panel-soft-inset">
                    <div>
                      <p className="text-sm font-extrabold text-slate-700">Extended Raw Telemetry Retention (90 Days)</p>
                      <p className="text-xs text-slate-500 font-bold">Store high-frequency 1-second sensor data points before auto-aggregating into hourly logs.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTelemetryOptIn(!telemetryOptIn)}
                      className={`w-12 h-7 flex items-center rounded-full p-1 transition-all ${telemetryOptIn ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                    >
                      <div className="w-5 h-5 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>
                </div>

                {/* Security Actions */}
                <div className="pt-4 border-t border-slate-200/60 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={() => alert('Local cache and offline telemetry state cleared!')}
                    className="btn-soft px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 hover:text-amber-600"
                  >
                    <RefreshCw className="w-4 h-4" /> Clear Local App Cache
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Save Action */}
            <div className="pt-6 border-t border-slate-200/60 flex justify-end">
              <button
                type="submit"
                className="btn-soft-primary flex items-center gap-2 px-6 py-3 rounded-2xl text-emerald-600 font-black shadow-md hover:scale-105 active:scale-95 transition-all text-sm"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{savedSuccess ? 'Changes Saved' : 'Save System Settings'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
