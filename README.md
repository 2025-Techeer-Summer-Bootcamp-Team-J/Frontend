# Frontend

이 프로젝트는 React와 Vite를 기반으로 한 프론트엔드 애플리케이션입니다.

## 개발 시작하기

### 로컬 개발 환경

1. 의존성 설치

```bash
npm install
```

2. 개발 서버 실행

```bash
npm run dev
```

### Docker를 사용한 실행

#### 프로덕션 환경 실행
```bash
docker compose up
```

백그라운드에서 실행:
```bash
docker compose up -d
```

#### 서비스 중지
```bash
docker compose down
```

## 빌드

### 로컬 빌드
```bash
npm run build
```

### Docker 빌드
```bash
docker compose build
```

## 접속 방법

- **로컬 개발 서버**: `http://localhost:5173`
- **Docker 실행(프로덕션)**: `http://localhost:3000`

## 주요 폴더 구조
- src: 소스 코드
- public: 정적 파일

## Docker 파일 설명
- `Dockerfile`: 프로덕션 빌드용 (Nginx 서빙)
- `docker-compose.yml`: Docker Compose 설정
- `nginx.conf`: Nginx 설정 파일

---
