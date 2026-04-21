# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies and build backend
RUN cd backend && npm ci && npm run build

# Runtime stage
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json from backend
COPY backend/package*.json ./backend/

# Install production dependencies only
RUN cd backend && npm ci --production

# Copy built application from builder
COPY --from=builder /app/backend/dist ./backend/dist

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "backend/dist/main.js"]
