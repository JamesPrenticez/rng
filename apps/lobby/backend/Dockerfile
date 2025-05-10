# Stage 1: Install production dependencies for backend
FROM node:18-alpine AS installer
WORKDIR /app

# Copy only the necessary package.json and package-lock.json from the built dist folder
COPY dist/apps/selfregulator/backend/package*.json ./

# Install only production dependencies
RUN npm install --production

# Stage 2: Create the production image
FROM node:18-alpine
WORKDIR /app

# Copy the built backend files from local machine
COPY dist/apps/selfregulator/backend /app

# Copy the installed node_modules from the installer stage
COPY --from=installer /app/node_modules /app/node_modules

# Start the Express app
CMD ["node", "main.js"]
