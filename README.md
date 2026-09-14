# 커튼 블라인더 견적

D'MOTIVE WINDOW 패키지(ROOM / SUITE / HOME) 기준으로 **실시간 KRW 견적**을 계산하는 웹 앱입니다.  
단가는 「**기획 가정 단가**」이며, 백엔드·로그인 없이 브라우저(localStorage)만 사용합니다.

## 실행 방법

```bash
cd curtain-blind-quote
npm install
npm run dev
```

브라우저에서 표시된 주소(보통 `http://localhost:5173`)로 접속합니다.

프로덕션 빌드:

```bash
npm run build
npm run preview
```

## 폴더 구조

```
src/
  app/                 # 앱 셸, HashRouter
  features/
    quote/             # 견적 폼 · 실시간 내역 · 홈
    pricing/           # 가격 엔진 · 기본 단가 · 타입 (React 없음)
    settings/          # 단가설정 페이지 · 설정 저장 훅
    admin/             # 관리자 로그인 게이트 · 세션 인증
    saved-quotes/      # 저장 견적 목록 · 저장소 · hooks
  shared/              # Layout 등 공통 UI
  main.tsx
  index.css
```

| 무엇을 바꿀까 | 어디를 열까 |
| --- | --- |
| **패키지 기본가·밴드·라인 배수** | `src/features/pricing/defaults.ts` |
| **견적 계산 공식** | `src/features/pricing/pricing.ts` |
| **견적 입력 폼 UI** | `src/features/quote/QuoteForm.tsx` |
| **실시간 견적 내역** | `src/features/quote/QuoteBreakdownCard.tsx` |
| **저장 견적 목록** | `src/features/saved-quotes/` |
| **단가설정 화면** | `src/features/settings/SettingsPage.tsx` |
| **관리자 잠금** | `src/features/admin/` (`#/admin`) |

## 주요 기능

- **패키지 견적**: ROOM / SUITE / HOME + Living Soft / Sleep Dark / Show Luxury
- **옵션**: 레이어드(쉬어+암막), 전동·스마트허브, 설치비, 품목 유형(커튼·롤·우드·콤비·암막)
- **규격**: 가로·세로(cm/mm) — 견적서 표시용 (관리자에서 사이즈 가·감 선택 가능)
- **실시간 합계**: 입력 변경 시 즉시 갱신 (기본 1,000원 단위 반올림)
- **견적 저장**: 최근 견적 저장·목록·수정·삭제 (최대 50건)
- **인쇄**: 인쇄용 CSS로 견적서 출력
- **관리자**: `#/admin`에서 패키지 기본가·밴드·배수·옵션비 편집

공개 메뉴에는 단가설정 링크가 없습니다.

## 가격 계산 공식 (기획 가정)

```
창 1식 =
  packageBase[패키지]          // ROOM / SUITE / HOME 기본가(원)
  × lineMultiplier             // Living Soft / Sleep Dark / Show Luxury
  × categoryMultiplier         // 품목 배수 (기본 ≈ 1.0)
  × sizeFactor                 // 사이즈 가·감 OFF면 1
  + layeredFee                 // ROOM 등 미포함 패키지에서 레이어드 선택 시
  + motorFee                   // 전동·스마트허브 선택 시
  + installFee                 // 설치 포함 선택 시

합계원금 = 창 1식 × 수량(창 수)

부가세 별도: 공급가 = 합계원금, VAT = 합계원금 × 세율, 총액 = 공급가 + VAT
부가세 포함: 총액 = 합계원금, 공급가 = 총액 ÷ (1+세율), VAT = 총액 − 공급가

최종 표시 = 총액을 roundTo 단위로 반올림 (기본 1,000원)

사이즈 배수 (관리자에서 ON 시에만):
  sizeFactor = clamp(실면적m² ÷ 기준면적m², sizeFactorMin, sizeFactorMax)
```

견적 화면에는 패키지 **참고 밴드(min~max)** 가 함께 표시됩니다.

### 기본값 (원)

| 항목 | 기본 |
| --- | --- |
| ROOM 기본가 | 800,000 (밴드 450,000~1,200,000) |
| SUITE 기본가 | 2,200,000 (밴드 1,500,000~2,800,000) · 마진 PPT 예시 |
| HOME 기본가 | 5,000,000 (밴드 3,500,000~6,500,000) · 아이디어 덱 350~650만 |
| Living Soft / Sleep Dark / Show Luxury | ×1.00 / ×1.08 / ×1.15 |
| ROOM 레이어드 가산 | 100,000 (SUITE·HOME은 기본 포함) |
| 전동·스마트허브 | 500,000 (마진 PPT SUITE+30~80만 중 중간) |
| 설치비 | 0 (별도 필요 시 관리자에서) |
| 사이즈 가·감 | OFF |
| 반올림 | 1,000원 |
| 라벨 | 기획 가정 단가 |

## 단가 변경 방법 (관리자)

주소창에서 `#/admin`으로 이동합니다.

1. 관리자 비밀번호로 입장 (브라우저 세션, `sessionStorage`)
2. 패키지 기본가·참고 밴드, 라인·품목 배수, 레이어드/전동/설치비, 부가세·반올림을 수정
3. 변경은 즉시 저장되며 견적 화면에 반영됩니다
4. **기본값 복원**으로 「기획 가정 단가」 초기값으로 되돌릴 수 있습니다
5. **로그아웃**하면 같은 탭의 세션이 끝납니다

> 이 비밀번호 잠금은 **브라우저(클라이언트)용**입니다. 소스 코드를 보면 우회할 수 있으므로 서버 보안이 아닙니다.

코드에서 기본값을 바꾸려면 `src/features/pricing/defaults.ts`의 `DEFAULT_SETTINGS`를 수정하세요.

## 기술 스택

- Vite + React + TypeScript (`base: './'`)
- React Router HashRouter (견적 / 저장목록 / 관리자 `#/admin`)
- 스타일: 순수 CSS (모바일 우선)

## 제한 사항

- 서버 동기화·다중 기기 공유 없음 (브라우저 localStorage만)
- 단가는 기획 가정이며 실제 시세·원단·시공 조건과 다를 수 있음
- 오프라인 CDN 폰트(Pretendard) 로드 실패 시 시스템 한글 폰트로 대체

## Live

https://gmlwls8459.github.io/curtain-blind-quote/
