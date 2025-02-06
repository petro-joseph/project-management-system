#!/bin/sh

# Wait for database to be ready
echo "Waiting for database to be ready..."
/usr/local/bin/wait-for-it.sh ${DB_HOST}:${DB_PORT}

# Run migrations
echo "Running database migrations..."
npm run migration:run

# Start the application
echo "Starting the application..."
exec npm start