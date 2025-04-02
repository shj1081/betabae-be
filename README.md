# Betabae

## Project Structure

```
betabae/
├── .github/                        # GitHub configuration files
│   ├── ISSUE_TEMPLATE
│   └── pull_request_template.md
│
├── app/
│   └── backend/                    # NestJS backend app
│       ├── dist/                   # Compiled output
│       ├── node_modules/           # Dependencies
│       ├── src/
│       │   ├── dto/                # Data Transfer Objects
│       │   │   ├── auth/
│       │   │   └── common/
│       │   │
│       │   ├── enums/              # Enumeration definitions
│       │   │
│       │   ├── infra/              # Infrastructure services
│       │   │   ├── prisma/         # Prisma ORM configuration
│       │   │   ├── redis/          # Redis configuration
│       │   │   └── s3/             # S3/MinIO configuration
│       │   │
│       │   ├── middleware/         # Application middleware
│       │   │   └── logging.middleware.ts
│       │   │
│       │   ├── modules/            # Feature modules
│       │   │   └── auth/           # Authentication module
│       │   │
│       │   ├── app.module.ts       # Main application module
│       │   └── main.ts             # Application entry point
│       │
│       ├── test/                   # End-to-end tests
│       ├── .env                    # Environment variables
│       ├── .prettierrc             # Prettier configuration
│       ├── eslint.config.mjs       # ESLint configuration
│       ├── nest-cli.json           # NestJS CLI configuration
│       ├── package.json            # Project dependencies and scripts
│       ├── README.md               # Backend-specific documentation
│       ├── tsconfig.build.json     # TypeScript build configuration
│       ├── tsconfig.json           # TypeScript configuration
│       └── yarn.lock               # Yarn lock file
│
├── infra-dev/                      # Local development infrastructure
│   ├── docker-compose.yaml         # Docker Compose configuration
│   ├── redis.conf                  # Redis configuration
│   └── README.md                   # Infrastructure documentation
│
├── Makefile                        # Root-level Makefile for convenience commands
├── .gitignore                      # Root Git ignore file
└── README.md                       # Project documentation
```

## Tech Stacks

- Backend: NestJS (TypeScript)
- Database: MySQL (Prisma ORM)
- Infrastructure: Redis, S3/MinIO, Docker, Docker Compose

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
