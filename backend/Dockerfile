# ----------- Builder Stage -----------
FROM node:18.19.0-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript into dist/
RUN npm run build

# ----------- Production Stage -----------
FROM node:18.19.0-alpine AS production

WORKDIR /app

# Copy only package.json files to install production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Use a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3001

# Start the compiled app
CMD ["node", "dist/server.js"]