-- 회원 관리 (Members) 테이블 스키마
CREATE TABLE members (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  level TEXT NOT NULL DEFAULT '일반',
  status TEXT NOT NULL DEFAULT '활성',
  join_date TIMESTAMP DEFAULT NOW()
);

-- 콘텐츠 관리 (Contents) 테이블 스키마
CREATE TABLE contents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  author TEXT NOT NULL,
  views INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT '게시',
  published_at TIMESTAMP DEFAULT NOW()
);

-- 후원 및 재정 (Donations) 테이블 스키마
CREATE TABLE donations (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  donor_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '완료',
  date TIMESTAMP DEFAULT NOW()
);

-- 상담 및 민원 (Consultations) 테이블 스키마
CREATE TABLE consultations (
  id SERIAL PRIMARY KEY,
  member_id INTEGER REFERENCES members(id) ON DELETE NO ACTION ON UPDATE NO ACTION,
  requester_name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT '대기중',
  manager TEXT,
  requested_at TIMESTAMP DEFAULT NOW()
);

-- 브랜드 및 설정 (Settings) 테이블 스키마
CREATE TABLE settings (
  id TEXT PRIMARY KEY,
  org_name TEXT NOT NULL,
  slogan TEXT,
  logo_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);
