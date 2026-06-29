FROM node:22-alpine AS builder

# Go to the app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Copy the rest of the app into the container
COPY tsconfig.json ./
COPY src ./src


# Build project
RUN npm run build


# Runtime stage
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Run the app
CMD ["npm", "run", "start"]

