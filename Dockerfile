# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install PostgreSQL client for wait-for-it script
RUN apk add --no-cache postgresql-client

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Make scripts executable
COPY scripts/docker-entrypoint.sh /usr/local/bin/
COPY scripts/wait-for-it.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/wait-for-it.sh

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]