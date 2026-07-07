# GameDock Control

GameDock Control is a self-hosted control plane for managing dedicated game servers. It combines a REST API, web interface, and Discord bot into a single platform capable of deploying and managing Docker-based game servers on Linux.

Designed around a modular architecture, GameDock Control separates the management layer from individual game services, making it easy to add support for additional games over time.

This started as a project to host game servers for friends and I and allow it to be managed through Discord.

> **Project Status:** Active Development

---

## Features

- Manage dedicated game servers
- Docker-based server deployment
- Fastify REST API
- Web frontend
- Discord bot integration
- Automated Debian installation
- systemd service management
- npm workspace monorepo
- Modular service architecture

---

## Repository Structure

```text
GameDock-Control
├── apps
│   ├── backend        # Fastify API
│   ├── frontend       # Vite web interface
│   └── discord-bot    # Discord integration
│
├── services
│   └── palworld       # Palworld service definition
│
├── infrastructure
│   └── docker         # Development and production Compose files
│
├── deploy
│   └── debian         # Installation scripts and systemd services
│
└── package.json       # npm workspace configuration
```

---

## Architecture

```text
                    Browser
                       │
                       ▼
                Frontend (Vite)
                       │
             REST API (Fastify)
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
   Docker Engine   Discord Bot   Service Manager
        │
        ▼
  Dedicated Game Servers
```

The backend acts as the central coordinator for the platform. Both the frontend and Discord bot communicate with the backend, which manages Docker containers and game server lifecycles.

---

## Supported Services

Current services include:

- Palworld

The service architecture is designed to be extensible, allowing additional games to be added without significant changes to the backend.

---

## Requirements

- Linux (Debian recommended)
- Docker
- Docker Compose
- Node.js
- npm
- systemd

---

## Installation

Clone the repository.

```bash
git clone https://github.com/Swenson-EE/GameDock-Control.git
cd GameDock-Control
```

Run the Debian installer.

```bash
sudo ./deploy/debian/install.sh
```

The installer configures the application, installs the required systemd services, and prepares GameDock Control for production.

---

## Development

Install dependencies for all workspaces.

```bash
npm install
```

Start the development environment.

```bash
npm run dev
```

Build all applications.

```bash
npm run build
```

Start the production applications.

```bash
npm start
```

---

## Applications

### Backend

The backend provides the REST API responsible for:

- Docker container management
- Service lifecycle control
- Health monitoring
- Status reporting
- Communication with game services

---

### Frontend

_UNDER DEVELOPMENT_
The frontend provides a browser-based interface for:

- Viewing installed servers
- Starting and stopping services
- Monitoring server status
- Managing GameDock deployments

---

### Discord Bot

The Discord bot allows administrators to manage servers without leaving Discord.

Example functionality includes:

- Starting servers
- Stopping servers
- Restarting servers
- Viewing server status

---

## Services

Each supported game exists as an independent service under the `services` directory.

A service typically contains:

- Docker Compose configuration
- Environment configuration
- Startup scripts
- Game-specific assets

This separation allows new games to be added with minimal changes to the rest of the application.

---

## Infrastructure

Development and production Docker Compose files are located under:

```text
infrastructure/docker/
```

These compose files provide a consistent deployment environment for all GameDock Control applications.

---

## Technologies

- TypeScript
- Fastify
- Vite
- Discord.js
- Docker
- Docker Compose
- Node.js

---

## Roadmap

Planned features include:

- Additional supported game servers
- Scheduled server operations
- Automatic updates
- Backup and restore support
- Metrics and monitoring
- Server console access

---

## Contributing

Contributions, feature requests, and bug reports are welcome.

If you're planning a significant change, please open an issue first to discuss the proposed implementation.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
