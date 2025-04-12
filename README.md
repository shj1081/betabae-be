# Betabae

## Tech Stacks

- Backend: NestJS (TypeScript)
- Database: MySQL (Prisma ORM)
- Infrastructure: Redis, S3/MinIO, Docker, Docker Compose

## Project Structure

```
betabae/
├── .github/                  # GitHub configuration files
│
├── app/
│   └── backend/              # NestJS backend application
│       ├── src/              # Source code
│       │   ├── dto/          # Data Transfer Objects
│       │   ├── enums/        # Enumeration definitions
│       │   ├── filters/      # Exception filters
│       │   ├── infra/        # Infrastructure services
│       │   ├── middleware/   # Application middleware
│       │   ├── modules/      # Feature modules
│       │   ├── app.module.ts # Main application module
│       │   └── main.ts       # Application entry point
│       └── test/             # End-to-end tests
│
├── infra-dev/                # Local development infrastructure
│   ├── docker-compose.yaml   # Docker Compose configuration
│   └── redis.conf            # Redis configuration
│
└── Makefile                  # Convenience commands
```

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

2. Start Docker containers for MySQL, Redis and MinIO

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
- `fast-setup`: Setup local environment in oneshot command (for first run)
