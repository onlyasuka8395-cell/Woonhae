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
  const [quantity, setQuantity] = useState<number>(50);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');

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
  };
  
  const handleToggleAdminMode = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setPasswordInput('');
      setPasswordError('');
      setShowPasswordModal(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === '8395') {
      setIsAdminMode(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError('비밀번호가 틀렸습니다.');
      setPasswordInput(''); // Clear input on error
    }
  };

  const handleCalculate = useCallback(() => {
    if (dimensions.width <= 0 || dimensions.length <= 0 || dimensions.height <= 0 || quantity < 50 || quantity >= 1000) {
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
    let proportionalFeePerBox = areaM2 * processingFeePerM2;

    // 2. 가공비 상한선 적용 (m²당 가공비의 150%)
    const maxFeePerBox = processingFeePerM2 * 1.5;
    proportionalFeePerBox = Math.min(proportionalFeePerBox, maxFeePerBox);

    // 3. 1장당 최소 가공비 계산 (m²당 가공비 단가의 40%)
    const minFeePerBox = processingFeePerM2 * 0.4;

    // 4. 초기 1장당 가공비 결정 (둘 중 큰 값)
    let initialFeePerBox = Math.max(proportionalFeePerBox, minFeePerBox);

    // 5. BB골 추가 비용 적용 (20% 할증)
    if (fluteType === FluteType.BB) {
      initialFeePerBox *= 1.20;
    }
    
    // 6. 최종 1장당 가공비
    const finalFeePerBox = initialFeePerBox;

    // 7. 최종 총 가공비 계산
    const finalProcessingFee = finalFeePerBox * quantity;

    // 원가 계산
    const totalCost = totalMaterialCost + finalProcessingFee; // 총 원가
    const costPerBox = totalCost / quantity; // 1개당 원가

    // 마진 5% 추가된 판매가 계산
    const costPerBoxWithMargin = costPerBox * 1.05; // 1개당 판매가
    const totalCostWithMargin = costPerBoxWithMargin * quantity; // 총 판매가

    setResult({
      totalMaterialCost,
      finalProcessingFee,
      totalCost,
      costPerBox,
      rawMaterialAreaPerBox: areaM2,
      costPerBoxWithMargin,
      totalCostWithMargin,
    });
  }, [dimensions, quantity, fluteType, settings]);

  const PasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center animate-fade-in">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm mx-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">관리자 로그인</h2>
        <form onSubmit={handlePasswordSubmit}>
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            id="password-input"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            autoFocus
          />
          {passwordError && <p className="text-red-500 text-sm mt-2 text-center">{passwordError}</p>}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowPasswordModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
      {showPasswordModal && <PasswordModal />}

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">골판지 박스 단가 계산기</h1>
        <p className="text-gray-600 mt-2">박스 규격과 수량을 입력하여 예상 단가를 확인하세요.</p>
        <div className="mt-4 flex justify-center">
            <button
                onClick={handleToggleAdminMode}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                aria-label={isAdminMode ? '일반 모드로 전환' : '관리자 모드 접속'}
            >
                <i className={`fas ${isAdminMode ? 'fa-user-check' : 'fa-user-lock'} mr-2`}></i>
                {isAdminMode ? '일반 모드로 전환' : '관리자 모드'}
            </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        {isAdminMode && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-700">
              <i className="fas fa-cogs mr-2 text-blue-500"></i>관리자 설정
            </h2>
            <AdminPanel currentSettings={settings} onSave={handleSaveSettings} />
          </div>
        )}
        
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
                  <ResultsDisplay result={result} quantity={quantity} isAdminMode={isAdminMode} />
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
              <i className="fas fa-ruler-combined mr-2 text-indigo-500"></i>A형 박스 전개도 및 원단 정보
            </h2>
            <BoxDiagram
              dimensions={dimensions}
              sheetLength={(dimensions.width + dimensions.length) * 2 + 30}
              sheetWidth={dimensions.length + dimensions.height}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;