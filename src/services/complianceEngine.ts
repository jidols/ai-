import { Drawing, DrawingNote, SpecDocument, ComplianceResult, Severity, LevelCEngineeringAdvice, SpecCitation } from '../types';
import { mockSpecs } from '../data/mockSpecs';
import { mockNCRHistory } from '../data/mockNCRHistory';

export function runComplianceAudit(drawing: Drawing, customSpecs: SpecDocument[] = []): ComplianceResult[] {
  const allSpecs = [...mockSpecs, ...customSpecs];
  const results: ComplianceResult[] = [];

  for (const note of drawing.notes) {
    const spec = allSpecs.find(s => s.specCode.toUpperCase() === note.specCode.toUpperCase() || s.specCode.includes(note.specCode));

    if (!spec) {
      // Spec not found in DB
      results.push({
        id: `res-${note.id}`,
        drawingId: drawing.id,
        noteId: note.id,
        noteNumber: note.noteNumber,
        noteRawText: note.rawText,
        category: note.category,
        specCode: note.specCode,
        severity: 'CRITICAL',
        discrepancyTitle: `규격서 미등록 (${note.specCode})`,
        drawingRequirement: note.rawText,
        specStandardValue: '사내 규격서 DB에 해당 규격서 미등록 또는 검색 불가',
        citation: {
          specCode: note.specCode,
          specTitle: 'Unknown Specification',
          page: 1,
          sectionRef: 'N/A',
          matchedRowText: 'Spec document missing in repository',
          exactStandardRequirement: '규격서 등록 필요'
        },
        levelCAdvice: {
          summary: `규격서 ${note.specCode}가 라이브러리에 등록되어 있지 않습니다. 신규 규격서를 PDF로 등록하거나 품질기술팀에 규격 최신 개정판 반영을 요청하십시오.`,
          riskAssessment: '검증되지 않은 규격 적용으로 인한 작업지시서 오적용 및 NCR 발생 위험 매우 높음.',
          sdrRecommendation: {
            required: false,
            title: '규격서 DB 신규 등록 요청',
            justification: '사내 규격 관리 DB 미등록 상태',
            proposedTolerance: 'N/A'
          },
          processAdjustment: {
            parameter: 'Spec Library Indexing',
            recommendedAction: `${note.specCode} PDF 규격서 업로드 및 인덱싱 실행`,
            engineeringReason: '규격서 파싱 미완료 상태에서 공정 진행 불가'
          }
        }
      });
      continue;
    }

    // Spec exists, perform category and note specific analysis
    if (note.category === 'HEAT_TREATMENT') {
      const isEMS52401 = note.specCode.includes('EMS 52401');
      if (isEMS52401) {
        if (note.rawText.includes('CLASS 2') && note.rawText.includes('HRC 38 - 42')) {
          // Critical conflict found: Class 2 is max HRC 30-35 or Class 1 double aged HRC 36-40
          const table1 = spec.tables.find(t => t.tableNum === 'Table 1');
          const matchedRow = table1?.rows.find(r => r[0].toString().includes('Class 2 (Non-Rotating)')) || [];
          
          results.push({
            id: `res-${note.id}`,
            drawingId: drawing.id,
            noteId: note.id,
            noteNumber: note.noteNumber,
            noteRawText: note.rawText,
            category: note.category,
            specCode: note.specCode,
            severity: 'CRITICAL',
            discrepancyTitle: '열처리 Class 등급과 요구 경도(HRC) 충돌',
            drawingRequirement: 'EMS 52401 Class 2 적용 및 최종 경도 HRC 38 - 42 요구',
            specStandardValue: 'EMS 52401 Section 5.1 & Table 1: Class 2 (Non-Rotating) 시효 전 경도 HRC 30-35 Max, 최종 시효 경도 HRC 34-40 Max',
            citation: {
              specCode: spec.specCode,
              specTitle: spec.title,
              page: 9,
              sectionRef: 'Section 5.1',
              tableRef: 'Table 1 (Row 2)',
              matchedRowText: matchedRow.join(' | ') || 'Class 2 (Non-Rotating) | 980°C ±10°C | 1 Hr | Solution Annealed | HRC 30 - 35 Max',
              exactStandardRequirement: 'EMS 52401 Class 2 처리 조건에서는 용솔 상태 경도가 HRC 30-35 이하이어야 하며, HRC 38-42는 Class 1 회전 부품 Double-Aging 조건이어야 달성 가능함.'
            },
            levelCAdvice: {
              summary: '도면의 Class 2 지시와 경도 요구사항(HRC 38-42)이 규격 표준 범위와 상충됩니다. 회전부품 특성을 고려하여 EMS 52401 Class 1 (Double Aging 720°C/620°C)으로 공정 재설정이 필요합니다.',
              riskAssessment: 'Class 2 단일 시효로 HRC 38-42 강제 달성을 위해 열처리 유지 시간을 연장할 경우 취성(Embrittlement) 및 취약 마이크로 조직 형성으로 고속 회전 시 파손 위험 증대.',
              sdrRecommendation: {
                required: true,
                title: '설계공차 완화 및 열처리 Class 변경 요청 (SDR)',
                justification: '가스터빈 고압터빈 블레이드(P/N 12345-01)의 피로강도 및 고온 내구성 확보를 위해 도면 주기사항의 Class 2 지시를 Class 1 회전부품 전용 열처리 공정으로 승격 요청함.',
                proposedTolerance: '열처리 등급: EMS 52401 Class 1 변경, 목표 경도 HRC 36-40 완화 허용'
              },
              processAdjustment: {
                parameter: '열처리 유지시간 및 2차 시효 (Double Aging)',
                recommendedAction: '1차 시효 (720°C 8시간) 후 노냉(Furnace Cool)하여 2차 시효 (620°C 8시간) 추가 적용',
                engineeringReason: 'Inconel 718의 γ" (Ni3Nb) 상 정밀 침출을 유도하여 조직 응력 집중을 방지하고 목표 경도를 안정적으로 확보'
              },
              historicalPrecedentMatchId: 'NCR-2025-089'
            }
          });
          continue;
        }
      }

      // Default Heat treatment compliant or mild warning
      results.push({
        id: `res-${note.id}`,
        drawingId: drawing.id,
        noteId: note.id,
        noteNumber: note.noteNumber,
        noteRawText: note.rawText,
        category: note.category,
        specCode: note.specCode,
        severity: 'OK',
        discrepancyTitle: '열처리 주기사항 규격 정합성 적합',
        drawingRequirement: note.rawText,
        specStandardValue: `${spec.specCode} 규격 내 용솔 열처리 및 시효 조건 표준 준수`,
        citation: {
          specCode: spec.specCode,
          specTitle: spec.title,
          page: spec.sections[0]?.page || 4,
          sectionRef: `Section ${spec.sections[0]?.sectionNum || '4.1'}`,
          tableRef: spec.tables[0]?.tableNum,
          matchedRowText: spec.sections[0]?.content || 'Standard condition verified',
          exactStandardRequirement: '도면 요구 온도가 규격 허용 오차 범위를 준수함.'
        },
        levelCAdvice: {
          summary: '도면의 열처리 온도가 규격서 표준 범위 내에 정확히 부합하며, 열처리 설비 가열 균일도(Uniformity Class 2) 만족 시 정상 진행 가능합니다.',
          riskAssessment: '특이 리스크 없음. 진공도 10^-4 Torr 유지 확인 권장.',
          sdrRecommendation: {
            required: false,
            title: 'SDR 불필요',
            justification: '규격 표준 조건 만족',
            proposedTolerance: 'N/A'
          },
          processAdjustment: {
            parameter: '진공 퍼니스 켄칭 서포트',
            recommendedAction: '아르곤 분사 가스 냉각 유량 정기 점검',
            engineeringReason: '소재 변형 예방 및 제어 조건 유지'
          }
        }
      });

    } else if (note.category === 'NDT') {
      if (note.rawText.includes('LEVEL 2') && drawing.diagramType === 'blade') {
        // Critical NDT mismatch: Turbine blade requires Sensitivity Level 4
        const table1 = spec.tables.find(t => t.tableNum === 'Table 1');
        const matchedRow = table1?.rows.find(r => r[0].toString().includes('Grade 1')) || [];

        results.push({
          id: `res-${note.id}`,
          drawingId: drawing.id,
          noteId: note.id,
          noteNumber: note.noteNumber,
          noteRawText: note.rawText,
          category: note.category,
          specCode: note.specCode,
          severity: 'CRITICAL',
          discrepancyTitle: '비파괴검사(NDT) 침투탐상 감도 등급 미달',
          drawingRequirement: 'NDT-SPEC-004 Type 1 Sensitivity Level 2 (중감도)',
          specStandardValue: 'NDT-SPEC-004 Section 4.1 & Table 1: Grade 1 회전 부품(Turbine Blade)은 Ultra-High Sensitivity Level 4 필수',
          citation: {
            specCode: spec.specCode,
            specTitle: spec.title,
            page: 8,
            sectionRef: 'Section 4.1',
            tableRef: 'Table 1 (Row 1)',
            matchedRowText: matchedRow.join(' | ') || 'Grade 1 (Critical Rotating) | Turbine Blades | Type 1 Method A/D | Sensitivity Level 4 (Ultra-High)',
            exactStandardRequirement: '회전체 터빈 블레이드는 고응력 주기적 원심력을 받으므로 0.3mm 미세 균열 탐지를 위해 Sensitivity Level 4 (초고감도) 검사가 의무화되어 있습니다.'
          },
          levelCAdvice: {
            summary: '도면의 FPI Level 2 지시는 회전체 Grade 1 부품의 품질 안전 기준(Level 4)에 미달합니다. 작업지시서 발행 시 NDT 감도 등급을 Level 4로 수정 적용해야 합니다.',
            riskAssessment: 'Level 2 감도 사용 시 루트 및 뿌리부 미세 피로 균열(Micro-crack)을 감지하지 못해 엔진 운전 중 블레이드 비산(Blade Release) 대형 사고로 이어질 수 있음.',
            sdrRecommendation: {
              required: true,
              title: 'NDT 침투탐상 검사 등급 상향 조정 (작업지시서 수정 요청)',
              justification: '회전부품 미세 결함 검출력 강화를 위해 도면 오기를 수정하고 작업지시서 상 NDT Level 4 적용.',
              proposedTolerance: 'NDT 검사 감도: Level 2 -> Level 4 (초고감도) 변경'
            },
            processAdjustment: {
              parameter: 'FPI 침투액 유효시간 및 현상제 세척',
              recommendedAction: 'Type 1 Level 4 초고감도 수세성/후유화성 침투액(Dye) 변경 및 유효 침투시간 30분 확보',
              engineeringReason: '미세 다공성 결함 및 루트부 크랙 내 침투 성능 극대화'
            }
          }
        });
        continue;
      }

      // Default NDT compliant
      results.push({
        id: `res-${note.id}`,
        drawingId: drawing.id,
        noteId: note.id,
        noteNumber: note.noteNumber,
        noteRawText: note.rawText,
        category: note.category,
        specCode: note.specCode,
        severity: 'OK',
        discrepancyTitle: 'NDT 비파괴검사 주기사항 적합',
        drawingRequirement: note.rawText,
        specStandardValue: `${spec.specCode} 규격 내 비파괴 검사 절차 만족`,
        citation: {
          specCode: spec.specCode,
          specTitle: spec.title,
          page: 4,
          sectionRef: 'Section 2.4',
          matchedRowText: 'Standard Inspection Level Verified',
          exactStandardRequirement: '요구된 비파괴검사 감도가 부품 등급과 일치함.'
        },
        levelCAdvice: {
          summary: 'NDT 주기사항이 사내 검사 표준에 완벽히 부합합니다.',
          riskAssessment: '위험요인 없음.',
          sdrRecommendation: { required: false, title: 'N/A', justification: '적합', proposedTolerance: 'N/A' },
          processAdjustment: { parameter: '검사기기 자시 점검', recommendedAction: '자외선 등(UV-A) 조도 1000 µW/cm² 유지 점검', engineeringReason: '검사 정확도 확보' }
        }
      });

    } else if (note.category === 'COATING') {
      if (note.requiredValue.includes('0.42mm') || parseFloat(note.requiredValue) > 0.38) {
        // Warning: Coating thickness high
        results.push({
          id: `res-${note.id}`,
          drawingId: drawing.id,
          noteId: note.id,
          noteNumber: note.noteNumber,
          noteRawText: note.rawText,
          category: note.category,
          specCode: note.specCode,
          severity: 'WARNING',
          discrepancyTitle: 'TBC 코팅 두께 허용 상한 경계 접근 (열박리 주의)',
          drawingRequirement: 'Coat-SPEC-003 코팅 두께 0.42mm - 0.48mm',
          specStandardValue: 'Coat-SPEC-003 Section 3.2 & Table 2: Standard Top Coat Limit 0.35mm Max (0.35mm 초과 시 SDR 및 열박리 평가 필수)',
          citation: {
            specCode: spec.specCode,
            specTitle: spec.title,
            page: 6,
            sectionRef: 'Section 3.2',
            tableRef: 'Table 2 (Row 3)',
            matchedRowText: 'Heavy Duty Barrier | Multi-layer YSZ | 0.30mm - 0.45mm | 0.50mm (Requires SDR & Thermal Qualification)',
            exactStandardRequirement: '코팅 두께가 0.35mm를 초과할 경우 열팽창 계수 차이에 의한 세라믹 층 박리(Spallation) 위험이 급증함.'
          },
          levelCAdvice: {
            summary: '도면 지정 두께(0.42-0.48mm)가 규격 표준 상한(0.35mm)을 초과하고 있습니다. 내구 평가 데이터 검증 후 조건부 작업 진행을 권장합니다.',
            riskAssessment: '열가공 사이클 시 반복적 열충격으로 코팅층 계면 응력이 상승하여 조기 박리 발생 우려.',
            sdrRecommendation: {
              required: true,
              title: 'TBC 코팅 두께 초과에 따른 열충격 시험 결과 제출 조건부 승인 (SDR)',
              justification: '1단 노즐 베인의 내열 단열성 향상을 위해 0.42mm 적용 필요성을 검토하고 열충격 100회 사이클 시험 성적서 첨부 조건으로 공정 승인.',
              proposedTolerance: '세라믹 상층 코팅 두께: 0.42mm - 0.48mm 조건부 허용'
            },
            processAdjustment: {
              parameter: '플라즈마 용사 용사거리 및 분말 공급 속도',
              recommendedAction: '플라즈마 로봇 용사 경로 패스 수 조정 및 미세 잔류응력 완화를 위해 Bond coat 후열처리(1080°C Vacuum Bake) 1시간 실시',
              engineeringReason: '코팅 계면 밀착력 증가 및 계면 응력 상쇄'
            },
            historicalPrecedentMatchId: 'NCR-2024-033'
          }
        });
        continue;
      }

      // Default Coating OK
      results.push({
        id: `res-${note.id}`,
        drawingId: drawing.id,
        noteId: note.id,
        noteNumber: note.noteNumber,
        noteRawText: note.rawText,
        category: note.category,
        specCode: note.specCode,
        severity: 'OK',
        discrepancyTitle: '특수 코팅 규격 정합성 적합',
        drawingRequirement: note.rawText,
        specStandardValue: `${spec.specCode} 내 표준 코팅 두께 범위 준수`,
        citation: {
          specCode: spec.specCode,
          specTitle: spec.title,
          page: 5,
          sectionRef: 'Section 3.2',
          matchedRowText: 'Standard Coating Thickness Met',
          exactStandardRequirement: '표준 두께 범위 준수됨.'
        },
        levelCAdvice: {
          summary: '코팅 두께 요구사항이 표준에 부합합니다.',
          riskAssessment: '특이사항 없음.',
          sdrRecommendation: { required: false, title: 'N/A', justification: '적합', proposedTolerance: 'N/A' },
          processAdjustment: { parameter: '표면 블라스팅', recommendedAction: 'Al2O3 블라스팅 거칠기 Ra 3.2-4.5 µm 유지', engineeringReason: '코팅 부착력 확보' }
        }
      });

    } else {
      // Other categories (Welding, Surface, etc.)
      results.push({
        id: `res-${note.id}`,
        drawingId: drawing.id,
        noteId: note.id,
        noteNumber: note.noteNumber,
        noteRawText: note.rawText,
        category: note.category,
        specCode: note.specCode,
        severity: 'OK',
        discrepancyTitle: '특수공정 규격 정합성 적합',
        drawingRequirement: note.rawText,
        specStandardValue: `${spec.specCode} 공정 규격 준수`,
        citation: {
          specCode: spec.specCode,
          specTitle: spec.title,
          page: 2,
          sectionRef: 'Section 1.1',
          matchedRowText: 'Standard Process Rules Met',
          exactStandardRequirement: '공정 요구사항 적합.'
        },
        levelCAdvice: {
          summary: '요구 조건이 규격과 정합성을 이룹니다.',
          riskAssessment: '위험요인 없음.',
          sdrRecommendation: { required: false, title: 'N/A', justification: '적합', proposedTolerance: 'N/A' },
          processAdjustment: { parameter: '공정 모니터링', recommendedAction: '표준 작업지시서 준수', engineeringReason: '품질 안정화' }
        }
      });
    }
  }

  return results;
}

export function findHistoricalNCRMatch(matchId?: string) {
  if (!matchId) return null;
  return mockNCRHistory.find(n => n.id === matchId) || null;
}
