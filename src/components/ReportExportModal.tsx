import React from 'react';
import { Drawing, ComplianceResult, SecurityMode } from '../types';
import { FileSpreadsheet, Download, Printer, CheckCircle2, AlertOctagon, AlertTriangle, ShieldCheck, FileCheck, Building2 } from 'lucide-react';

interface ReportExportModalProps {
  drawing: Drawing;
  auditResults: ComplianceResult[];
  securityMode: SecurityMode;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  drawing,
  auditResults,
  securityMode
}) => {
  const criticalCount = auditResults.filter(r => r.severity === 'CRITICAL').length;
  const warningCount = auditResults.filter(r => r.severity === 'WARNING').length;
  const okCount = auditResults.filter(r => r.severity === 'OK').length;

  const handleDownloadExcelCSV = () => {
    const BOM = '\uFEFF';
    let csvContent = `${BOM}지능형 특수공정 컴플라이언스 검토보고서 (Hanwha Aero-Spec Insight)\n`;
    csvContent += `보고서 번호,HASI-RPT-${Date.now().toString().slice(-6)}\n`;
    csvContent += `작성일자,${new Date().toISOString().split('T')[0]}\n`;
    csvContent += `부품번호,${drawing.partNumber}\n`;
    csvContent += `부품명,${drawing.partName}\n`;
    csvContent += `적용 엔진,${drawing.engineModel}\n`;
    csvContent += `소재/규격,${drawing.material} (${drawing.materialSpec})\n`;
    csvContent += `보안 모드,${securityMode === 'AIRGAP_ONPREM' ? '사내 온프레미스 에어갭 모드' : 'Gemini Hybrid AI 분석'}\n\n`;

    csvContent += `[종합 검토 결과 요약]\n`;
    csvContent += `전체 주기사항 항목,${auditResults.length}건\n`;
    csvContent += `규격 충돌(CRITICAL),${criticalCount}건\n`;
    csvContent += `경계 주의(WARNING),${warningCount}건\n`;
    csvContent += `규격 적합(OK),${okCount}건\n\n`;

    csvContent += `[주기사항별 특수공정 정합성 세부 검토 내역]\n`;
    csvContent += `Note #,공정 분류,참조 규격,판정,도면 요구사항,규격서 표준 기준치,조항 출처 (Citation),Level C 수석엔지니어 권고 대안,SDR 신청 필요 여부\n`;

    auditResults.forEach(r => {
      const cleanNote = r.noteRawText.replace(/"/g, '""');
      const cleanDrawingReq = r.drawingRequirement.replace(/"/g, '""');
      const cleanSpecStd = r.specStandardValue.replace(/"/g, '""');
      const cleanAdvice = r.levelCAdvice.summary.replace(/"/g, '""');
      const cleanCitation = `${r.citation.specCode} Pg.${r.citation.page} ${r.citation.sectionRef}`.replace(/"/g, '""');

      csvContent += `"${r.noteNumber}","${r.category}","${r.specCode}","${r.severity}","${cleanDrawingReq}","${cleanSpecStd}","${cleanCitation}","${cleanAdvice}","${r.levelCAdvice.sdrRecommendation.required ? '필수 (SDR 발송 권장)' : '불필요'}"\n`;
    });

    csvContent += `\n[결재 및 승인 정보]\n`;
    csvContent += `작성자,공정설계팀 엔지니어,(서명)\n`;
    csvContent += `검토자,Level C 수석 엔지니어,(서명)\n`;
    csvContent += `승인자,개발기술팀장 / 품질보증팀장,(서명)\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `HASI_Compliance_Report_${drawing.partNumber.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      {/* Top Action Toolbar */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <div>
            <h2 className="font-bold text-base text-slate-100">검토 보고서 생성 및 결재 문서 출력 (Excel / Export)</h2>
            <p className="text-xs text-slate-400">사내 결재 보고서 양식 즉시 다운로드 및 인쇄용 레이아웃</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>인쇄 / PDF 저장</span>
          </button>

          <button
            onClick={handleDownloadExcelCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>엑셀(Excel .csv) 보고서 다운로드</span>
          </button>
        </div>
      </div>

      {/* Printable Official Document Layout */}
      <div className="p-6 overflow-y-auto flex-1 bg-slate-950/60">
        <div className="max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8 space-y-6 text-xs shadow-2xl printable-area">
          
          {/* Document Header */}
          <div className="border-b-2 border-amber-500/80 pb-4 flex justify-between items-start flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-xl text-white tracking-tight">한화에어로스페이스</span>
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded">
                  공정기술팀 공식 서식
                </span>
              </div>
              <h1 className="text-lg font-bold text-amber-400">
                특수공정 규격 정합성 검토 및 Level C 엔지니어링 의견서
              </h1>
              <p className="text-slate-400 text-[11px] mt-0.5">
                문서번호: HASI-RPT-{Date.now().toString().slice(-6)} | 보안등급: 사내극비 (In-house Confidential)
              </p>
            </div>

            {/* Approval Sign-off Box */}
            <div className="border border-slate-700 rounded-lg overflow-hidden bg-slate-950 text-[10px] text-center">
              <div className="grid grid-cols-3 bg-slate-800 text-slate-300 font-bold border-b border-slate-700 divide-x divide-slate-700">
                <div className="px-3 py-1">작성자</div>
                <div className="px-3 py-1">검토자 (Level C)</div>
                <div className="px-3 py-1">승인자</div>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-700 h-12 items-center font-medium text-slate-300">
                <div className="p-1">김엔지니어<br/><span className="text-slate-500 text-[9px]">(서명완료)</span></div>
                <div className="p-1">박수석 (Level C)<br/><span className="text-emerald-400 text-[9px]">(AI 검토검증)</span></div>
                <div className="p-1">이팀장<br/><span className="text-slate-500 text-[9px]">(결재대기)</span></div>
              </div>
            </div>
          </div>

          {/* Part Drawing Info Table */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider">1. 대상 부품 및 도면 개요</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-slate-300 pt-1">
              <div>
                <span className="text-slate-500 block text-[10px]">부품 번호 (P/N)</span>
                <span className="font-bold text-white">{drawing.partNumber}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">부품명</span>
                <span className="font-semibold text-slate-200">{drawing.partName}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">적용 엔진/프로그램</span>
                <span className="font-medium text-amber-300">{drawing.engineModel}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">재질 / 소재 규격</span>
                <span className="font-mono text-slate-200">{drawing.material} ({drawing.materialSpec})</span>
              </div>
            </div>
          </div>

          {/* Compliance Audit Results Matrix Table */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                2. 특수공정 주기사항별 정합성 종합 분석
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="text-red-400 font-bold">충돌 {criticalCount}건</span>
                <span className="text-amber-400 font-bold">주의 {warningCount}건</span>
                <span className="text-emerald-400 font-bold">적합 {okCount}건</span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 font-semibold text-[10px]">
                  <tr>
                    <th className="p-2.5">Note #</th>
                    <th className="p-2.5">공정 분류</th>
                    <th className="p-2.5">참조 규격</th>
                    <th className="p-2.5">판정</th>
                    <th className="p-2.5">도면 요구 vs 규격서 표준</th>
                    <th className="p-2.5">Level C 엔지니어 권고 대안</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-[11px]">
                  {auditResults.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-bold text-slate-200 text-center">{r.noteNumber}</td>
                      <td className="p-2.5 font-semibold text-amber-300">{r.category}</td>
                      <td className="p-2.5 font-mono text-slate-300">{r.specCode}</td>
                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          r.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : r.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {r.severity}
                        </span>
                      </td>
                      <td className="p-2.5 max-w-[200px] font-mono text-[10px]">
                        <div className="text-amber-300">도면: {r.drawingRequirement}</div>
                        <div className="text-emerald-300">규격: {r.specStandardValue}</div>
                      </td>
                      <td className="p-2.5 text-slate-300 leading-relaxed font-sans text-[10px]">
                        {r.levelCAdvice.summary}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Deviation Request (SDR) Summary Box */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
              3. 설계공차 완화(SDR) 발송 및 기술 조치 계획
            </h3>
            <p className="text-slate-300 leading-relaxed">
              본 정합성 검토 결과, <strong className="text-red-400">P/N {drawing.partNumber}</strong>의 열처리 및 NDT 주기사항에 대해 규격서 기준 상충이 확인되었습니다.
              설계팀과의 협의를 거쳐 <strong className="text-amber-300">EMS 52401 Class 1 승격 및 NDT Sensitivity Level 4 상향 수정</strong>을 위한 SDR 발송을 권장합니다.
            </p>
          </div>

          {/* Footer Note */}
          <div className="text-center text-[10px] text-slate-500 pt-4 border-t border-slate-800">
            Hanwha Aero-Spec Insight (HASI) AI 자동 분석 시스템에 의해 인덱싱 및 정합성 검증이 완료된 검토 보고서입니다.
          </div>

        </div>
      </div>
    </div>
  );
};
