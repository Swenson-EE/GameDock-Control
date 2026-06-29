FROM node:24 AS deps
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Expose the port the app will run on



FROM deps AS development

# Vite utilizes 5173 for development
EXPOSE 5173     

CMD ["npm", "run", "dev"]


FROM deps AS production

# Install a static file server globally
RUN npm install -g serve

# Compile TS and build static production assets into /dist
RUN npm run build

EXPOSE 3400

# Run the production build folder on port 3000, listening on all interfaces
CMD ["serve", "-s", "dist", "-l", "3400"]
