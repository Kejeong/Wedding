# 모바일 청첩장

Next.js (App Router) + TypeScript + Tailwind CSS v4 · Vercel 배포 · 방명록은 Supabase(Postgres)

## 로컬 실행

1. Supabase 프로젝트 생성 → SQL Editor에서 `supabase/schema.sql` 실행
2. `.env.example` 을 `.env.local` 로 복사하고 값 채우기
3. `npm install && npm run dev` → http://localhost:3000

## 구조

- `src/data/wedding.ts` — 이름·날짜·장소·계좌 등 콘텐츠 (문구 수정은 여기서만)
- `src/components/sections/` — 피그마 섹션 순서대로 한 파일씩
- `src/app/api/guestbook/` — 방명록 조회·작성(`route.ts`), 삭제(`[id]/route.ts`)
- `src/lib/rate-limit.ts` — 작성 도배 · 4자리 비밀번호 무작위 대입 방지

## 배포 (Vercel)

1. GitHub 저장소 연결 후 Import
2. Environment Variables 에 `.env.example` 항목 등록 (`NEXT_PUBLIC_SITE_URL` 은 실제 도메인)
3. Kakao Developers 에 배포 도메인 등록 (카카오톡 공유)

## 남은 작업

- [ ] 이미지 에셋 (`public/images/`: og.jpg 1200x630, 갤러리 사진)
- [ ] 메인 봉투·초대 봉투 일러스트, 약도 SVG
- [ ] 갤러리 콜라주 레이아웃
- [ ] Adobe Fonts kit 연결 (IvyOra Display, Altesse Std)
- [ ] 카카오톡 공유 SDK
