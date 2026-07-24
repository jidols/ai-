import React, { useState } from 'react';
import { ComplianceResult, SecurityMode, HistoricalNCR } from '../types';
import { AlertOctagon, AlertTriangle, CheckCircle2, Shield, BookOpen, FileText, ArrowRight, Sparkles, RefreshCw, Layers, Wrench, FileCheck, Check, Send } from 'lucide-react';
import { findHistoricalNCRMatch } from '../services/complianceEngine';

interface ComplianceAdvisorPanelProps {
  auditResults: ComplianceResult[];
  selectedNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  securityMode: SecurityMode;
  onRunDeepGeminiAnalysis: (noteId: string) => void;
  isAnalyzing: boolean;
  openSdrDraftModal: (res: ComplianceResult) => void;
}

export const ComplianceAdvisorPanel: React.FC<ComplianceAdvisorPanelProps> = ({
  auditResults,
  selectedNoteId,
  onSelectNote,
  securityMode,
  onRunDeepGeminiAnalysis,
  isAnalyzing,
  openSdrDraftModal
}) => {
  const selectedResult = auditResults.find(r => r.noteId === selectedNoteId) || auditResults[0];

  const matchedNcrHistory: HistoricalNCR | null = selectedResult
    ? findHistoricalNCRMatch(selectedResult.levelCAdvice.historicalPrecedentMatchId)
    : null;

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-full">
      {/* Top Advisor Header */}
      <div className="p-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            적합성 검토 및 Level C 엔지니어링 제안 (Reasoning Engine)
          </span>
        </div>

        {/* Security / Model Indicator */}
        <div className="flex items-center gap-2">
          {securityMode === 'AIRGAP_ONPREM' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              On-Premise Air-Gap (Local Rules/Llama-3)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Gemini 3.6 Flash Hybrid Analysis
            </span>
          )}

          <button
            onClick={() => selectedResult && onRunDeepGeminiAnalysis(selectedResult.noteId)}
            disabled={isAnalyzing}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all disabled:opacity-50"
            title="AI 재검토 및 정밀 추론 실행"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>AI 재분석</span>
          </button>
        </div>
      </div>

      {/* Note Tabs Bar */}
      <div className="bg-slate-950 border-b border-slate-800 px-3 py-2 flex items-center gap-2 overflow-x-auto">
        <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">주기사항 항목:</span>
        {auditResults.map((res) => {
          const isSelected = res.noteId === selectedNoteId;
          let badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
          if (res.severity === 'CRITICAL') badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';
          if (res.severity === 'WARNING') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';

          return (
            <button
              key={res.id}
              onClick={() => onSelectNote(res.noteId)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-slate-800 border-amber-500/80 text-white shadow-sm'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Note #{res.noteNumber}</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] border ${badgeColor}`}>
                {res.severity}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Advisor Body Scrollable */}
      {selectedResult ? (
        <div className="p-4 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* Discrepancy Status Hero Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-md ${
            selectedResult.severity === 'CRITICAL'
              ? 'bg-red-950/40 border-red-500/50 text-red-100'
              : selectedResult.severity === 'WARNING'
              ? 'bg-amber-950/40 border-amber-500/50 text-amber-100'
              : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100'
          }`}>
            {selectedResult.severity === 'CRITICAL' && <AlertOctagon className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />}
            {selectedResult.severity === 'WARNING' && <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />}
            {selectedResult.severity === 'OK' && <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />}

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                <span className="font-bold text-sm">
                  {selectedResult.discrepancyTitle}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                  selectedResult.severity === 'CRITICAL'
                    ? 'bg-red-500/30 text-red-300 border-red-500/60'
                    : selectedResult.severity === 'WARNING'
                    ? 'bg-amber-500/30 text-amber-300 border-amber-500/60'
                    : 'bg-emerald-500/30 text-emerald-300 border-emerald-500/60'
                }`}>
                  {selectedResult.severity === 'CRITICAL' && '규격 상충 (Critical Discrepancy)'}
                  {selectedResult.severity === 'WARNING' && '경계 조건 (Process Warning)'}
                  {selectedResult.severity === 'OK' && '규격 준수 (Compliance Confirmed)'}
                </span>
              </div>

              {/* Side-by-Side Values Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-medium mb-0.5">📄 도면 주기사항 요구치 (Drawing)</span>
                  <span className="font-mono text-amber-300 font-semibold">{selectedResult.drawingRequirement}</span>
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-medium mb-0.5">📚 특수공정 표준 기준치 (Spec Library)</span>
                  <span className="font-mono text-emerald-300 font-semibold">{selectedResult.specStandardValue}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Precise Citation (근거 제시 - Page & Row Highlight) */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-slate-200">규격서 근거 및 조항 출처 (Citation)</span>
              </div>
              <span className="bg-sky-950 text-sky-300 border border-sky-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                {selectedResult.citation.specCode} ({selectedResult.citation.sectionRef})
              </span>
            </div>

            <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400 text-[10px]">
                <span>📄 규격서: {selectedResult.citation.specTitle}</span>
                <span className="text-amber-400 font-bold">PAGE {selectedResult.citation.page} {selectedResult.citation.tableRef && `| ${selectedResult.citation.tableRef}`}</span>
              </div>

              <p className="bg-amber-950/30 text-amber-200 p-2.5 rounded border border-amber-500/30 leading-relaxed font-semibold">
                "{selectedResult.citation.exactStandardRequirement}"
              </p>

              {selectedResult.citation.matchedRowText && (
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 flex items-center gap-1">
                  <span className="text-slate-500">테이블 추출 행:</span>
                  <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded">{selectedResult.citation.matchedRowText}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Level C Senior Engineer Action Guide (엔지니어링 수석 제안) */}
          <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-slate-200">Level C 수석 엔지니어 기술 가이드</span>
            </div>

            {/* General Advice Summary */}
            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 leading-relaxed text-slate-300">
              <span className="text-amber-400 font-bold block mb-1">💡 엔지니어링 대안 및 조치 방향:</span>
              {selectedResult.levelCAdvice.summary}
            </div>

            {/* Risk Assessment */}
            <div className="p-3 bg-red-950/20 rounded-lg border border-red-500/30 leading-relaxed text-red-200">
              <span className="text-red-400 font-bold block mb-1">⚠️ 품질 및 부적합(NCR) 위험성 평가:</span>
              {selectedResult.levelCAdvice.riskAssessment}
            </div>

            {/* Process Parameter Adjustment Box */}
            <div className="p-3 bg-indigo-950/30 rounded-lg border border-indigo-500/30 space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-300 font-bold">
                <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                <span>현장 특수공정 변수 조정 지침:</span>
              </div>
              <p className="text-slate-200 font-semibold text-[11px] pl-5">
                • {selectedResult.levelCAdvice.processAdjustment.recommendedAction}
              </p>
              <p className="text-slate-400 text-[10px] pl-5">
                (사유: {selectedResult.levelCAdvice.processAdjustment.engineeringReason})
              </p>
            </div>

            {/* SDR Request Draft Generation Trigger */}
            {selectedResult.levelCAdvice.sdrRecommendation.required && (
              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/40 flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <span className="text-amber-300 font-bold block text-xs">
                    📋 설계공차 완화(SDR) 발송 제안
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {selectedResult.levelCAdvice.sdrRecommendation.title}
                  </span>
                </div>

                <button
                  onClick={() => openSdrDraftModal(selectedResult)}
                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold rounded-lg text-xs shadow transition-all flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>SDR 신청서 작성</span>
                </button>
              </div>
            )}
          </div>

          {/* Section 3: Historical NCR / Technical Review Match (과거 유사 사례) */}
          {matchedNcrHistory && (
            <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span className="font-bold text-slate-200">과거 유사 사례 매칭 (Precedent Database)</span>
                </div>
                <span className="bg-purple-950 text-purple-300 border border-purple-500/30 text-[10px] px-2 py-0.5 rounded font-mono font-semibold">
                  {matchedNcrHistory.id}
                </span>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400 text-[10px]">
                  <span>부품: {matchedNcrHistory.partNumber} ({matchedNcrHistory.partName})</span>
                  <span className="text-emerald-400 font-bold">{matchedNcrHistory.sdrNumber} ({matchedNcrHistory.approvalStatus})</span>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  <span className="text-purple-300 font-semibold block mb-0.5">과거 승인 조치 내역:</span>
                  {matchedNcrHistory.appliedSolution}
                </p>

                <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 flex items-center justify-between">
                  <span>검토자: {matchedNcrHistory.engineerName}</span>
                  <span>승인일: {matchedNcrHistory.approvalDate}</span>
                </div>
              </div>
            </div>
          )}

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500">
          검토할 주기사항 항목을 선택하십시오.
        </div>
      )}
    </div>
  );
};
