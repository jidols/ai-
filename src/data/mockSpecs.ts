import { SpecDocument } from '../types';

export const mockSpecs: SpecDocument[] = [
  {
    id: 'spec-ems-52401',
    specCode: 'EMS 52401',
    title: 'Nickel & Cobalt Base Alloy Heat Treatment Specification',
    category: 'HEAT_TREATMENT',
    revision: 'Rev. H',
    effectiveDate: '2024-03-15',
    description: 'General heat treatment requirements for Inconel 718, Rene 41, Hastelloy X, and Waspaloy aerospace turbine components.',
    pageCount: 14,
    sections: [
      {
        sectionNum: '3.1',
        title: 'Furnace Vacuum & Atmosphere Control',
        content: 'Vacuum furnaces shall operate at a pressure not exceeding 10^-4 Torr for high-temperature solution anneal. Inert argon backfill purity shall be 99.999% minimum.',
        page: 3
      },
      {
        sectionNum: '4.2',
        title: 'Solution Heat Treatment & Quench Delay',
        content: 'Inconel 718 solution treatment shall be performed at 980°C ±10°C (1800°F ±18°F) for 1 hour. Maximum quench delay from furnace door open to liquid/gas quench start shall not exceed 15 seconds.',
        page: 6
      },
      {
        sectionNum: '5.1',
        title: 'Hardness Acceptance Criteria for Class 2 Processing',
        content: 'Class 2 processing applies to non-rotating turbine hardware and intermediate solution state. Hardness after solution anneal prior to aging shall be HRC 30 - 35 max. Final double-aged hardness requirement is HRC 34 - 40.',
        page: 9
      }
    ],
    tables: [
      {
        tableNum: 'Table 1',
        title: 'Inconel 718 Heat Treatment Cycles & Hardness Limits',
        page: 9,
        headers: ['Process Class', 'Solution Temp (°C)', 'Holding Time', 'Aged State', 'Hardness Limit (HRC)'],
        rows: [
          ['Class 1 (Rotating)', '980°C ±10°C', '1 Hr', 'Double Aged (720°C/620°C)', 'HRC 36 - 40'],
          ['Class 2 (Non-Rotating)', '980°C ±10°C', '1 Hr', 'Solution Annealed', 'HRC 30 - 35 Max'],
          ['Class 2 (Final Aged)', '980°C + 720°C', '1 Hr + 8 Hr', 'Double Aged', 'HRC 34 - 40'],
          ['Class 3 (Cast Alloy)', '1080°C ±10°C', '2 Hr', 'Homogenized', 'HRC 32 - 38']
        ]
      },
      {
        tableNum: 'Table 2',
        title: 'Cooling Rates and Atmosphere Requirements',
        page: 11,
        headers: ['Material Class', 'Furnace Type', 'Min Cooling Rate', 'Atmosphere'],
        rows: [
          ['Inconel 718', 'Vacuum', '25°C/min to 540°C', 'Argon Gas Fan Quench'],
          ['Rene 41', 'Vacuum', '50°C/min to 400°C', 'Inert Gas Force Quench'],
          ['Hastelloy X', 'Atmospheric', 'Rapid Air Cool / Water', 'Reducing / Vacuum']
        ]
      }
    ]
  },
  {
    id: 'spec-ndt-004',
    specCode: 'NDT-SPEC-004',
    title: 'Fluorescent Dye Penetrant Inspection (FPI) Standard',
    category: 'NDT',
    revision: 'Rev. E',
    effectiveDate: '2023-11-01',
    description: 'Fluorescent Penetrant Inspection criteria for critical gas turbine engine components, including rotating blades, discs, and combustor weldments.',
    pageCount: 18,
    sections: [
      {
        sectionNum: '2.4',
        title: 'Sensitivity Level Classification',
        content: 'Penetrant materials are classified by sensitivity: Level 1 (Low), Level 2 (Medium), Level 3 (High), and Level 4 (Ultra-High). Level 4 sensitivity is mandatory for critical rotating aero-engine hardware (Turbine Blades, Discs, Shafts).',
        page: 4
      },
      {
        sectionNum: '4.1',
        title: 'Critical Rotating Part Mandate',
        content: 'All Grade 1 rotating turbine airfoils and high-stress rotor blades shall undergo FPI per Type 1, Method A or D, Level 4 sensitivity. Level 2 sensitivity is strictly prohibited for Grade 1 rotating blades due to tight fatigue micro-crack detection limits (0.3mm min depth).',
        page: 8
      }
    ],
    tables: [
      {
        tableNum: 'Table 1',
        title: 'Penetrant Sensitivity Level Requirements by Part Grade',
        page: 8,
        headers: ['Part Grade', 'Component Application', 'Method', 'Required Sensitivity Level'],
        rows: [
          ['Grade 1 (Critical Rotating)', 'Turbine Blades, Compressor Discs', 'Type 1 Method A/D', 'Sensitivity Level 4 (Ultra-High)'],
          ['Grade 2 (Non-Rotating Hot)', 'Vane Rings, Combustor Liners', 'Type 1 Method A', 'Sensitivity Level 3 (High)'],
          ['Grade 3 (Structural Static)', 'Engine Casings, Brackets', 'Type 1 Method A/B', 'Sensitivity Level 2 (Medium)']
        ]
      }
    ]
  },
  {
    id: 'spec-coat-003',
    specCode: 'Coat-SPEC-003',
    title: 'Plasma Thermal Spray Thermal Barrier Coating (TBC)',
    category: 'COATING',
    revision: 'Rev. C',
    effectiveDate: '2024-01-20',
    description: 'Standard for Yttria-Stabilized Zirconia (YSZ) thermal barrier coatings on turbine airfoils and combustor liners.',
    pageCount: 12,
    sections: [
      {
        sectionNum: '3.2',
        title: 'Coating Thickness & Bond Coat Criteria',
        content: 'Standard YSZ ceramic top coat thickness shall be 0.15mm to 0.35mm. Thicknesses exceeding 0.35mm require explicit thermal spallation qualification testing and engineering review due to spallation risk under high thermal cycle gradients.',
        page: 5
      }
    ],
    tables: [
      {
        tableNum: 'Table 2',
        title: 'TBC Layer Specifications',
        page: 6,
        headers: ['Layer Type', 'Material Composition', 'Nominal Thickness', 'Max Allowed Limit'],
        rows: [
          ['Bond Coat (MCrAlY)', 'NiCoCrAlY Plasma Spray', '0.08mm - 0.12mm', '0.15mm'],
          ['Top Coat (Ceramic YSZ)', '7-8% Y2O3 ZrO2', '0.15mm - 0.30mm', '0.35mm Max'],
          ['Heavy Duty Barrier', 'Multi-layer YSZ', '0.30mm - 0.45mm', '0.50mm (Requires SDR & Thermal Qualification)']
        ]
      }
    ]
  },
  {
    id: 'spec-ht-001',
    specCode: 'HT-SPEC-001',
    title: 'Vacuum Hardening and Annealing of Heat-Resistant Sheet Alloys',
    category: 'HEAT_TREATMENT',
    revision: 'Rev. F',
    effectiveDate: '2023-08-10',
    description: 'Vacuum heat treatment procedures for Rene 41, Hastelloy X, and Haynes 230 combustor sheet metal fabrications.',
    pageCount: 10,
    sections: [
      {
        sectionNum: '4.1',
        title: 'Rene 41 Vacuum Solution Treatment',
        content: 'Rene 41 sheet assemblies shall be vacuum solution treated at 1065°C ±10°C (1950°F ±18°F) for 30 to 45 minutes followed by inert gas force quench to below 425°C within 3 minutes.',
        page: 4
      }
    ],
    tables: [
      {
        tableNum: 'Table 1',
        title: 'Sheet Metal Alloy Heat Treat Parameters',
        page: 5,
        headers: ['Alloy', 'Solution Temp', 'Soak Time', 'Quench Method', 'Target Hardness'],
        rows: [
          ['Rene 41', '1065°C ±10°C', '30-45 Min', 'Gas Force Quench', 'HRC 28 - 32'],
          ['Hastelloy X', '1175°C ±15°C', '45 Min', 'Water / Rapid Gas', 'HRB 85 - 95'],
          ['Haynes 230', '1200°C ±10°C', '30 Min', 'Gas Quench', 'HRB 88 - 98']
        ]
      }
    ]
  },
  {
    id: 'spec-ems-31002',
    specCode: 'EMS 31002',
    title: 'Electron Beam Welding Specification for High Temperature Alloys',
    category: 'WELDING',
    revision: 'Rev. D',
    effectiveDate: '2022-09-15',
    description: 'Precision electron beam welding requirements for nickel-base superalloy components.',
    pageCount: 16,
    sections: [
      {
        sectionNum: '3.5',
        title: 'Post-Weld Stress Relief',
        content: 'All electron beam welded Inconel 718 and Rene 41 structures require immediate post-weld stress relief within 24 hours of welding to prevent strain-age cracking.',
        page: 7
      }
    ],
    tables: [
      {
        tableNum: 'Table 3',
        title: 'Post-Weld Heat Treatment Matrix',
        page: 8,
        headers: ['Base Material', 'Pre-Weld Condition', 'Post-Weld Temp', 'Soak Duration'],
        rows: [
          ['Inconel 718', 'Solution Annealed', '980°C ±10°C', '1 Hour'],
          ['Rene 41', 'Annealed', '1065°C ±10°C', '45 Minutes']
        ]
      }
    ]
  }
];
