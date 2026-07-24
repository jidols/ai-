/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Drawing, SpecDocument, ComplianceResult, SecurityMode } from './types';
import { mockDrawings } from './data/mockDrawings';
import { mockSpecs } from './data/mockSpecs';
import { mockNCRHistory } from './data/mockNCRHistory';
import { runComplianceAudit } from './services/complianceEngine';

import { Navbar } from './components/Navbar';
import { DrawingViewer } from './components/DrawingViewer';
import { ComplianceAdvisorPanel } from './components/ComplianceAdvisorPanel';
import { SpecLibraryModal } from './components/SpecLibraryModal';
import { NCRHistoryModal } from './components/NCRHistoryModal';
import { ReportExportModal } from './components/ReportExportModal';
import { SdrDraftModal } from './components/SdrDraftModal';
import { NewAnalysisModal } from './components/NewAnalysisModal';

export default function App() {
  const [drawings, setDrawings] = useState<Drawing[]>(mockDrawings);
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing>(mockDrawings[0]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(mockDrawings[0].notes[0]?.id || null);

  const [customSpecs, setCustomSpecs] = useState<SpecDocument[]>([]);
  const [securityMode, setSecurityMode] = useState<SecurityMode>('AIRGAP_ONPREM');
  const [activeTab, setActiveTab] = useState<'advisor' | 'library' | 'history' | 'report'>('advisor');

  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Modals state
  const [activeSdrResult, setActiveSdrResult] = useState<ComplianceResult | null>(null);
  const [showNewAnalysisModal, setShowNewAnalysisModal] = useState<boolean>(false);

  // Check server health and API key on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        if (data && data.hasGeminiApiKey) {
          setHasGeminiKey(true);
        }
      })
      .catch(err => {
        console.warn('Backend health check note:', err);
      });
  }, []);

  // Update selected note when drawing changes
  useEffect(() => {
    if (selectedDrawing && selectedDrawing.notes.length > 0) {
      setSelectedNoteId(selectedDrawing.notes[0].id);
    }
  }, [selectedDrawing]);

  // Compute compliance audit results for selected drawing
  const auditResults: ComplianceResult[] = useMemo(() => {
    return runComplianceAudit(selectedDrawing, customSpecs);
  }, [selectedDrawing, customSpecs]);

  const criticalCount = auditResults.filter(r => r.severity === 'CRITICAL').length;
  const warningCount = auditResults.filter(r => r.severity === 'WARNING').length;
  const okCount = auditResults.filter(r => r.severity === 'OK').length;

  // Add new uploaded spec
  const handleUploadNewSpec = (newSpec: SpecDocument) => {
    setCustomSpecs(prev => [newSpec, ...prev]);
  };

  // Add new custom drawing
  const handleAddDrawing = (newDwg: Drawing) => {
    setDrawings(prev => [newDwg, ...prev]);
    setSelectedDrawing(newDwg);
    setSelectedNoteId(newDwg.notes[0]?.id || null);
  };

  // Run deep Gemini API analysis on server
  const handleRunDeepGeminiAnalysis = async (noteId: string) => {
    const res = auditResults.find(r => r.noteId === noteId);
    if (!res) return;

    setIsAnalyzing(true);
    try {
      const response = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          drawingNotes: res.noteRawText,
          specCode: res.specCode,
          specTitle: res.citation.specTitle,
          partName: selectedDrawing.partName,
          material: selectedDrawing.material
        })
      });

      const json = await response.json();
      if (json.success && json.data) {
        // Enhance level C advice with server Gemini output
        const aiData = json.data;
        res.discrepancyTitle = aiData.discrepancyTitle || res.discrepancyTitle;
        res.levelCAdvice.summary = aiData.levelCAdvice?.summary || res.levelCAdvice.summary;
        res.levelCAdvice.riskAssessment = aiData.levelCAdvice?.riskAssessment || res.levelCAdvice.riskAssessment;
        if (aiData.levelCAdvice?.sdrRecommendation) {
          res.levelCAdvice.sdrRecommendation = aiData.levelCAdvice.sdrRecommendation;
        }
      }
    } catch (err) {
      console.error('Deep AI analysis failed, maintaining local RAG output:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Application Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        securityMode={securityMode}
        setSecurityMode={setSecurityMode}
        hasGeminiKey={hasGeminiKey}
        openNewAnalysisModal={() => setShowNewAnalysisModal(true)}
        criticalCount={criticalCount}
        warningCount={warningCount}
        okCount={okCount}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 p-3 sm:p-4 md:p-6 max-w-[1600px] mx-auto w-full flex flex-col">
        {activeTab === 'advisor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-stretch">
            {/* Left 5 Cols: Input Analyzer & Blueprint Viewer */}
            <div className="lg:col-span-5 h-[calc(100vh-120px)]">
              <DrawingViewer
                drawings={drawings}
                selectedDrawing={selectedDrawing}
                onSelectDrawing={setSelectedDrawing}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                openNewAnalysisModal={() => setShowNewAnalysisModal(true)}
              />
            </div>

            {/* Right 7 Cols: Reasoning & Compliance Advisor Panel */}
            <div className="lg:col-span-7 h-[calc(100vh-120px)]">
              <ComplianceAdvisorPanel
                auditResults={auditResults}
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                securityMode={securityMode}
                onRunDeepGeminiAnalysis={handleRunDeepGeminiAnalysis}
                isAnalyzing={isAnalyzing}
                openSdrDraftModal={(r) => setActiveSdrResult(r)}
              />
            </div>
          </div>
        )}

        {activeTab === 'library' && (
          <SpecLibraryModal
            specs={[...mockSpecs, ...customSpecs]}
            onUploadNewSpec={handleUploadNewSpec}
          />
        )}

        {activeTab === 'history' && (
          <NCRHistoryModal ncrHistory={mockNCRHistory} />
        )}

        {activeTab === 'report' && (
          <ReportExportModal
            drawing={selectedDrawing}
            auditResults={auditResults}
            securityMode={securityMode}
          />
        )}
      </main>

      {/* Modals */}
      {activeSdrResult && (
        <SdrDraftModal
          drawing={selectedDrawing}
          result={activeSdrResult}
          onClose={() => setActiveSdrResult(null)}
        />
      )}

      {showNewAnalysisModal && (
        <NewAnalysisModal
          onAddDrawing={handleAddDrawing}
          onClose={() => setShowNewAnalysisModal(false)}
        />
      )}
    </div>
  );
}
