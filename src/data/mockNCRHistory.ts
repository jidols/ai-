import { HistoricalNCR } from '../types';

export const mockNCRHistory: HistoricalNCR[] = [
  {
    id: 'NCR-2025-089',
    partNumber: 'P/N 12098-02',
    partName: 'High Pressure Turbine Rotor Blade',
    material: 'Inconel 718',
    specCode: 'EMS 52401',
    discrepancySummary: 'Drawing Note requested final hardness HRC 38-42 under Class 2 heat treatment designation, whereas EMS 52401 Class 2 solution state standard caps hardness at HRC 30-35 max.',
    appliedSolution: 'SDR #2025-A14 approved by Design Chief. Reclassified drawing callout to EMS 52401 Class 1 for rotating critical blade application with double-aging cycle (720°C/620°C) to safely achieve HRC 38-40 target without microstructural embrittlement.',
    sdrNumber: 'SDR-2025-A14',
    approvalStatus: 'Approved',
    engineerName: '김민수 수석엔지니어 (Level C)',
    approvalDate: '2025-05-18'
  },
  {
    id: 'NCR-2024-142',
    partNumber: 'P/N 67812-01',
    partName: 'Combustor Outer Liner',
    material: 'Rene 41',
    specCode: 'HT-SPEC-001',
    discrepancySummary: 'Quench delay exceeded 15 seconds limit during vacuum furnace argon fan quenching due to door mechanism sensor lag, leading to local HRC 26 hardness drop.',
    appliedSolution: 'Engineering Review (Level C): Perform full re-solution treatment at 1065°C for 30 minutes in Class 2 vacuum furnace with verified 8-second rapid quench. Re-test hardness achieved HRC 30. Accepted.',
    sdrNumber: 'NCR-SOL-2024-09',
    approvalStatus: 'Approved',
    engineerName: '박준혁 책임엔지니어 (Level C)',
    approvalDate: '2024-11-04'
  },
  {
    id: 'NCR-2024-033',
    partNumber: 'P/N 98110-04',
    partName: 'Nozzle Vane Segment',
    material: 'Hastelloy X',
    specCode: 'Coat-SPEC-003',
    discrepancySummary: 'Top coat YSZ TBC thickness measured 0.46mm on lead edge, exceeding standard Coat-SPEC-003 0.35mm limit.',
    appliedSolution: 'Approved via SDR-2024-V03 conditioned on mandatory 100-cycle high-gradient thermal shock test. Component passed acoustic emission monitoring without micro-cracking.',
    sdrNumber: 'SDR-2024-V03',
    approvalStatus: 'Conditional',
    engineerName: '이성민 수석연구원 (Level C)',
    approvalDate: '2024-03-22'
  }
];
