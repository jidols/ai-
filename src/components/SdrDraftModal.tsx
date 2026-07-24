import React, { useState } from 'react';
import { ComplianceResult, Drawing } from '../types';
import { FileText, Send, Copy, Check, X, AlertTriangle, ShieldAlert } from 'lucide-react';

interface SdrDraftModalProps {
  drawing: Drawing;
  result: ComplianceResult;
  onClose: () => void;
}

export const SdrDraftModal: React.FC<SdrDraftModalProps> = ({ drawing, result, onClose }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const [sdrTitle, setSdrTitle] = useState<string>(result.levelCAdvice.sdrRecommendation.title);
  const [justification, setJustification] = useState<string>(result.levelCAdvice.sdrRecommendation.justification);
  const [proposedTolerance, setProposedTolerance] = useState<string>(result.levelCAdvice.sdrRecommendation.proposedTolerance);
  const [riskAssessment, setRiskAssessment] = useState<string>(result.levelCAdvice.riskAssessment);

  const fullSdrText = `
==================================================
[한화에어로스페이스] 설계공차 완화 요청서 (SDR Draft)
==================================================
문서 번호: SDR-${Date.now().toString().slice(-6)}
신청 일자: ${new Date().toISOString().split('T')[0]}
신청 부서: 가스터빈 공정기술팀 / 품질보증팀
대상 부품: ${drawing.partNumber} (${drawing.partName})
적용 엔진: ${drawing.engineModel}
소재 및 규격: ${drawing.material} (${drawing.materialSpec})

1. SDR 신청 제목:
${sdrTitle}

2. 기존 도면 요구사항 (Current Drawing Note):
${result.drawingRequirement} (Note #${result.noteNumber})

3. 특수공정 규격서 기준치 (Spec Standard):
${result.specStandardValue} [규격: ${result.citation.specCode}, Section: ${result.citation.sectionRef}]

4. 신청 사유 및 기술적 타당성 (Engineering Justification):
${justification}

5. 변경 제안 공차/조건 (Proposed Concession / Tolerance):
${proposedTolerance}

6. 품질 및 고온 피로 위험성 평가 (Risk Assessment):
${riskAssessment}

7. Level C 엔지니어 검토 의견:
${result.levelCAdvice.summary}

--------------------------------------------------
검토자: Level C 수석엔지니어 (한화에어로스페이스 HASI AI 검증 완료)
==================================================
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullSdrText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-5 space-y-4 text-xs shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">설계공차 완화 요청서 (SDR) 초안 작성기</h3>
              <p className="text-[11px] text-slate-400">설계팀 공식 승인 요청용 엔지니어링 문서 자동 생성</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Editable Form */}
        <div className="space-y-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
          <div>
            <label className="block text-amber-300 font-bold mb-1">SDR 요청 제목</label>
            <input
              type="text"
              value={sdrTitle}
              onChange={(e) => setSdrTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">기술적 타당성 및 사유 (Justification)</label>
            <textarea
              rows={3}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-emerald-300 font-bold mb-1">변경 제안 공차/조건 (Proposed Tolerance)</label>
            <input
              type="text"
              value={proposedTolerance}
              onChange={(e) => setProposedTolerance(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-emerald-300 text-xs rounded-lg p-2 focus:outline-none focus:border-emerald-500 font-mono font-bold"
            />
          </div>

          <div>
            <label className="block text-red-300 font-bold mb-1">품질 및 피로수명 영향 평가 (Risk Assessment)</label>
            <textarea
              rows={2}
              value={riskAssessment}
              onChange={(e) => setRiskAssessment(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-red-500 font-mono"
            />
          </div>
        </div>

        {/* Full Formatted Document Preview */}
        <div className="space-y-1">
          <div className="flex justify-between items-center text-slate-400 text-[11px]">
            <span>발송용 텍스트 미리보기:</span>
            <button
              onClick={handleCopy}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded flex items-center gap-1 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사 완료!' : '클립보드 복사'}</span>
            </button>
          </div>

          <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {fullSdrText}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
