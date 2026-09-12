# 커튼 블라인더 견적

커튼·롤블라인드·우드블라인드·콤비블라인드·암막커튼 규격을 입력하면 **실시간 KRW 견적**을 계산하는 웹 앱입니다.  
백엔드·로그인 없이 브라우저(localStorage)만 사용합니다.

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

기능(feature) 단위로 나뉘어 있습니다. 수정할 때 아래를 참고하세요.

```
src/
  app/                 # 앱 셸, 라우터 (HashRouter)
  features/
    quote/             # 견적 폼 · 실시간 내역 · 홈 화면
    pricing/           # 가격 엔진 · 기본 단가 · 타입 (React 없음)
    settings/          # 단가설정 페이지 · 설정 저장 훅
    saved-quotes/      # 저장 견적 목록 · 저장소 · quotes 훅
  shared/              # Layout 등 공통 UI
  main.tsx
  index.css
```

| 무엇을 바꿀까 | 어디를 열까 |
| --- | --- |
| **기본 단가·배수·설치비** | `src/features/pricing/defaults.ts` (`DEFAULT_SETTINGS`) |
| **견적 계산 공식** | `src/features/pricing/pricing.ts` |
| **견적 입력 폼 UI** | `src/features/quote/QuoteForm.tsx` |
| **실시간 견적 내역 카드** | `src/features/quote/QuoteBreakdownCard.tsx` |
| **저장 견적 목록** | `src/features/saved-quotes/` |
| **단가설정 화면** | `src/features/settings/SettingsPage.tsx` |

## 주요 기능

- **견적 입력**: 품목, 가로·세로(cm/mm), 수량, 불투명도, 설치, 주름배수(커튼), 전동화(블라인드), 부가세 별도/포함, 고객명·메모
- **실시간 합계**: 입력 변경 시 즉시 내역·합계 갱신 (100원 단위 반올림)
- **샘플 단가**: 한국 시장 대략 참고가 (단가설정에서 수정 가능)
- **견적 저장**: 최근 견적 저장·목록·수정·삭제 (최대 50건, localStorage)
- **인쇄**: 인쇄용 CSS로 견적서 출력
- **단가설정**: m²당 단가, 불투명도 배수, 설치비·전동화비, 부가세율 편집

## 가격 계산 공식

```
면적(m²) = (가로 ÷ 단위환산) × (세로 ÷ 단위환산)
  · cm → ÷100,  mm → ÷1000

기본금액 = 단가(원/m²) × 면적 × 수량
배수적용 = 기본금액 × 주름배수 × 불투명도배수
  · 주름배수: 커튼·암막커튼만 (1.5 또는 2), 그 외 1
  · 불투명도: 일반 1.0 / 암막 1.3 / 쉬어 0.85 (설정에서 변경)

합계원금 = 배수적용 + 설치비(+개당) + 전동화비(+개당, 해당 품목만)

부가세 별도: 공급가 = 합계원금, VAT = 합계원금 × 10%, 총액 = 공급가 + VAT
부가세 포함: 총액 = 합계원금, 공급가 = 총액 ÷ 1.1, VAT = 총액 − 공급가

최종 표시 = 총액을 100원 단위로 반올림
```

## 단가 변경 방법

1. 앱 상단 **단가설정** 메뉴로 이동
2. 품목별 m² 단가, 불투명도 배수, 설치비·전동화비, 부가세율을 수정
3. 변경은 즉시 저장되며 견적 화면에 반영됩니다
4. **기본값 복원**으로 「샘플 단가」 초기값으로 되돌릴 수 있습니다

코드에서 기본값을 바꾸려면 `src/features/pricing/defaults.ts`의 `DEFAULT_SETTINGS`를 수정하세요.

## 기술 스택

- Vite + React + TypeScript
- React Router (견적 / 저장목록 / 단가설정)
- 스타일: 순수 CSS (모바일 우선)

## 제한 사항

- 서버 동기화·다중 기기 공유 없음 (브라우저 localStorage만)
- 단가는 샘플 참고가이며 실제 시세·원단·시공 조건과 다를 수 있음
- 오프라인 CDN 폰트(Pretendard) 로드 실패 시 시스템 한글 폰트로 대체
