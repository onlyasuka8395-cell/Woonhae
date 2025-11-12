import React, { useState, useEffect, useCallback } from 'react';
import AdminPanel from './components/AdminPanel';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import { AppSettings, BoxDimensions, CalculationResult, FluteType } from './types';
import { DEFAULT_SETTINGS } from './constants';
import BoxDiagram from './components/BoxDiagram';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [dimensions, setDimensions] = useState<BoxDimensions>({ width: 0, length: 0, height: 0 });
  const [fluteType, setFluteType] = useState<FluteType>(FluteType.B);
  const [quantity, setQuantity] = useState<number>(1);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('boxCalculatorSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('boxCalculatorSettings', JSON.stringify(newSettings));
    setShowAdmin(false);
  };

  const handleCalculate = useCallback(() => {
    if (dimensions.width <= 0 || dimensions.length <= 0 || dimensions.height <= 0 || quantity <= 0) {
      setResult(null);
      return;
    }

    // 원단 전체 면적 계산 (mm 단위)
    const sheetLength = (dimensions.width + dimensions.length) * 2 + 30;
    const sheetWidth = dimensions.length + dimensions.height;
    const areaMM2 = sheetLength * sheetWidth;
    const areaWithLossMM2 = areaMM2 * 1.10; // 로스 10%
    const areaM2 = areaWithLossMM2 / 1_000_000; // 제곱미터로 변환

    // 자재비 계산
    const unitPrice = settings.flutePrices[fluteType] || 0;
    const totalMaterialCost = areaM2 * unitPrice * quantity;

    // 가공비 계산
    const feeTier = settings.processingFees.find(tier => quantity >= tier.min && quantity <= tier.max);
    const processingFeePerM2 = feeTier ? feeTier.fee : 0; // m²당 가공비

    // 1. 면적에 비례한 1장당 가공비 계산
    const proportionalFeePerBox = areaM2 * processingFeePerM2;

    // 2. 1장당 최소 가공비 계산 (m²당 가공비 단가의 40%)
    const minFeePerBox = processingFeePerM2 * 0.4;

    // 3. 최종 1장당 가공비 결정 (둘 중 큰 값)
    let finalFeePerBox = Math.max(proportionalFeePerBox, minFeePerBox);

    // 4. BB골 추가 비용 적용 (20% 할증)
    if (fluteType === FluteType.BB) {
      finalFeePerBox *= 1.20;
    }
    
    // 5. 최종 총 가공비 계산
    const finalProcessingFee = finalFeePerBox * quantity;

    // 최종 단가
    const totalCost = totalMaterialCost + finalProcessingFee;
    const costPerBox = totalCost / quantity;

    setResult({
      totalMaterialCost,
      finalProcessingFee,
      totalCost,
      costPerBox,
      rawMaterialAreaPerBox: areaM2
    });
  }, [dimensions, quantity, fluteType, settings]);

  return (
    <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">골판지 박스 단가 계산기</h1>
        <p className="text-gray-600 mt-2">박스 규격과 수량을 입력하여 예상 단가를 확인하세요.</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              <i className="fas fa-cogs mr-2 text-blue-500"></i>관리자 설정
            </h2>
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              {showAdmin ? '설정 닫기' : '설정 열기'} <i className={`fas fa-chevron-${showAdmin ? 'up' : 'down'} ml-2`}></i>
            </button>
          </div>
          {showAdmin && <AdminPanel currentSettings={settings} onSave={handleSaveSettings} />}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">
                <i className="fas fa-calculator mr-2 text-green-500"></i>견적 계산
            </h2>
            <CalculatorForm
              dimensions={dimensions}
              setDimensions={setDimensions}
              fluteType={fluteType}
              setFluteType={setFluteType}
              quantity={quantity}
              setQuantity={setQuantity}
              onCalculate={handleCalculate}
            />
          </div>
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">
                <i className="fas fa-chart-bar mr-2 text-purple-500"></i>계산 결과
              </h2>
              {result ? (
                <div className="animate-fade-in">
                  <ResultsDisplay result={result} quantity={quantity} />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[200px]">
                   <p className="text-gray-500 text-center">견적 계산 버튼을 누르면<br/>결과가 여기에 표시됩니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {result && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-3">
              <i className="fas fa-ruler-combined mr-2 text-indigo-500"></i>A형 박스 전개도
            </h2>
            <BoxDiagram dimensions={dimensions} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;