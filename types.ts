
export enum FluteType {
  B = 'B',
  A = 'A',
  BB = 'BB',
}

export interface FlutePrice {
  [key: string]: number;
}

export interface ProcessingFeeTier {
  min: number;
  max: number;
  fee: number;
}

export interface AppSettings {
  flutePrices: FlutePrice;
  processingFees: ProcessingFeeTier[];
}

export interface BoxDimensions {
  width: number;
  length: number;
  height: number;
}

export interface CalculationResult {
  totalMaterialCost: number;
  finalProcessingFee: number;
  totalCost: number;
  costPerBox: number;
  rawMaterialAreaPerBox: number;
}
