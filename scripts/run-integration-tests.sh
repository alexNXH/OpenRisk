#!/bin/bash
# Integration test runner
# Usage: ./scripts/run-integration-tests.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🧪 Starting integration tests..."
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start test database
echo "📦 Starting test database..."
docker-compose up -d test_db
sleep 3

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
for i in {1..30}; do
    if docker exec openrisk_test_db pg_isready -U test > /dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start"
        docker-compose logs test_db
        exit 1
    fi
    sleep 1
done

# Run integration tests
echo ""
echo "🏃 Running integration tests..."
cd "$PROJECT_ROOT/backend"

export DATABASE_URL="postgres://test:test@localhost:5435/openrisk_test"
export APP_ENV=test

go test -v -tags=integration -coverprofile=coverage.out ./...

TEST_RESULT=$?

# Cleanup
echo ""
echo "🧹 Cleaning up..."
docker-compose down

if [ $TEST_RESULT -eq 0 ]; then
    echo ""
    echo "✅ All integration tests passed!"
    exit 0
else
    echo ""
    echo "❌ Integration tests failed"
    exit 1
fi
