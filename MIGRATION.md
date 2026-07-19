# 우리원 사이트 이관 가이드

기존 사이트(`http://usao.co.kr`, 닷홈 빌더)에서 새 사이트(React+Vite)로 자료를 옮기는 절차입니다.

---

## 1단계 – Vercel 배포 (새 사이트 오픈)

### 사전 준비
1. [Vercel 계정 생성](https://vercel.com/signup) (GitHub 계정으로 가입 권장)
2. [Supabase 프로젝트 생성](https://supabase.com/dashboard) → 서울(ap-northeast-2) 리전 선택

### Supabase DB 테이블 생성
Supabase 대시보드 → SQL Editor에서 아래 파일 실행:
```
src/db/schema.sql
```

### Vercel 배포 절차
1. Vercel 대시보드 → **Add New Project** → GitHub 레포 `JMMEDIA2026/woori` 선택
2. **Environment Variables** 탭에서 아래 값 입력:

| 키 | 값 (Supabase 대시보드 → Settings → Database에서 확인) |
|---|---|
| `SQL_HOST` | `aws-0-ap-northeast-2.pooler.supabase.com` |
| `SQL_PORT` | `5432` |
| `SQL_DB_NAME` | `postgres` |
| `SQL_USER` | `postgres.[your-project-ref]` |
| `SQL_PASSWORD` | (Supabase DB 비밀번호) |
| `VITE_SUPABASE_URL` | `https://[your-project-ref].supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | (Supabase anon key) |

3. **Deploy** 클릭 → 자동 빌드 및 배포 완료

### 도메인 연결 (usao.co.kr → 새 사이트)
1. Vercel 대시보드 → 프로젝트 → **Settings → Domains** → `usao.co.kr` 입력
2. 닷홈 관리자 → **DNS 관리** → A 레코드를 Vercel IP(`76.76.21.21`)로 변경

---

## 2단계 – 기존 사이트 콘텐츠 이관

### FTP에서 이미지/파일 다운로드
1. FTP 클라이언트(FileZilla 등)로 닷홈 접속
2. 아래 폴더를 로컬로 다운로드:
   - `skin/upload/` → 업로드된 모든 파일
   - `skin/img/` → 사이트 이미지
3. 다운받은 파일을 `public/assets/legacy/` 폴더에 넣기

### 사이트 전체 크롤링 (텍스트 내용 백업)
인터넷이 연결된 로컬 PC에서 실행:
```bash
npm run migration:crawl
```
결과는 `migration-output/legacy-snapshot/` 폴더에 저장됩니다.

```bash
# 고급 옵션 (필요시)
node scripts/migration/crawl-legacy-site.mjs \
  --base http://usao.co.kr \
  --out ./migration-output \
  --max-pages 500 \
  --concurrency 3
```

### 크롤링 결과 확인
```bash
npm run migration:verify
```

---

## 3단계 – 콘텐츠 편집 (새 사이트 기준)

| 파일 | 수정할 내용 |
|---|---|
| `src/data.ts` | 연혁, 학술자료, 갤러리, 게시판 초기 데이터 |
| `src/App.tsx` | 메인 슬라이더 이미지 및 캡션 |
| `src/components/Navigation.tsx` | 메뉴 구조 |
| `src/components/DashboardHome.tsx` | 홈 섹션 내용 |
| `src/page/Greetings.tsx` | 대표 인사말 |
| `src/page/Organization.tsx` | 조직도 |
| `src/page/History.tsx` | 연혁 |
| `src/page/Directions.tsx` | 찾아오는 길 (지도/주소) |

### 이미지 교체 방법
현재 Unsplash 임시 이미지를 실제 사진으로 교체:
1. 실제 사진을 `public/images/` 폴더에 업로드
2. `src/App.tsx` 및 각 페이지에서 `imageUrl` 값을 `/images/파일명.jpg`로 변경

---

## 4단계 – 관리자 페이지 사용

새 사이트 배포 후 푸터의 **Admin** 버튼 클릭 → 관리자 대시보드에서:
- 단원 등록/관리
- 게시물 등록
- 후원 내역 관리
- 상담 신청 관리

---

## 현황 체크리스트

- [ ] Supabase 프로젝트 생성 완료
- [ ] Vercel 배포 완료
- [ ] 도메인(usao.co.kr) 연결 완료
- [ ] FTP 이미지 다운로드 완료
- [ ] 로컬에서 크롤링 실행 완료
- [ ] 실제 사진으로 이미지 교체 완료
- [ ] 텍스트 콘텐츠 검수 완료
- [ ] 관리자 계정 설정 완료
