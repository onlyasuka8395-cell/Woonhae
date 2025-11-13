
import React from 'react';
import { CalculationResult } from '../types';

interface ResultsDisplayProps {
  result: CalculationResult;
  quantity: number;
  isAdminMode: boolean;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, quantity, isAdminMode }) => {
  const formatCurrency = (amount: number) => {
    return `₩ ${Math.round(amount).toLocaleString()}`;
  };

  if (isAdminMode) {
    // --- Admin Mode View ---
    const materialCostPerBox = result.totalMaterialCost / quantity;
    const processingFeePerBox = result.finalProcessingFee / quantity;
    const totalCostPerBox = result.costPerBox;

    const materialPercentage = totalCostPerBox > 0 ? (materialCostPerBox / totalCostPerBox) * 100 : 0;
    const processingPercentage = totalCostPerBox > 0 ? (processingFeePerBox / totalCostPerBox) * 100 : 0;
    
    return (
      <div className="space-y-4">
        {/* Cost Breakdown Details */}
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
        
        {/* Cost Composition Chart */}
        <div className="pt-2">
          <h3 className="text-base font-semibold text-gray-700 mb-2 text-center">원가 구성 (1개당)</h3>
          <div className="w-full bg-gray-200 rounded-full h-6 flex overflow-hidden text-white text-xs font-bold shadow-inner">
            <div className="bg-sky-500 h-full flex items-center justify-center transition-all duration-500" style={{ width: `${materialPercentage}%` }} title={`자재비: ${materialPercentage.toFixed(1)}%`}>
              {materialPercentage > 15 && `자재비`}
            </div>
            <div className="bg-teal-500 h-full flex items-center justify-center transition-all duration-500" style={{ width: `${processingPercentage}%` }} title={`가공비: ${processingPercentage.toFixed(1)}%`}>
              {processingPercentage > 15 && `가공비`}
            </div>
          </div>
        </div>

        {/* Cost Price Section */}
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">박스 1개당 단가 (원가)</p>
          <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(result.costPerBox)}</p>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">총 합계 금액 (원가)</p>
          <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(result.totalCost)}</p>
        </div>
        
        {/* Selling Price Section */}
        <div className="bg-purple-100 border-l-4 border-purple-500 text-purple-800 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">최종 판매 단가 (개당)</p>
           <p className="text-sm font-mono mt-1 text-gray-600">{`(원가 ${formatCurrency(result.costPerBox)} + 마진 5%)`}</p>
          <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(result.costPerBoxWithMargin)}</p>
        </div>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-lg text-center">
          <p className="text-lg font-bold">최종 판매가 (총액)</p>
           <p className="text-sm font-mono mt-1 text-gray-600">{`(${formatCurrency(result.costPerBoxWithMargin)} x ${quantity.toLocaleString()}매)`}</p>
          <p className="text-2xl font-bold font-mono mt-1">{formatCurrency(result.totalCostWithMargin)}</p>
        </div>
      </div>
    );
  } else {
    // --- User Mode View (displays selling price only) ---
    return (
      <div className="space-y-4">
        <div className="bg-green-100 border-l-4 border-green-500 text-green-800 p-4 rounded-lg text-center mt-4">
          <p className="text-xl font-bold">박스 1개당 단가</p>
          <p className="text-3xl font-bold font-mono mt-1">{formatCurrency(result.costPerBoxWithMargin)}</p>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg text-center">
          <p className="text-xl font-bold">총 합계 금액</p>
          <p className="text-lg font-mono mt-2 text-gray-700">
              {`(${formatCurrency(result.costPerBoxWithMargin)} x ${quantity.toLocaleString()}매)`}
          </p>
          <p className="text-3xl font-bold font-mono mt-1">
              {formatCurrency(result.totalCostWithMargin)}
          </p>
        </div>
      </div>
    );
  }
};

export default ResultsDisplay;