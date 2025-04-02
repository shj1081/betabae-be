# Betabae

## Project Structure

```
betabae/
├── Makefile                        # Root-level: CLI helper commands
├── README.md                       # Project documentation
├── .gitignore
│
├── infra-dev/                      # Local development infrastructure
│   ├── docker-compose.yaml
│   ├── redis.conf
│   └── README.md
│
└── app/
    └── backend/                    # NestJS backend app
        ├── .env
        ├── .prettierrc
        ├── eslint.config.mjs
        ├── nest-cli.json
        ├── package.json
        ├── tsconfig.json
        ├── tsconfig.build.json
        ├── yarn.lock
        ├── README.md               # Backend-specific README
        │
        ├── test/
        │   ├── app.e2e-spec.ts
        │   └── jest-e2e.json
        │
        ├── src/
        │   ├── main.ts
        │   ├── app.module.ts
        │
        │   ├── modules/
        │   │   └── auth/
        │   │       ├── auth.controller.ts
        │   │       ├── auth.service.ts
        │   │       └── auth.module.ts
        │
        │   ├── infra/
        │   │   ├── prisma/
        │   │   │   ├── schema.prisma
        │   │   │   ├── migrations/
        │   │   │   ├── prisma.module.ts
        │   │   │   └── prisma.service.ts
        │   │   └── redis/
        │   │       ├── redis.module.ts
        │   │       └── redis.service.ts
        │
        │   ├── dto/
        │   │   ├── auth/
        │   │   │   ├── login.request.dto.ts
        │   │   │   └── register.request.dto.ts
        │   │   └── common/
        │   │       ├── basic.response.dto.ts
        │   │       └── error.response.dto.ts
        │
        │   ├── enums/
        │   │   └── custom.exception.code.ts
        │
        │   └── (optional: common/, interceptors/, guards/, etc.)
```

## Tech Stacks

- Backend: NestJS (TypeScript)
- Database: MySQL (Prisma ORM)
- Infrastructure: Redis, Docker, Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js
- Yarn

## Local Development Environment Setup

1. Clone

```bash
git clone https://github.com/shj1081/betabae-be
cd betabae
```

2. Start Docker containers for mysql and redis

```bash
make up
```

3. Install backend dependencies

```bash
make install
```

4. Prisma setup

```bash
make prisma-generate
make prisma-migrate
```

5. Start development server

```bash
make dev
```

## Make Commands for Development

### Docker Infrastructure Commands

- `make up`: Start Docker containers
- `make down`: Stop Docker containers
- `make down-v`: Stop Docker containers and remove volumes
- `make reset`: Restart Docker containers (remove volumes and restart)

### Backend Development

- `make install`: Install backend dependencies
- `make dev`: Run local development server (watch mode)
- `make build`: Build backend

### Prisma Commands

- `make prisma-generate`: Generate Prisma client
- `make prisma-migrate`: Run database migrations

### Utility Commands

- `make clean`: Clean up project (remove Docker volumes, build files, node_modules)
- `fast-setup`: Setup local Environment in oneshot cmd
