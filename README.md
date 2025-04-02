# Betabae

## Project Structure

```
betabae/
├── app/
│   └── backend/         # NestJS 백엔드 서버
│       ├── prisma/      # Prisma 스키마 및 마이그레이션
│       ├── src/         # 소스 코드
│       └── test/        # 테스트 파일
├── infra-dev/          # 개발 환경 인프라 설정
└── Makefile           # 프로젝트 명령어 모음
```

## Tech Stacks

- Backend: NestJS (TypeScript)
- Database: Mysql (Prisma ORM)
- Infrastructure: Redis, Docker, Docker Compose

## Prerequisites

- Docker 및 Docker Compose
- Node.js
- Yarn

## Local Development Environment Setup

1. 저장소 클론

```bash
git clone [repository-url]
cd betabae
```

2. 도커 컨테이너 실행

```bash
make up
```

3. 백엔드 의존성 설치

```bash
make install
```

4. Prisma 설정

```bash
make prisma-generate
make prisma-migrate
```

5. 개발 서버 실행

```bash
make dev
```

## Make commands for Development

### Docker for infra 관련

- `make up`: 도커 컨테이너 실행
- `make down`: 도커 컨테이너 중지
- `make down-v`: 도커 컨테이너 중지 및 볼륨 삭제
- `make reset`: 도커 컨테이너 재시작 (볼륨 삭제 후 재시작)

### 백엔드 개발

- `make install`: 백엔드 의존성 설치
- `make dev`: 개발 서버 local 실행 (watch 모드)
- `make build`: 백엔드 빌드

### Prisma

- `make prisma-generate`: Prisma 클라이언트 생성
- `make prisma-migrate`: 데이터베이스 마이그레이션 실행

### 기타

- `make clean`: 프로젝트 클린업 (도커 볼륨, 빌드 파일, node_modules 삭제)
