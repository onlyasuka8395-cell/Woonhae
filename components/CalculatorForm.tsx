
import React from 'react';
import { BoxDimensions, FluteType } from '../types';
import { FLUTE_OPTIONS } from '../constants';

interface CalculatorFormProps {
  dimensions: BoxDimensions;
  setDimensions: React.Dispatch<React.SetStateAction<BoxDimensions>>;
  fluteType: FluteType;
  setFluteType: React.Dispatch<React.SetStateAction<FluteType>>;
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  onCalculate: () => void;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({
  dimensions,
  setDimensions,
  fluteType,
  setFluteType,
  quantity,
  setQuantity,
  onCalculate,
}) => {
  const handleDimensionChange = (field: keyof BoxDimensions, value: string) => {
    const numValue = parseInt(value, 10);
    setDimensions(prev => ({
      ...prev,
      [field]: isNaN(numValue) ? 0 : numValue,
    }));
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setQuantity(isNaN(numValue) ? 0 : numValue);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">가로 (mm)</label>
          <input
            type="number"
            placeholder="예: 300"
            value={dimensions.width || ''}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">세로 (mm)</label>
          <input
            type="number"
            placeholder="예: 200"
            value={dimensions.length || ''}
            onChange={(e) => handleDimensionChange('length', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">높이 (mm)</label>
          <input
            type="number"
            placeholder="예: 100"
            value={dimensions.height || ''}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">골 종류</label>
          <select
            value={fluteType}
            onChange={(e) => setFluteType(e.target.value as FluteType)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-white text-gray-900"
          >
            {FLUTE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">제작 수량 (매)</label>
          <input
            type="number"
            placeholder="1-999"
            value={quantity || ''}
            min="1"
            max="999"
            onChange={(e) => handleQuantityChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
      </div>
      {quantity >= 1000 && (
          <p className="text-sm text-red-600 font-semibold text-center">
            1,000매 이상 제작은 사무실로 문의해주세요.
          </p>
      )}
      <div className="pt-2 text-center">
        <button
          onClick={onCalculate}
          disabled={quantity >= 1000}
          className="w-full sm:w-auto bg-green-600 text-white font-bold py-3 px-12 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-lg"
        >
          계산하기
        </button>
      </div>
    </div>
  );
};

export default CalculatorForm;