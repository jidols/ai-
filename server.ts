import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini client lazily on the server
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        aiClient = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });
      }
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      hasGeminiApiKey: hasKey,
      appName: 'Hanwha Aero-Spec Insight (HASI)',
      serverTime: new Date().toISOString()
    });
  });

  // Deep AI Compliance & Level C Engineering Analysis API
  app.post('/api/gemini/analyze', async (req, res) => {
    try {
      const { drawingNotes, specTitle, specCode, partName, material } = req.body;

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY_MISSING',
          message: 'Gemini API Key가 설정되지 않았습니다. On-Premise 로컬 엔진 모드로 실행됩니다.'
        });
      }

      const prompt = `
당신은 한화에어로스페이스 가스터빈 엔진 부품 특수공정 최고 권위자(Level C 수석 엔지니어)입니다.
다음 도면 주기사항(Drawing Notes)과 특수공정 규격서(Spec) 사이의 정합성을 수치적으로 정밀 비교 분석하고 결합 대안(Level C Engineering Advice) 및 SDR(설계공차완화 요청서) 초안을 작성해주십시오.

[부품 정보]
- 부품명: ${partName || '가스터빈 터빈 부품'}
- 재질: ${material || 'Inconel 718'}
- 참조 규격: ${specCode} (${specTitle})
- 도면 주기사항: ${drawingNotes}

응답은 반드시 아래 JSON 구조로만 반환하십시오:
{
  "severity": "CRITICAL" | "WARNING" | "OK",
  "discrepancyTitle": "핵심 충돌 요약 제목",
  "drawingRequirement": "도면 요구사항 요약",
  "specStandardValue": "규격서 표준 기준치",
  "citation": {
    "sectionRef": "Section X.X",
    "page": 1,
    "tableRef": "Table X",
    "exactRequirement": "규격서 원문 요구사항 조항 내용"
  },
  "levelCAdvice": {
    "summary": "상세 기술 검토 의견 (Level C 수석엔지니어 관점)",
    "riskAssessment": "부적합(NCR) 발생 시 구조적/열적 위험성 및 피로 수명 영향",
    "sdrRecommendation": {
      "required": true,
      "title": "SDR (설계공차완화) 제안 제목",
      "justification": "기술적 합리화 사유",
      "proposedTolerance": "변경 제안 공차 범위"
    },
    "processAdjustment": {
      "parameter": "조정 대상 주요 공정 변수",
      "recommendedAction": "현장 공정 가이드 (유지시간/온도/치수 조정)",
      "engineeringReason": "엔지니어링 근거"
    }
  }
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '{}';
      const parsedJson = JSON.parse(responseText);
      return res.json({ success: true, data: parsedJson });
    } catch (err: any) {
      console.error('Gemini API Error:', err);
      return res.status(500).json({
        error: 'GEMINI_EXECUTION_ERROR',
        message: err.message || 'Gemini 분석 중 오류가 발생했습니다.'
      });
    }
  });

  // Vite middleware in development or static fallback in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HASI Server] Server running on http://localhost:${PORT}`);
  });
}

startServer();
