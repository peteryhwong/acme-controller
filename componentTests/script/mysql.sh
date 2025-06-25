#!/bin/bash
set -e

# Start MySQL service
docker-compose up -d mysql

# Wait for MySQL to start
echo "Waiting for MySQL to start..."

# Retry until MySQL is running
sleep 5
until docker-compose exec mysql mysqladmin -u root -pdummy ping | grep alive; do
  echo "MySQL is not yet running. Retrying in 3 seconds..."
  sleep 3
done

echo "MySQL is running!"

echo "Wait another 2 seconds"
sleep 2
