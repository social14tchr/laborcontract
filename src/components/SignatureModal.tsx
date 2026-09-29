import React, { useEffect, useRef, useState } from 'react';
import { Eraser, PenTool, Stamp, X } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  role: 'employer' | 'worker' | null;
  signerName: string;
  onClose: () => void;
  onSave: (role: 'employer' | 'worker', dataUrl: string) => void;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  role,
  signerName,
  onClose,
  onSave
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setHasDrawn(false);
    }
  }, [isOpen, role]);

  if (!isOpen || !role) return null;

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    setIsDrawing(true);
    setHasDrawn(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);
    ctx.lineWidth = 2.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const generateAutoStamp = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const displayName =
      signerName.trim() || (role === 'employer' ? '김사업' : '이민수');

    if (role === 'employer') {
      // Draw traditional red oval seal + signature
      ctx.save();
      ctx.font = 'bold 28px "Gowun Batang", serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName, canvas.width / 2 - 28, canvas.height / 2);

      // Red stamp
      const stampX = canvas.width / 2 + 45;
      const stampY = canvas.height / 2;
      ctx.strokeStyle = '#dc2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(stampX, stampY, 22, 30, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#dc2626';
      ctx.font = 'bold 13px "Gowun Batang", serif';
      ctx.fillText(displayName.slice(0, 3) + '인', stampX, stampY);
      ctx.restore();
    } else {
      // Draw handwritten-style youth signature
      ctx.save();
      ctx.font = 'italic bold 32px "Gowun Batang", serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayName + ' (서명)', canvas.width / 2, canvas.height / 2);

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 70, canvas.height / 2 + 22);
      ctx.quadraticCurveTo(
        canvas.width / 2,
        canvas.height / 2 + 30,
        canvas.width / 2 + 75,
        canvas.height / 2 + 16
      );
      ctx.stroke();
      ctx.restore();
    }
    setHasDrawn(true);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (!hasDrawn) {
      generateAutoStamp();
    }
    const dataUrl = canvas.toDataURL('image/png');
    onSave(role, dataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 no-print">
      <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <PenTool className="w-4 h-4 text-sky-700" />
            <span>
              {role === 'employer'
                ? '사업주 전자 서명 입력'
                : '근로자(청소년) 전자 서명 입력'}
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors"
            aria-label="서명 창 닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>마우스나 터치로 직접 서명하거나 자동 서명을 생성하세요.</span>
          <button
            type="button"
            onClick={generateAutoStamp}
            className="text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <Stamp className="w-3.5 h-3.5" />
            <span>인장·서명 자동 생성</span>
          </button>
        </div>

        <div className="border-2 border-dashed border-slate-300 rounded-lg bg-slate-50 flex justify-center items-center overflow-hidden">
          <canvas
            ref={canvasRef}
            width={380}
            height={160}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-40 cursor-crosshair touch-none"
          />
        </div>

        <div className="flex justify-between items-center pt-1">
          <button
            type="button"
            onClick={clearCanvas}
            className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1.5 border border-slate-300 rounded-lg transition-colors whitespace-nowrap"
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>지우기</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors whitespace-nowrap"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            >
              서명 적용하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
