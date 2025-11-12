import React from 'react';
import { CalculationResult } from '../types';

interface ResultsDisplayProps {
  result: CalculationResult;
  quantity: number;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, quantity }) => {
  const formatCurrency = (amount: number) => {
    return `₩ ${Math.round(amount).toLocaleString()}`;
  };

  const materialCostPerBox = result.totalMaterialCost / quantity;
  const processingFeePerBox = result.finalProcessingFee / quantity;

  return (
    <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center text-gray-700">
            <span>박스당 원단 면적 (Loss 포함):</span>
            <span className="font-mono text-sm">{result.rawMaterialAreaPerBox.toFixed(4)} m²</span>
          </div>
          <hr/>
          <div className="flex justify-between items-center text-gray-700">
            <span>1장당 자재비:</span>
            <span className="font-mono">{formatCurrency(materialCostPerBox)}</span>
          </div>
          <div className="flex justify-between items-center text-gray-700">
            <span>1장당 가공비:</span>
            <span className="font-mono">{formatCurrency(processingFeePerBox)}</span>
          </div>
        </div>
        
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg text-center">
          <p className="text-xl font-bold">박스 1개당 단가</p>
          <p className="text-3xl font-bold font-mono mt-1">{formatCurrency(result.costPerBox)}</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg text-center">
            <p className="text-xl font-bold">총 합계 금액</p>
            <p className="text-lg font-mono mt-2 text-gray-700">
                {`(${formatCurrency(result.costPerBox)} x ${quantity.toLocaleString()}매)`}
            </p>
            <p className="text-3xl font-bold font-mono mt-1">
                {formatCurrency(result.totalCost)}
            </p>
        </div>
      </div>
  );
};

export default ResultsDisplay;
