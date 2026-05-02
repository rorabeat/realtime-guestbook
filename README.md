# 실시간 전자 방명록

Next.js + Supabase 기반 실시간 전자 방명록 웹앱입니다.

## 기능
- `/` 작성 페이지: 사진 업로드 또는 캔버스 그림 + 이름/메시지 등록
- `/board` 포스트잇 보드: 등록 글 실시간 반영
- 포스트잇 상세 모달: 큰 이미지 + 댓글 실시간 반영

## 실행 방법
1. 의존성 설치
```bash
npm install
```
2. 환경 변수 설정
```bash
cp .env.example .env.local
```
`.env.local`에 Supabase URL/Anon Key 입력

3. Supabase SQL 실행
- `supabase/schema.sql`을 SQL editor에서 실행
- Storage 버킷 `guestbook-images` 생성 확인

4. 개발 서버 실행
```bash
npm run dev
```
브라우저: `http://localhost:3000`

## Supabase 설정 포인트
- Realtime: `guestbook`, `comments` 테이블 publication 추가
- Storage: public 버킷 `guestbook-images`
- 테이블
  - `guestbook(id, created_at, author, content, image_url, image_type)`
  - `comments(id, created_at, guestbook_id, author, content)`
