import { FluteType, AppSettings } from './types';

export const FLUTE_OPTIONS = [
  { value: FluteType.B, label: 'B골 (3mm)' },
  { value: FluteType.A, label: 'A골 (5mm)' },
  { value: FluteType.BB, label: 'BB골 (6mm)' },
];

export const DEFAULT_SETTINGS: AppSettings = {
  flutePrices: {
    [FluteType.B]: 500,
    [FluteType.A]: 600,
    [FluteType.BB]: 800,
  },
  processingFees: [
    { min: 1, max: 99, fee: 800 },
    { min: 100, max: 199, fee: 750 },
    { min: 200, max: 299, fee: 700 },
    { min: 300, max: 399, fee: 650 },
    { min: 400, max: 499, fee: 600 },
    { min: 500, max: 599, fee: 550 },
    { min: 600, max: 699, fee: 500 },
    { min: 700, max: 799, fee: 450 },
    { min: 800, max: 899, fee: 400 },
    { min: 900, max: 999, fee: 350 },
  ],
};