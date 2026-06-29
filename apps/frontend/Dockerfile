FROM node:24
WORKDIR /app

# Install a static file server globally
RUN npm install -g serve

# Copy dependency manifests first
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

# Compile TS and build static production assets into /dist
RUN npm run build

# Expose the port the app will run on
EXPOSE 3400

# Run the production build folder on port 3000, listening on all interfaces
CMD ["serve", "-s", "dist", "-l", "3400"]
