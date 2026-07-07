#!/bin/sh
set -e

# Configuration
PROJECT_NAME="GameDock"
PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SERVICE_DIR="/etc/systemd/system"


# Helper functions
info() {
	echo "[INFO] $1"
}

error() {
	echo "[Error] $1"
	exit 1
}

# Root Check
if [ "$(id -u)" -ne 0 ]; then
	error "This script must be run with sudo or as root."
fi

APP_USER="${SUDO_USER-$(whoami)}"


echo "Installing from: $PROJECT_ROOT"

cd "$PROJECT_ROOT"

info "Setting project ownership..."
chown -R "$APP_USER:$APP_USER" "$PROJECT_ROOT"

# Install dependencies
info "Installing npm packages..."
sudo -u "$APP_USER" npm i

# Build workspaces
info "Building workspaces..."
sudo -u "$APP_USER" npm run build --workspaces


# Install services
info "Installing services..."

install_service() {
	TEMPLATE=$1
	SERVICE_NAME=$2

	sed \
		-e "s|{{PROJECT_DIR}}|$PROJECT_ROOT|g" \
		-e "s|{{APP_USER}}|$APP_USER|g" \
		"$TEMPLATE" \
		> "/etc/systemd/system/$SERVICE_NAME"
}


# Install gamedock update service
cp deploy/debian/scripts/update.sh "$PROJECT_ROOT/update.sh"
chmod +x "$PROJECT_ROOT/update.sh"

install_service \
    "deploy/debian/systemd/GameDock-update.template.service" \
    "GameDock-update.service"


# Install gamedock service
install_service \
	"deploy/debian/systemd/GameDock.template.service" \
	"GameDock.service"

info "Reloading daemon..."
systemctl daemon-reload

info "Enabling services..."
systemctl enable GameDock-update.service
systemctl enable GameDock.service

info "Restarting services..."
systemctl restart GameDock.service

info "Done."