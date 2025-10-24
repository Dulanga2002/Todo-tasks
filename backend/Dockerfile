FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
# Use npm install --omit=dev instead of npm ci because a package-lock.json
# is not present in the build context; npm ci requires an existing lockfile.
# Also disable audit/funding messages to keep image build logs concise.
RUN npm install --omit=dev --no-audit --no-fund

# Copy application code
COPY . .

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start application
CMD ["npm", "start"]