import React, { useRef, useState, useEffect } from 'react';
import { BoxDimensions } from '../types';

interface BoxDiagramProps {
  dimensions: BoxDimensions;
}

const BoxDiagram: React.FC<BoxDiagramProps> = ({ dimensions }) => {
  const { width, length, height } = dimensions;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const calculateScale = () => {
      if (containerRef.current && (width > 0 && length > 0 && height > 0)) {
        const glueFlapDim = 30; // Original dimension for calculation
        const totalSheetLength = width * 2 + length * 2 + glueFlapDim;
        
        // Use clientWidth for available space. p-4 means 1rem (16px) padding on each side.
        const availableWidth = containerRef.current.clientWidth - 32;

        if (totalSheetLength > 0 && totalSheetLength > availableWidth) {
          setScale(availableWidth / totalSheetLength);
        } else {
          setScale(1); // Use original size if it fits
        }
      }
    };

    calculateScale();

    window.addEventListener('resize', calculateScale);
    return () => {
      window.removeEventListener('resize', calculateScale);
    };
  }, [width, length, height]);


  if (!width || !length || !height) {
    return (
        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[200px]">
            <p className="text-gray-500">치수를 입력하고 계산하여 전개도를 확인하세요.</p>
        </div>
    );
  }

  const glueFlapDim = 30;

  const w = width * scale;
  const l = length * scale;
  const h = height * scale;
  const flapH = (length / 2) * scale;
  const glueW = glueFlapDim * scale;

  const totalDiagramWidth = w * 2 + l * 2 + glueW;
  const totalDiagramHeight = h + 2 * flapH;

  const dimTextStyle: React.CSSProperties = {
    fontSize: `${Math.max(6, 12 * scale)}px`, 
    fontWeight: 'bold',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    padding: `0 ${Math.max(1, 4 * scale)}px`,
    borderRadius: '2px',
  };

  return (
    <div ref={containerRef} className="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex justify-center items-center" style={{ minHeight: totalDiagramHeight + 40 }}>
      <div className="relative font-sans" style={{ width: totalDiagramWidth, height: totalDiagramHeight }}>
        {/* Top Flaps */}
        <div className="absolute border border-gray-400 bg-white" style={{ top: 0, left: glueW, width: w, height: flapH }}></div>
        <div className="absolute border-b border-t border-r border-gray-400 bg-white" style={{ top: 0, left: glueW + w, width: l, height: flapH }}></div>
        <div className="absolute border-b border-t border-r border-gray-400 bg-white" style={{ top: 0, left: glueW + w + l, width: w, height: flapH }}></div>
        <div className="absolute border-b border-t border-r border-gray-400 bg-white" style={{ top: 0, left: glueW + w + l + w, width: l, height: flapH }}></div>

        {/* Main Body */}
        <div className="absolute border-t border-b border-l border-gray-600 bg-gray-200 flex items-center justify-center" style={{ top: flapH, left: 0, width: glueW, height: h }}>
            <span style={{ fontSize: `${Math.max(5, 10 * scale)}px`, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>접착</span>
        </div>
        <div className="absolute border border-gray-600 bg-yellow-100 flex items-center justify-center" style={{ top: flapH, left: glueW, width: w, height: h }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 flex flex-col items-center">
                <div className="w-full h-px bg-red-500"></div>
                <span className="text-red-600 -mt-2.5" style={dimTextStyle}>{dimensions.width}mm</span>
            </div>
        </div>
        <div className="absolute border-y border-r border-gray-600 bg-blue-100 flex items-center justify-center" style={{ top: flapH, left: glueW + w, width: l, height: h }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 flex flex-col items-center">
                <div className="w-full h-px bg-red-500"></div>
                <span className="text-red-600 -mt-2.5" style={dimTextStyle}>{dimensions.length}mm</span>
            </div>
        </div>
        <div className="absolute border-y border-r border-gray-600 bg-yellow-100 flex items-center justify-center" style={{ top: flapH, left: glueW + w + l, width: w, height: h }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4/5 flex items-center">
                <div className="h-full w-px bg-red-500"></div>
                <span className="text-red-600 -ml-2.5" style={{...dimTextStyle, writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>{dimensions.height}mm</span>
            </div>
        </div>
        <div className="absolute border-y border-r border-gray-600 bg-blue-100 flex items-center justify-center" style={{ top: flapH, left: glueW + w + l + w, width: l, height: h }}></div>
        
        {/* Bottom Flaps */}
        <div className="absolute border border-gray-400 bg-white" style={{ top: flapH + h, left: glueW, width: w, height: flapH }}></div>
        <div className="absolute border-t border-b border-r border-gray-400 bg-white" style={{ top: flapH + h, left: glueW + w, width: l, height: flapH }}></div>
        <div className="absolute border-t border-b border-r border-gray-400 bg-white" style={{ top: flapH + h, left: glueW + w + l, width: w, height: flapH }}></div>
        <div className="absolute border-t border-b border-r border-gray-400 bg-white" style={{ top: flapH + h, left: glueW + w + l + w, width: l, height: flapH }}></div>

      </div>
    </div>
  );
};

export default BoxDiagram;