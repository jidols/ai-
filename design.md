# 한화에어로스페이스 (Hanwha Aerospace) 디자인 시스템 가이드라인 (`design.md`)

본 문서는 **한화에어로스페이스 공식 웹사이트([hanwhaaerospace.com](https://www.hanwhaaerospace.com/kor/index.do))**의 브랜드 정체성과 UI/UX 디자인 모티프를 바탕으로 작성된 **통합 디자인 시스템 명세서**입니다.

---

## 1. 디자인 비전 및 핵심 가치 (Design Vision & Values)

한화에어로스페이스의 디자인 언어는 **"Tech Precision & Bold Modernism (정밀한 기술감과 대담한 현대성)"**을 지향합니다. 대한민국 대표 항공우주·방산 기업으로서 기술적 정교함, 미래 지향적인 신뢰성, 그리고 대담하고 차분한 시각적 임팩트를 전달합니다.

### 핵심 브랜드 디렉션
* **Technical Precision (기술적 정교함)**: 1px 라인 그리드, 정밀한 마이크로 배지, 모노스페이스 데이터 표기, 절제된 레이아웃.
* **Bold Confidence (대담한 신뢰성)**: 한화 브랜드의 상징인 **Hanwha Orange** 포인트 컬러와 굵고 선명한 디스플레이 타이포그래피.
* **High-Contrast Depth (고대비의 깊이감)**: 다크 슬레이트/딥 네이비 배경과 크리스프 라이트 캔버스 간의 대비를 통해 기술 문서 및 대시보드의 시인성 극대화.
* **Streamlined Functionality (직관적 기능성)**: 불필요한 장식을 배제하고 핵심 데이터 및 프로세스 흐름 중심의 UI 설계.

---

## 2. 브랜드 컬러 시스템 (Brand Color Palette)

한화 트라이서클(Tri-circle)의 원형과 역동성을 반영한 오렌지 계열을 핵심 포인트로 사용하며, 정밀한 엔지니어링 느낌을 주는 딥 네이비/슬레이트 톤과 결합합니다.

### 2.1 Primary & Brand Colors
| 역할 | 컬러명 | Hex Code | RGB | 용도 및 가이드라인 |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Brand** | Hanwha Orange | `#F26522` / `#F37321` | `rgb(242, 101, 34)` | 브랜드 CI, 주요 CTA 버튼, Highlight Border, Active Indicator |
| **Brand Accent** | Hanwha Bright Orange | `#FF7A00` / `#ED6C00` | `rgb(255, 122, 0)` | Hover 상태, 경고 및 중요 메트릭 알림 |
| **Dark Primary** | Obsidian Aerospace | `#0B0F19` / `#111827` | `rgb(11, 15, 25)` | 하이테크 다크 모드 배경, 헤더, 차트 서체 배경 |
| **Dark Surface** | Deep Tech Slate | `#1E2640` / `#1F293D` | `rgb(30, 38, 64)` | 다크 카드 컴포넌트, 드롭다운, 스티키 패널 |

### 2.2 Neutral & Background Colors
| 역할 | 컬러명 | Hex Code | 용도 |
| :--- | :--- | :--- | :--- |
| **Light Canvas** | Pure Slate White | `#F8FAFC` | 기본 모드 메인 background |
| **Surface Card** | Clean White | `#FFFFFF` | 메인 카드의 배경, 테이블 컨테이너 |
| **Subtle Border** | Tech Border Light | `#E2E8F0` | 1px 카드의 테두리, 구분선 |
| **Text Primary** | Deep Charcoal | `#0F172A` | 메인 제목, 본문 가독성 텍스트 |
| **Text Secondary**| Cool Muted Gray | `#64748B` | 설명 텍스트, 캡션, 비활성 탭 |

### 2.3 Status & Functional Colors
* **Success / Compliant**: `#10B981` (Emerald Green) - 정합성 검토 적합, 정상 가동 상태
* **Warning / Review Needed**: `#F59E0B` (Amber Gold) - 검토 필요, 조건부 승인, 모니터링 항목
* **Danger / Non-Compliant**: `#EF4444` (Crisp Red) - 규격 부적합, 결함 알림, 필수 수정 사항
* **Info / Tech Metric**: `#06B6D4` (Cyan Blue) - AI 도면 분석 진행 중, 데이터 매핑 가이드

---

## 3. 타이포그래피 시스템 (Typography & Scaling)

한화에어로스페이스의 도면 및 스펙 검토 시스템에 최적화된 **가독성 높은 3단 폰트 조합**을 채택합니다.

### 3.1 폰트 패밀리
1. **Primary Body / UI Font**: `Pretendard`, `Noto Sans KR`, `-apple-system`, `sans-serif`
2. **Display Headline Font**: `Montserrat`, `Plus Jakarta Sans` (국문: Pretendard Bold)
3. **Technical Data & Spec Font**: `JetBrains Mono`, `Fira Code`, `ui-monospace` (도면 기호, 특수공정 규격 코드, 수치 표시)

### 3.2 타이포그래피 스케일
| 타입 | Size / Line Height | Font Weight | Letter Spacing | 적용 예시 |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | 44px (2.75rem) / 1.2 | ExtraBold (800) | `-0.025em` | 대시보드 타이틀, 메인 비전 헤드라인 |
| **Section Title (H1)**| 32px (2.0rem) / 1.3 | Bold (700) | `-0.02em` | 모듈별 메인 제목 (예: 도면 주기사항 분석) |
| **Subsection (H2)** | 24px (1.5rem) / 1.4 | Bold (700) | `-0.01em` | 서브 섹션, 카드 헤더, 모달 제목 |
| **Card Header (H3)** | 18px (1.125rem) / 1.4 | SemiBold (600) | `0em` | 카드 타이틀, 테이블 헤더 |
| **Body (Default)** | 15px (0.9375rem) / 1.6 | Regular (400) / Medium (500) | `0em` | 일반 설명글, 검토 의견 리포트 |
| **Technical Spec** | 13px (0.8125rem) / 1.5 | Mono Medium (500) | `0.02em` | 규격 번호 (AMS 2750), 도면 기호 코드 |
| **Micro Caption** | 12px (0.75rem) / 1.4 | Medium (500) | `0.03em` | 태그 배지, 타임스탬프, 푸터 정보 |

---

## 4. 레이아웃 & 그리드 아키텍처 (Layout & Grid Architecture)

### 4.1 그리드 시스템
* **Max Container Width**: `1440px` (대시보드) / `1280px` (표준 랜딩 & 가이드)
* **Columns**: 12-Column Grid (`gap-6` ~ `gap-8`)
* **Responsive Padding**:
  * Desktop (xl/2xl): `px-8` (32px)
  * Tablet (md/lg): `px-6` (24px)
  * Mobile (sm): `px-4` (16px)

### 4.2 헤더 & 네비게이션 구조
* **Header Style**:
  * 상단 고정 (Sticky / Fixed) 형태.
  * 배경: 다크 슬레이트 (`#0B0F19`) 또는 백드롭 블러 가공된 가벼운 유리 느낌 (`backdrop-blur-md bg-white/90`).
  * 한화 트라이서클 로고 모티프 + 서비스 타이틀 **Hanwha Aero-Spec Insight (HASI)**.
* **Active Navigation Indicator**:
  * 선택된 메뉴 하단에 **2px Hanwha Orange Accent Line** (`#F26522`) 적용.

---

## 5. UI 컴포넌트 디자인 가이드라인 (UI Component Specs)

### 5.1 버튼 (Buttons)
* **Primary Action Button**:
  * Background: `bg-[#F26522]` (`hover:bg-[#ED6C00]`)
  * Text: White (`font-semibold`)
  * Border Radius: `rounded-md` (6px~8px) - 직각에 가까운 정밀한 곡율
  * Shadow: `shadow-sm hover:shadow-orange-500/20`
* **Secondary / Outline Button**:
  * Background: `bg-transparent hover:bg-slate-100`
  * Border: `border border-slate-300`
  * Text: `text-slate-800 font-medium`
* **Technical Dark Button**:
  * Background: `bg-[#0B0F19] text-white hover:bg-[#1E2640]`
  * Border: `border border-slate-700`

### 5.2 데이터 그리드 및 특수공정 카드 (Data Grid & Cards)
* **Card Container**:
  * Surface: `#FFFFFF` 또는 `#F8FAFC`
  * Border: `1px solid #E2E8F0`
  * Border Radius: `rounded-xl` (12px)
  * Hover Effect: `transition-all duration-200 hover:border-[#F26522]/50 hover:shadow-md`
* **Spec Code Badge (규격 코드 배지)**:
  * Font: `JetBrains Mono`, `text-xs`
  * Style: `bg-slate-100 text-slate-800 px-2 py-1 rounded border border-slate-200`
  * Orange Highlight State: `bg-orange-50 text-[#F26522] border border-orange-200`

### 5.3 AI 검토 리포트 & 레벨 C 엔지니어링 모듈 UI
* **Compliance Status Panel**:
  * 검토 적합률/일치율을 한화 오렌지 게이지 스탯 بار로 시각화.
  * AI 추론 근거(Reasoning) 영역은 은은한 인디고/슬레이트 배경과 1px 점선 테두리(`border-dashed border-slate-300`)로 구분.

---

## 6. 마이크로 인터랙션 및 애니메이션 (Motion System)

* **Motion Framework**: `framer-motion` (`motion/react`)
* **Timing & Duration**:
  * Hover & Color Transition: `200ms ease-out`
  * Modal & Drawer Entrance: `300ms cubic-bezier(0.16, 1, 0.3, 1)`
  * Tab Switch & List Filtering: `250ms ease-in-out`
* **Visual FX Rules**:
  * 과도한 3D 회전이나 화려한 그라데이션은 지양.
  * 정밀 기술 분석 시스템답게 **Fade-In**, **Slide-Up (8px~12px)**, **Smooth Width Expansion** 등 절제되고 기계적인 모션 적용.

---

## 7. 웹 접근성 및 성능 준수 (Accessibility & Quality)

1. **대비율(Contrast Ratio)**: 본문 및 핵심 데이터 텍스트는 WCAG AA 기준(4.5:1 이상)을 충족.
2. **반응형 최적화**: 1024px, 1280px, 1536px 해상도에서의 도면 및 스펙 비교 2컬럼/3컬럼 뷰 분할 보장.
3. **국/영문 및 데이터 표기 가이드**: 수치 및 단위(℃, MPa, Ra, µm 등)는 모노스페이스 서체로 정렬하여 오독 방지.

---
*최종 수정일: 2026년 7월 24일 | 한화에어로스페이스 (Hanwha Aerospace) UX Design System*
