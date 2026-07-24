import React, { useState } from 'react';
import { SpecDocument, SpecCategory } from '../types';
import { BookOpen, Search, Filter, FileText, Table, Plus, Upload, CheckCircle2, ChevronRight, X } from 'lucide-react';

interface SpecLibraryModalProps {
  specs: SpecDocument[];
  onUploadNewSpec: (newSpec: SpecDocument) => void;
}

export const SpecLibraryModal: React.FC<SpecLibraryModalProps> = ({ specs, onUploadNewSpec }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeSpec, setActiveSpec] = useState<SpecDocument>(specs[0]);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // New spec form state
  const [newSpecCode, setNewSpecCode] = useState<string>('');
  const [newSpecTitle, setNewSpecTitle] = useState<string>('');
  const [newCategory, setNewCategory] = useState<SpecCategory>('HEAT_TREATMENT');
  const [newContent, setNewContent] = useState<string>('');

  const filteredSpecs = specs.filter(s => {
    const matchesSearch = s.specCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSpec = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecCode || !newSpecTitle) return;

    const created: SpecDocument = {
      id: `spec-custom-${Date.now()}`,
      specCode: newSpecCode,
      title: newSpecTitle,
      category: newCategory,
      revision: 'Rev. A',
      effectiveDate: new Date().toISOString().split('T')[0],
      description: newContent || '사용자 등록 특수공정 규격서',
      pageCount: 5,
      sections: [
        {
          sectionNum: '1.0',
          title: '범위 및 적용 조건',
          content: newContent || '특수공정 품질 관리 지침 준수.',
          page: 1
        }
      ],
      tables: [
        {
          tableNum: 'Table 1',
          title: '공정 표준 요구치',
          page: 2,
          headers: ['파라미터', '표준 범위', '허용 오차'],
          rows: [
            ['유지 온도', '1000°C', '±10°C'],
            ['경도 범위', 'HRC 32 - 38', '최대 40']
          ]
        }
      ]
    };

    onUploadNewSpec(created);
    setActiveSpec(created);
    setShowUploadModal(false);
    setNewSpecCode('');
    setNewSpecTitle('');
    setNewContent('');
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col h-[calc(100vh-120px)]">
      {/* Top Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="font-bold text-base text-slate-100">특수공정 규격서 RAG 인덱싱 DB</h2>
            <p className="text-xs text-slate-400">구조화된 표/그림/조항 인덱스 및 시각적 맥락 하이라이팅</p>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>신규 규격서 PDF 등록</span>
        </button>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-hidden">
        {/* Left Specification List (35%) */}
        <div className="md:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/60 overflow-hidden">
          {/* Search & Filter */}
          <div className="p-3 border-b border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="규격 ID (AMS/EMS) 또는 키워드 검색..."
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto text-[10px]">
              {['ALL', 'HEAT_TREATMENT', 'COATING', 'NDT', 'WELDING'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? '전체' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Specs Scrollable List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredSpecs.map((spec) => {
              const isSelected = activeSpec?.id === spec.id;
              return (
                <div
                  key={spec.id}
                  onClick={() => setActiveSpec(spec)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-amber-300">{spec.specCode}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{spec.revision}</span>
                  </div>
                  <h4 className="font-medium text-slate-200 text-xs line-clamp-1 mb-1">{spec.title}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{spec.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Active Spec Viewer (65%) */}
        {activeSpec ? (
          <div className="md:col-span-8 flex flex-col p-4 overflow-y-auto space-y-4 bg-slate-900">
            {/* Spec Header Details */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex justify-between items-start flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-extrabold text-amber-400">{activeSpec.specCode}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">
                    {activeSpec.revision}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                    {activeSpec.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{activeSpec.title}</h3>
                <p className="text-xs text-slate-400 mt-1">{activeSpec.description}</p>
              </div>

              <div className="text-right text-xs text-slate-400">
                <span>시행일: {activeSpec.effectiveDate}</span>
                <span className="block font-mono text-slate-500">총 {activeSpec.pageCount} 페이지</span>
              </div>
            </div>

            {/* Spec Sections (Text Indexing) */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <FileText className="w-4 h-4 text-sky-400" />
                <span>주요 조항 및 구문 인덱스 (Sections)</span>
              </h3>

              {activeSpec.sections.map((sec, idx) => (
                <div key={idx} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                    <span>Section {sec.sectionNum}: {sec.title}</span>
                    <span className="text-amber-400 text-[10px] font-mono">PAGE {sec.page}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono bg-slate-900/80 p-2 rounded border border-slate-800">
                    "{sec.content}"
                  </p>
                </div>
              ))}
            </div>

            {/* Extracted Structured Tables */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-xs text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                <Table className="w-4 h-4 text-emerald-400" />
                <span>구조화 데이터 추출 테이블 (Structured Table Index)</span>
              </h3>

              {activeSpec.tables.map((tbl, idx) => (
                <div key={idx} className="bg-slate-950/80 rounded-lg border border-slate-800 overflow-hidden">
                  <div className="p-2.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-bold text-amber-300">{tbl.tableNum}: {tbl.title}</span>
                    <span className="text-slate-400 text-[10px]">PAGE {tbl.page}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-semibold text-[11px]">
                        <tr>
                          {tbl.headers.map((h, i) => (
                            <th key={i} className="p-2">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-200 font-mono text-[11px]">
                        {tbl.rows.map((r, ri) => (
                          <tr key={ri} className="hover:bg-slate-800/50 transition-colors">
                            {r.map((cell, ci) => (
                              <td key={ci} className="p-2">{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="md:col-span-8 flex items-center justify-center text-slate-500">
            규격서를 선택하십시오.
          </div>
        )}
      </div>

      {/* Upload New Spec Modal Drawer */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 space-y-4 text-xs shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm text-slate-100">신규 특수공정 규격서 PDF 업로드</h3>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSpec} className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">규격 코드 (Spec Code)</label>
                <input
                  type="text"
                  required
                  placeholder="예: AMS 2759/3 또는 EMS 88102"
                  value={newSpecCode}
                  onChange={(e) => setNewSpecCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">규격서 제목 (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="예: Heat Treatment of Titanium and Titanium Alloys"
                  value={newSpecTitle}
                  onChange={(e) => setNewSpecTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">공정 분류 (Category)</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SpecCategory)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="HEAT_TREATMENT">열처리 (HEAT TREATMENT)</option>
                  <option value="COATING">코팅 (COATING / TBC)</option>
                  <option value="NDT">비파괴검사 (NDT / FPI / UT)</option>
                  <option value="WELDING">용접 및 접합 (WELDING)</option>
                  <option value="SURFACE_FINISHING">표면가공 (SURFACE FINISHING)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">핵심 규격 조항 및 파라미터 내용 (AI Auto Parsing)</label>
                <textarea
                  rows={4}
                  placeholder="규격서 주요 내용 또는 PDF 텍스트를 붙여넣으십시오..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg p-2 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg shadow"
                >
                  RAG DB 등록 및 분석
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
