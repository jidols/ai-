import React, { useState } from 'react';
import { Drawing, DrawingNote } from '../types';
import { FileText, Search, ZoomIn, ZoomOut, Layers, AlertTriangle, CheckCircle, Info, Sparkles, Upload } from 'lucide-react';

interface DrawingViewerProps {
  drawings: Drawing[];
  selectedDrawing: Drawing;
  onSelectDrawing: (dwg: Drawing) => void;
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  openNewAnalysisModal: () => void;
}

export const DrawingViewer: React.FC<DrawingViewerProps> = ({
  drawings,
  selectedDrawing,
  onSelectDrawing,
  selectedNoteId,
  onSelectNote,
  openNewAnalysisModal
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Top Header & Selector */}
      <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            도면 및 주기사항 분석기 (Input Analyzer)
          </span>
        </div>

        {/* Drawing Selector Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDrawing.id}
            onChange={(e) => {
              const dwg = drawings.find(d => d.id === e.target.value);
              if (dwg) onSelectDrawing(dwg);
            }}
            className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:border-amber-500"
          >
            {drawings.map(d => (
              <option key={d.id} value={d.id}>
                {d.partNumber} - {d.partName}
              </option>
            ))}
          </select>

          <button
            onClick={openNewAnalysisModal}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 text-xs flex items-center gap-1 transition-all"
            title="직접 도면 업로드/주기사항 입력"
          >
            <Upload className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-medium">업로드</span>
          </button>
        </div>
      </div>

      {/* Part Metadata Banner */}
      <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800/80 text-xs grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div>
          <span className="text-slate-500 block text-[10px]">PART NUMBER</span>
          <span className="font-bold text-slate-100">{selectedDrawing.partNumber}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">ENGINE MODEL</span>
          <span className="font-medium text-amber-300">{selectedDrawing.engineModel}</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">MATERIAL / SPEC</span>
          <span className="font-semibold text-slate-200">{selectedDrawing.material} ({selectedDrawing.materialSpec})</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">REVISION</span>
          <span className="font-mono text-slate-300">{selectedDrawing.revision}</span>
        </div>
      </div>

      {/* Interactive CAD / Blueprint Visualization Container */}
      <div className="relative bg-slate-950 flex-1 min-h-[220px] max-h-[300px] border-b border-slate-800 flex items-center justify-center overflow-hidden p-4">
        {/* Zoom Controls Overlay */}
        <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800 shadow-md">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 15, 160))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="확대"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 font-mono px-1">{zoomLevel}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 15, 75))}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            title="축소"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Blueprint Diagrams based on Diagram Type */}
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transition: 'transform 0.2s ease-out' }}
          className="w-full h-full flex items-center justify-center"
        >
          {selectedDrawing.diagramType === 'blade' && (
            <svg viewBox="0 0 400 200" className="w-full h-full max-w-[360px]">
              {/* Technical Blueprint Grid Lines */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Turbine Blade CAD Wireframe */}
              <path
                d="M 120,160 C 120,110 140,50 200,30 C 260,10 280,40 260,90 C 240,140 210,160 210,160 Z"
                fill="#0f172a"
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray={selectedNoteId === 'note-3' ? 'none' : '4,2'}
              />
              {/* Blade Fir-Tree Root */}
              <path
                d="M 120,160 L 100,185 L 140,185 L 130,172 L 180,172 L 170,185 L 210,185 L 210,160 Z"
                fill="#1e293b"
                stroke="#38bdf8"
                strokeWidth="2"
              />

              {/* Note Pin Overlay Callouts */}
              {selectedDrawing.notes.map((note) => {
                const isSelected = selectedNoteId === note.id;
                let px = 80;
                let py = 40;
                if (note.noteNumber === 1) { px = 160; py = 168; } // Heat treat root
                if (note.noteNumber === 2) { px = 240; py = 70; }  // FPI Airfoil
                if (note.noteNumber === 3) { px = 275; py = 45; }  // TBC Coating

                return (
                  <g
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className="cursor-pointer group"
                  >
                    <line x1={px} y1={py} x2={px + 20} y2={py - 15} stroke={isSelected ? '#f59e0b' : '#64748b'} strokeWidth="1.5" />
                    <circle
                      cx={px}
                      cy={py}
                      r={isSelected ? 10 : 8}
                      fill={isSelected ? '#f59e0b' : '#1e293b'}
                      stroke={isSelected ? '#fef08a' : '#94a3b8'}
                      strokeWidth="2"
                    />
                    <text
                      x={px}
                      y={py + 4}
                      textAnchor="middle"
                      fill={isSelected ? '#0f172a' : '#f8fafc'}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {note.noteNumber}
                    </text>
                  </g>
                );
              })}

              <text x="10" y="190" fill="#64748b" fontSize="10" fontFamily="monospace">
                TURBINE BLADE CAD MODEL [P/N 12345-01]
              </text>
            </svg>
          )}

          {selectedDrawing.diagramType === 'liner' && (
            <svg viewBox="0 0 400 200" className="w-full h-full max-w-[360px]">
              <rect width="100%" height="100%" fill="#020617" />
              {/* Combustor Liner Cylinder Outline */}
              <ellipse cx="200" cy="100" rx="140" ry="60" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <ellipse cx="200" cy="100" rx="100" ry="40" fill="none" stroke="#0284c7" strokeWidth="1.5" strokeDasharray="3,3" />
              {/* Cooling Hole Matrix */}
              <circle cx="160" cy="80" r="3" fill="#38bdf8" />
              <circle cx="200" cy="70" r="3" fill="#38bdf8" />
              <circle cx="240" cy="80" r="3" fill="#38bdf8" />
              <text x="10" y="190" fill="#64748b" fontSize="10" fontFamily="monospace">
                COMBUSTOR LINER FABRICATION [P/N 67890-03]
              </text>
            </svg>
          )}

          {selectedDrawing.diagramType === 'vane' && (
            <svg viewBox="0 0 400 200" className="w-full h-full max-w-[360px]">
              <rect width="100%" height="100%" fill="#020617" />
              <path d="M 100,140 C 140,60 260,60 300,140 Z" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <path d="M 120,120 C 150,80 230,80 280,120 Z" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <text x="10" y="190" fill="#64748b" fontSize="10" fontFamily="monospace">
                1ST STAGE VANE RING SEGMENT [P/N 98765-04]
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Extracted Notes List (OCR / NER Structured Table) */}
      <div className="p-3 bg-slate-900 flex-1 overflow-y-auto space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 pb-1 border-b border-slate-800">
          <span>도면 주기사항 추출 항목 (General Notes)</span>
          <span className="text-slate-500 text-[10px]">{selectedDrawing.notes.length}개 조항 추출됨</span>
        </div>

        {selectedDrawing.notes.map((note) => {
          const isSelected = selectedNoteId === note.id;

          return (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                  : 'bg-slate-950/70 border-slate-800/90 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full font-bold flex items-center justify-center text-[10px] ${
                    isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {note.noteNumber}
                  </span>
                  <span className="font-bold text-slate-200">{note.specCode}</span>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-amber-300 border border-slate-700">
                  {note.category}
                </span>
              </div>

              <p className="text-slate-300 font-mono text-[11px] leading-relaxed mb-2 bg-slate-900/90 p-2 rounded border border-slate-800/80">
                "{note.rawText}"
              </p>

              {/* Extracted Entities Chips */}
              <div className="flex items-center gap-2 text-[10px] flex-wrap">
                <span className="text-slate-400">추출 파라미터:</span>
                <span className="bg-amber-950/80 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-medium">
                  {note.parameterName}: {note.requiredValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
