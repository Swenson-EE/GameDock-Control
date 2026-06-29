# --- Base & Dependencies ---
FROM node:24 AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src


# Expose the port the app will run on
ENV PORT=8080
EXPOSE 8080

# Development stage
FROM deps AS development

ENV NODE_ENV=development
CMD ["npm", "run","dev"]


FROM deps AS builder
# Compile TS into /dist folder
RUN npm run build
RUN npm prune --production

FROM builder AS production

# Run container as a non-root user for security
USER node

# Copy compiled JS code and slim node_modules from previous stages
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist

ENV NODE_ENV=production
CMD ["npm", "start"]

