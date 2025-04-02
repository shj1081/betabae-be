# Local Development Environment Setup

## Services

- Redis (port: 6379)
- MySQL (port: 3306)
- MinIO (port: 9000, 9001)

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

## MinIO Test

```bash
# web ui for minio
http://localhost:9001

# id: minioadmin
# pw: minioadmin
```

- check for betabae bucket
