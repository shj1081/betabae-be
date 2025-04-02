# Local Development Environment Setup

## Services

- Redis (port: 6379)
- MySQL (port: 3306)

## Quick Start

```bash
# Start services
docker-compose up -d

# Check services status
docker-compose ps

# Stop services
docker-compose down

# Stop services and drop volumes
docker-compose down -v
```

## Redis Test

```bash
# Connect to Redis CLI
docker exec -it redis redis-cli -a betabae

# Basic commands
ping
set test "Hello Redis"
get test
```

## MySQL Test

```bash
# Connect to MySQL
docker exec -it mysql mysql -u root -p

# Password: 1234
```
