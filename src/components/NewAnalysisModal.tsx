import React, { useState } from 'react';
import { Drawing, SpecCategory } from '../types';
import { PlusCircle, Upload, X, FileText, CheckCircle } from 'lucide-react';

interface NewAnalysisModalProps {
  onAddDrawing: (newDwg: Drawing) => void;
  onClose: () => void;
}

export const NewAnalysisModal: React.FC<NewAnalysisModalProps> = ({ onAddDrawing, onClose }) => {
  const [partNumber, setPartNumber] = useState<string>('');
  const [partName, setPartName] = useState<string>('');
  const [engineModel, setEngineModel] = useState<string>('GT-25000 Industrial Engine');
  const [material, setMaterial] = useState<string>('Inconel 718');
  const [materialSpec, setMaterialSpec] = useState<string>('AMS 5662');
  const [note1, setNote1] = useState<string>('HEAT TREAT PER EMS 52401 CLASS 2. FINAL HARDNESS HRC 38 - 42.');
  const [note2, setNote2] = useState<string>('FLUORESCENT PENETRANT INSPECTION PER NDT-SPEC-004 TYPE 1 METHOD A SENSITIVITY LEVEL 2.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNumber || !partName) return;

    const newDwg: Drawing = {
      id: `dwg-custom-${Date.now()}`,
      partNumber,
      partName,
      engineModel,
      material,
      materialSpec,
      revision: 'Rev. A',
      diagramType: 'blade',
      notes: [
        {
          id: `note-c1-${Date.now()}`,
          noteNumber: 1,
          rawText: note1,
          category: 'HEAT_TREATMENT',
          specCode: 'EMS 52401',
          parameterName: 'Heat Treatment',
          requiredValue: 'HRC 38 - 42'
        },
        {
          id: `note-c2-${Date.now()}`,
          noteNumber: 2,
          rawText: note2,
          category: 'NDT',
          specCode: 'NDT-SPEC-004',
          parameterName: 'NDT Penetrant',
          requiredValue: 'Level 2'
        }
      ]
    };

    onAddDrawing(newDwg);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 text-xs shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm text-slate-100">신규 부품 도면/주기사항 등록</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">부품 번호 (P/N)</label>
              <input
                type="text"
                required
                placeholder="예: P/N 33401-01"
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">부품명</label>
              <input
                type="text"
                required
                placeholder="예: High Pressure Turbine Disk"
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">소재 재질 및 규격</label>
              <input
                type="text"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="예: Inconel 718"
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">적용 엔진 모델</label>
              <input
                type="text"
                value={engineModel}
                onChange={(e) => setEngineModel(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-amber-300 font-bold mb-1">Note #1: 열처리 주기사항 (Heat Treatment)</label>
            <textarea
              rows={2}
              value={note1}
              onChange={(e) => setNote1(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-sky-300 font-bold mb-1">Note #2: 비파괴검사/코팅 주기사항 (NDT / Coating)</label>
            <textarea
              rows={2}
              value={note2}
              onChange={(e) => setNote2(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
            >
              등록 및 AI 검토 실행
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
