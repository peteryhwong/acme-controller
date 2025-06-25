#!/bin/bash
set -e

echo "Test docker image $DOCKER_IMAGE"

# Get the directory of the script
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Clean up"
docker compose down --remove-orphans -t0

echo "Run and check mock"
docker compose up -d mock
docker compose up wait-for-mock

echo "Build test case image"
docker compose build test

echo "Run and check mysql"
sh $SCRIPT_DIR/mysql.sh

echo "Run migration"
docker compose up migration

echo "Run service"
docker compose up -d

echo "Run test"
docker compose run --rm test npm t

echo "Tear down"
# do not remove image if it is env var DISABLE_RMI is true
if [ "$DISABLE_RMI" != "true" ]; then
    docker compose down -t0 --rmi all
else
    docker compose down -t0
fi
