#!/bin/bash

# Navigate to repo
cd "$(dirname "$0")"

echo "=== Starting GameDock Boot Deployment Check: $(date) ==="

# Fetch latest changes
git fetch origin

# Check if there are remote changes to pull
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)

if [ "$LOCAL" != "$REMOTE" ]; then
    echo "Changes detected. Pulling changes..."
    git pull

    echo "Running npm install..."
    npm i

    echo "Running npm build..."
    npm run build --workspaces

    echo "Deployment completed successfully."
else
    echo "No changes detected. Repository is up to date."
fi
