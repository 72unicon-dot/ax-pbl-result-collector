# AX-PBL Result Collector

48개 AX-PBL 과제별 **실제 사용 결과·업무 규칙·데이터 연계 정보**를 수집하는 공개 입력 Form입니다.  
로그인 없이 누구나 작성할 수 있고, 제출 데이터는 Supabase에 저장되며 Google Sheets Webhook을 설정하면 시트에도 동시에 취합됩니다.

## 1. 주요 기능

- `/` : 이미지 예시와 동일한 6개 영역 Form
- `/tasks` : 과제 마스터 목록
- `/admin` : P0 관리자 취합 현황
- `/api/submissions` : 제출 저장 및 목록 조회
- Supabase `ax_pbl_tasks`, `ax_pbl_submissions`
- Google Apps Script Webhook 연동

## 2. 설치

```bash
npm install
cp .env.example .env.local
npm run dev
```

## 3. Supabase 설정

1. Supabase 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_init.sql` 실행
3. `.env.local`에 다음 입력

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

P0는 로그인 없는 공개 작성 요구에 맞춰 `anon insert`를 허용했습니다. 운영 전에는 관리자 조회 인증, rate limit, 회사망 제한, Turnstile 등 스팸 방지를 추가하세요.

## 4. Google Sheets 연동

1. Google Sheets 새 파일 생성
2. Apps Script에 `google/apps-script.gs` 붙여넣기
3. 웹 앱으로 배포
4. `.env.local`에 입력

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec?secret=change-me
GOOGLE_SHEETS_WEBHOOK_SECRET=change-me
```

Apps Script 환경에 따라 커스텀 헤더 접근이 제한될 수 있어 URL `?secret=` 방식도 지원합니다.

## 5. Vercel 배포

```bash
vercel
```

Vercel Project Settings → Environment Variables에 `.env.local` 값을 등록합니다.

## 6. 운영 전 보완 권장

- 관리자 조회 화면 로그인 추가
- 개인정보·원가·기밀정보 입력 금지 안내 강화
- 중복 제출 방지
- IP/기기 기반 rate limit
- Supabase Edge Function 또는 Queue 기반 Sheets 재전송
- Google Sheets 실패 건 재시도 화면


### Security notice (2026-10-12)
Public submissions use INSERT-only Supabase RLS. `/api/submissions` GET is forbidden and `/admin` returns 404. Google Sheets automatic sync is **not enabled** in this safe public MVP until a secure integration and admin-only export workflow is implemented. Do not deploy secret admin keys to a public client.
