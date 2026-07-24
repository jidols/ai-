import React, { useState } from 'react';
import { HistoricalNCR } from '../types';
import { History, Search, CheckCircle, Clock, ShieldCheck, UserCheck, Calendar, Filter } from 'lucide-react';

interface NCRHistoryModalProps {
  ncrHistory: HistoricalNCR[];
}

export const NCRHistoryModal: React.FC<NCRHistoryModalProps> = ({ ncrHistory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = ncrHistory.filter(n =>
    n.partNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.specCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.discrepancySummary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-base text-slate-100">과거 NCR 수리 검토 및 엔지니어링 선례 DB</h2>
            <p className="text-xs text-slate-400">숙련 엔지니어의 노하우 데이터화 및 과거 SDR 승인 사례 실시간 매칭</p>
          </div>
        </div>

        <div className="w-72 relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="부품번호(P/N), 규격 또는 키워드 검색..."
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* History List Cards */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        {filtered.map((item) => (
          <div key={item.id} className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3 shadow-md hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-400 text-sm">{item.id}</span>
                <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-xs font-semibold">
                  {item.partNumber}
                </span>
                <span className="text-xs text-slate-300 font-medium">{item.partName}</span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {item.sdrNumber && (
                  <span className="bg-purple-950 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded font-mono font-semibold">
                    {item.sdrNumber}
                  </span>
                )}
                <span className={`px-2.5 py-0.5 rounded font-bold text-[11px] ${
                  item.approvalStatus === 'Approved'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {item.approvalStatus === 'Approved' ? '승인 완료 (Approved)' : '조건부 승인 (Conditional)'}
                </span>
              </div>
            </div>

            {/* Content Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-red-400 font-bold block mb-1">🔴 불일치 및 NCR 발생 내역:</span>
                <p className="text-slate-300 leading-relaxed font-mono">{item.discrepancySummary}</p>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 space-y-1">
                <span className="text-emerald-400 font-bold block mb-1">🟢 적용된 Level C 엔지니어링 대안:</span>
                <p className="text-slate-200 leading-relaxed font-mono">{item.appliedSolution}</p>
              </div>
            </div>

            {/* Footer Metadata */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>검토 엔지니어: <strong className="text-slate-300">{item.engineerName}</strong></span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>승인일자: {item.approvalDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
