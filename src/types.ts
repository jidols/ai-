/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Severity = 'OK' | 'WARNING' | 'CRITICAL';

export type SpecCategory = 'HEAT_TREATMENT' | 'COATING' | 'NDT' | 'WELDING' | 'SURFACE_FINISHING';

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DrawingNote {
  id: string;
  noteNumber: number;
  rawText: string;
  category: SpecCategory;
  specCode: string; // e.g., "EMS 52401", "NDT-SPEC-004", "Coat-SPEC-003"
  parameterName: string; // e.g., "Hardness", "Soak Temperature", "Penetrant Sensitivity"
  requiredValue: string; // e.g., "HRC 38-42", "Level 2"
  unit?: string;
  boundingBox?: BoundingBox;
}

export interface Drawing {
  id: string;
  partNumber: string;
  partName: string;
  engineModel: string; // e.g., "GT-25000", "F414-GE-400", "KFX-Engine"
  material: string; // e.g., "Inconel 718", "Rene 41", "Ti-6Al-4V"
  materialSpec: string;
  revision: string;
  notes: DrawingNote[];
  blueprintUrl?: string;
  diagramType: 'blade' | 'liner' | 'disc' | 'vane';
}

export interface SpecTableData {
  title: string;
  headers: string[];
  rows: (string | number)[][];
}

export interface SpecDocument {
  id: string;
  specCode: string; // e.g. "EMS 52401"
  title: string;
  category: SpecCategory;
  revision: string;
  effectiveDate: string;
  description: string;
  pageCount: number;
  sections: {
    sectionNum: string; // e.g., "4.2.1"
    title: string;
    content: string;
    page: number;
  }[];
  tables: {
    tableNum: string; // e.g., "Table 3"
    title: string;
    page: number;
    headers: string[];
    rows: string[][];
  }[];
}

export interface LevelCEngineeringAdvice {
  summary: string;
  riskAssessment: string;
  sdrRecommendation: {
    required: boolean;
    title: string;
    justification: string;
    proposedTolerance: string;
  };
  processAdjustment: {
    parameter: string;
    recommendedAction: string;
    engineeringReason: string;
  };
  historicalPrecedentMatchId?: string;
}

export interface SpecCitation {
  specCode: string;
  specTitle: string;
  page: number;
  sectionRef: string;
  tableRef?: string;
  matchedRowText: string;
  exactStandardRequirement: string;
}

export interface ComplianceResult {
  id: string;
  drawingId: string;
  noteId: string;
  noteNumber: number;
  noteRawText: string;
  category: SpecCategory;
  specCode: string;
  severity: Severity;
  discrepancyTitle: string;
  drawingRequirement: string;
  specStandardValue: string;
  citation: SpecCitation;
  levelCAdvice: LevelCEngineeringAdvice;
}

export interface HistoricalNCR {
  id: string;
  partNumber: string;
  partName: string;
  material: string;
  specCode: string;
  discrepancySummary: string;
  appliedSolution: string;
  sdrNumber?: string;
  approvalStatus: 'Approved' | 'Conditional' | 'Rejected';
  engineerName: string;
  approvalDate: string;
}

export type SecurityMode = 'AIRGAP_ONPREM' | 'GEMINI_HYBRID';
