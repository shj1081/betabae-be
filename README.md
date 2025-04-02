# Betabae

## Project Structure

```
betabae/
├── app/
│   └── backend/          # NestJS backend server
│       ├── prisma/     # Prisma schema and migrations
│       ├── src/        # Source code
│       └── test/       # Test files
├── infra-dev/          # Development infrastructure setup
└── Makefile            # Project commands collection
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
git clone [repository-url]
cd betabae
```

2. Start Docker containers

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
