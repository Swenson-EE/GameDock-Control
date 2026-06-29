# --- Base & Dependencies ---
FROM node:24 AS installer
WORKDIR /app
COPY package*.json ./
RUN npm ci

# --- Typescript Compiler ---
FROM installer AS builder
WORKDIR /app
COPY . .

# Compile TS into /dist folder
RUN npm run build

RUN npm prune --production

# --- Final Production Image ---
FROM node:24 AS runner
WORKDIR /app

# Run container as a non-root user for security
USER node

# Copy compiled JS code and slim node_modules from previous stages
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

# Expose the port the app will run on
ENV PORT=8080
EXPOSE 8080

# Development stage
FROM runner AS development

ENV NODE_ENV=development
CMD ["npm", "run", "dev"]


FROM runner AS production

ENV NODE_ENV=production
CMD ["npm", "start"]

