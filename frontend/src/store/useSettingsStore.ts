import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CurrencyConfig {
  code: string;
  symbol: string;
  rateVsUSD: number; // Multiplier from base USD
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  'USD ($)': { code: 'USD', symbol: '$', rateVsUSD: 1.0 },
  'INR (₹)': { code: 'INR', symbol: '₹', rateVsUSD: 83.5 },
  'EUR (€)': { code: 'EUR', symbol: '€', rateVsUSD: 0.92 },
  'GBP (£)': { code: 'GBP', symbol: '£', rateVsUSD: 0.78 },
  'JPY (¥)': { code: 'JPY', symbol: '¥', rateVsUSD: 155.0 },
};

export interface SettingsState {
  // Profile
  displayName: string;
  timezone: string;
  currency: string;

  // Eco Targets
  targetWaterSaving: number; // Liters/month
  targetEnergySaving: number; // kWh/month
  autoEcoMode: boolean;
  harvestRainwater: boolean;
  condensateRecycling: boolean;

  // Alerts
  anomalySensitivity: 'Low' | 'Medium' | 'High';
  leakPushAlerts: boolean;
  leakSmsAlerts: boolean;
  powerSpikeAlerts: boolean;
  dailyDigest: boolean;

  // IoT Hardware
  mqttHost: string;
  mqttPort: string;
  hardwareProtocol: string;
  apiKey: string;

  // Utility Tariffs
  peakElectricityRate: number; // in base USD per kWh
  offPeakElectricityRate: number;
  waterRate: number; // per 1000L
  solarFeedInCredit: number;

  // Privacy
  telemetryOptIn: boolean;
  anonymizeData: boolean;

  // Actions
  updateSettings: (partial: Partial<SettingsState>) => void;
  getCurrencyConfig: () => CurrencyConfig;
  formatCost: (amountInUSD: number) => string;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      displayName: 'Poorak Pandey',
      timezone: 'Asia/Kolkata (GMT+5:30)',
      currency: 'INR (₹)',

      targetWaterSaving: 1500,
      targetEnergySaving: 60,
      autoEcoMode: true,
      harvestRainwater: true,
      condensateRecycling: true,

      anomalySensitivity: 'Medium',
      leakPushAlerts: true,
      leakSmsAlerts: true,
      powerSpikeAlerts: true,
      dailyDigest: false,

      mqttHost: 'mqtt.greensoftware.internal',
      mqttPort: '8883',
      hardwareProtocol: 'Matter / Thread',
      apiKey: 'gs_live_98a7b6c5d4e3f2a1_prod',

      peakElectricityRate: 0.18,
      offPeakElectricityRate: 0.09,
      waterRate: 2.40,
      solarFeedInCredit: 0.07,

      telemetryOptIn: true,
      anonymizeData: true,

      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),

      getCurrencyConfig: () => {
        const currKey = get().currency;
        return CURRENCIES[currKey] || CURRENCIES['USD ($)'];
      },

      formatCost: (amountInUSD: number) => {
        const config = get().getCurrencyConfig();
        const converted = amountInUSD * config.rateVsUSD;
        
        if (config.code === 'INR' || config.code === 'JPY') {
          return `${config.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
        }
        return `${config.symbol}${converted.toFixed(2)}`;
      },
    }),
    {
      name: 'greensoftware-settings-storage',
    }
  )
);
