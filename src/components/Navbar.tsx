import React from 'react';
import { Shield, ShieldAlert, Cpu, Sparkles, BookOpen, History, FileSpreadsheet, PlusCircle, CheckCircle2 } from 'lucide-react';
import { SecurityMode } from '../types';

interface NavbarProps {
  activeTab: 'advisor' | 'library' | 'history' | 'report';
  setActiveTab: (tab: 'advisor' | 'library' | 'history' | 'report') => void;
  securityMode: SecurityMode;
  setSecurityMode: (mode: SecurityMode) => void;
  hasGeminiKey: boolean;
  openNewAnalysisModal: () => void;
  criticalCount: number;
  warningCount: number;
  okCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  securityMode,
  setSecurityMode,
  hasGeminiKey,
  openNewAnalysisModal,
  criticalCount,
  warningCount,
  okCount
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-600 to-red-700 flex items-center justify-center text-white font-bold text-xl shadow-md border border-amber-400/30">
              H
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-slate-100">
                  HASI <span className="text-amber-400 font-medium text-xs px-2 py-0.5 rounded bg-amber-950/80 border border-amber-500/30">v2.4 Pro</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                지능형 특수공정 컴플라이언스 어드바이저 | Hanwha Aero-Spec Insight
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setActiveTab('advisor')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'advisor'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Side-by-Side 검토
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'library'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              특수공정 규격 DB (RAG)
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              과거 NCR/검토 이력
            </button>

            <button
              onClick={() => setActiveTab('report')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'report'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              보고서 생성 / Excel
            </button>
          </nav>

          {/* Right Status Badges & Security Toggle */}
          <div className="flex items-center gap-3">
            {/* Compliance Quick Counter */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="flex items-center gap-1 text-red-400 font-semibold px-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                충돌 {criticalCount}
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-semibold px-1">주의 {warningCount}</span>
              <span className="text-slate-600">|</span>
              <span className="text-emerald-400 font-semibold px-1">적합 {okCount}</span>
            </div>

            {/* Security Mode Toggle Button */}
            <button
              onClick={() => {
                setSecurityMode(
                  securityMode === 'AIRGAP_ONPREM' ? 'GEMINI_HYBRID' : 'AIRGAP_ONPREM'
                );
              }}
              className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                securityMode === 'AIRGAP_ONPREM'
                  ? 'bg-slate-800/90 text-emerald-300 border-emerald-500/40 hover:bg-slate-800'
                  : 'bg-indigo-950/80 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900/80'
              }`}
              title="보안 모드 전환 (사내 온프레미스 에어갭 vs 하이브리드 AI)"
            >
              {securityMode === 'AIRGAP_ONPREM' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">에어갭 (On-Prem Llama-3)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="hidden sm:inline">Gemini 3.6 Hybrid</span>
                </>
              )}
            </button>

            {/* New Analysis Button */}
            <button
              onClick={openNewAnalysisModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>신규 도면 분석</span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};
