import React, { useState } from 'react';
import { AppSettings, FluteType } from '../types';
import { FLUTE_OPTIONS } from '../constants';

interface AdminPanelProps {
  currentSettings: AppSettings;
  onSave: (settings: AppSettings) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ currentSettings, onSave }) => {
  const [settings, setSettings] = useState<AppSettings>(currentSettings);

  const handlePriceChange = (flute: FluteType, value: string) => {
    const price = parseInt(value, 10);
    setSettings(prev => ({
      ...prev,
      flutePrices: {
        ...prev.flutePrices,
        [flute]: isNaN(price) ? 0 : price
      }
    }));
  };

  const handleFeeChange = (index: number, value: string) => {
    const fee = parseInt(value, 10);
    const newFees = [...settings.processingFees];
    newFees[index] = { ...newFees[index], fee: isNaN(fee) ? 0 : fee };
    setSettings(prev => ({
      ...prev,
      processingFees: newFees,
    }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="mt-4 border-t pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">골판지 평방미터(m²)당 단가 (원)</h3>
          <div className="space-y-3">
            {FLUTE_OPTIONS.map(option => (
              <div key={option.value} className="flex items-center">
                <label className="w-28 font-semibold">{option.label}:</label>
                <input
                  type="number"
                  value={settings.flutePrices[option.value] || ''}
                  onChange={(e) => handlePriceChange(option.value as FluteType, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">수량별 평방미터(m²)당 가공비 (원)</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
            {settings.processingFees.map((tier, index) => (
              <div key={index} className="flex items-center text-sm">
                <label className="w-36 font-semibold">{`${tier.min} ~ ${tier.max}매`}:</label>
                <input
                  type="number"
                  value={tier.fee}
                  onChange={(e) => handleFeeChange(index, e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 text-right">
        <button
          onClick={handleSave}
          className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          설정 저장
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;