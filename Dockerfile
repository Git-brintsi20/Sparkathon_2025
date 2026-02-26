FROM node:18-alpine

WORKDIR /app

# Copy backend package files
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy backend source
COPY backend/ ./backend/

# Expose port
EXPOSE 3000

# Start server
WORKDIR /app/backend
CMD ["node", "server.js"]
