import { Drawing } from '../types';

export const mockDrawings: Drawing[] = [
  {
    id: 'dwg-blade-12345',
    partNumber: 'P/N 12345-01',
    partName: 'High-Pressure Turbine Rotor Blade (고압터빈 로터 블레이드)',
    engineModel: 'GT-25000 Industrial Gas Turbine',
    material: 'Inconel 718 Superalloy',
    materialSpec: 'AMS 5662 / EMS 52401',
    revision: 'Rev C',
    diagramType: 'blade',
    notes: [
      {
        id: 'note-1',
        noteNumber: 1,
        rawText: 'HEAT TREAT PER EMS 52401 CLASS 2. SOLUTION ANNEAL AT 980°C ±10°C FOR 1 HOUR. AGE HARDEN AT 720°C FOR 8 HOURS, FURNACE COOL TO 620°C, HOLD FOR 8 HOURS. FINAL HARDNESS MUST BE HRC 38 - 42.',
        category: 'HEAT_TREATMENT',
        specCode: 'EMS 52401',
        parameterName: 'Hardness & Processing Class',
        requiredValue: 'HRC 38 - 42',
        unit: 'HRC',
        boundingBox: { x: 10, y: 15, width: 80, height: 18 }
      },
      {
        id: 'note-2',
        noteNumber: 2,
        rawText: 'FLUORESCENT PENETRANT INSPECTION (FPI) PER NDT-SPEC-004 TYPE 1 METHOD A SENSITIVITY LEVEL 2. 100% SURFACE CRITICAL AREA INSPECTION.',
        category: 'NDT',
        specCode: 'NDT-SPEC-004',
        parameterName: 'Penetrant Sensitivity Level',
        requiredValue: 'Sensitivity Level 2',
        boundingBox: { x: 10, y: 38, width: 80, height: 16 }
      },
      {
        id: 'note-3',
        noteNumber: 3,
        rawText: 'APPLY THERMAL SPRAY TBC COATING ON AIRFOIL SURFACE PER Coat-SPEC-003. TOP COAT CERAMIC THICKNESS 0.25mm - 0.35mm. BOND COAT 0.10mm.',
        category: 'COATING',
        specCode: 'Coat-SPEC-003',
        parameterName: 'Coating Thickness',
        requiredValue: '0.25mm - 0.35mm',
        unit: 'mm',
        boundingBox: { x: 10, y: 58, width: 80, height: 16 }
      }
    ]
  },
  {
    id: 'dwg-liner-67890',
    partNumber: 'P/N 67890-03',
    partName: 'Combustor Chamber Inner Liner (연소기 내통 라이너)',
    engineModel: 'KFX Aero-Engine Demonstrator',
    material: 'Rene 41 High-Temp Sheet Alloy',
    materialSpec: 'AMS 5545 / HT-SPEC-001',
    revision: 'Rev B',
    diagramType: 'liner',
    notes: [
      {
        id: 'note-67890-1',
        noteNumber: 1,
        rawText: 'VACUUM SOLUTION HEAT TREAT PER HT-SPEC-001 AT 1065°C ±10°C FOR 35 MIN. INERT GAS FORCE QUENCH. REQUIRED HARDNESS HRC 28 - 32.',
        category: 'HEAT_TREATMENT',
        specCode: 'HT-SPEC-001',
        parameterName: 'Solution Temp & Hardness',
        requiredValue: 'HRC 28 - 32',
        unit: 'HRC',
        boundingBox: { x: 12, y: 18, width: 76, height: 20 }
      },
      {
        id: 'note-67890-2',
        noteNumber: 2,
        rawText: 'ELECTRON BEAM WELD PER EMS 31002. 100% POST-WELD STRESS RELIEF AT 980°C FOR 1 HOUR PRIOR TO FINAL DIMENSIONAL ACCEPTANCE.',
        category: 'WELDING',
        specCode: 'EMS 31002',
        parameterName: 'Post-Weld Heat Treat',
        requiredValue: '980°C for 1 Hour',
        boundingBox: { x: 12, y: 42, width: 76, height: 18 }
      }
    ]
  },
  {
    id: 'dwg-vane-98765',
    partNumber: 'P/N 98765-04',
    partName: '1st Stage Nozzle Vane Ring Segment (1단 노즐 베인 링)',
    engineModel: 'F414 Turbofan Engine',
    material: 'Hastelloy X Cobalt-Nickel Superalloy',
    materialSpec: 'AMS 5754 / Coat-SPEC-003',
    revision: 'Rev D',
    diagramType: 'vane',
    notes: [
      {
        id: 'note-98765-1',
        noteNumber: 1,
        rawText: 'ANNEAL PER EMS 52401 AT 1175°C ±15°C FOR 45 MIN, WATER QUENCH. HARDNESS HRB 85 - 95.',
        category: 'HEAT_TREATMENT',
        specCode: 'EMS 52401',
        parameterName: 'Anneal Temperature & Hardness',
        requiredValue: 'HRB 85 - 95',
        unit: 'HRB',
        boundingBox: { x: 15, y: 20, width: 70, height: 20 }
      },
      {
        id: 'note-98765-2',
        noteNumber: 2,
        rawText: 'PLASMA SPRAY TBC CERAMIC TOP COAT PER Coat-SPEC-003. REQUIRED THICKNESS 0.42mm - 0.48mm FOR THERMAL INSULATION.',
        category: 'COATING',
        specCode: 'Coat-SPEC-003',
        parameterName: 'Top Coat Thickness',
        requiredValue: '0.42mm - 0.48mm',
        unit: 'mm',
        boundingBox: { x: 15, y: 45, width: 70, height: 20 }
      }
    ]
  }
];
