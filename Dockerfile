# Multi-stage build for production
FROM node:18-alpine AS frontend-build

# Build frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Backend stage
FROM node:18-alpine AS backend

WORKDIR /app

# Copy backend files
COPY package*.json ./
COPY server.js ./
COPY final.csv ./

# Install backend dependencies
RUN npm ci --only=production

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./public

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Start server
CMD ["node", "server.js"]
