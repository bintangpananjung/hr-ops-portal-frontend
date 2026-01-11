# HR OPS PORTAL - Frontend

A comprehensive HR operations portal frontend for managing Work From Home (WFH) attendance and HR monitoring.

## Purpose

The HR OPS PORTAL frontend provides a modern, responsive interface for:

- WFH attendance tracking and management
- Employee monitoring dashboard
- HR operations reporting
- Real-time attendance analytics

## Prerequisites

- Docker
- Docker Compose
- Backend setup: Follow the [backend setup instructions](https://github.com/bintangpananjung/hr-ops-portal-backend/blob/main/README.md)

## Development Setup

### 1. Network Setup (One-time setup)

```bash
docker network create hr-ops-portal-network
```

### 2. Environment Setup

```bash
cp .env.example .env
```

### 3. Start Development Environment

```bash
docker compose up -d
```

### 4. Access the Application

Navigate to: http://localhost:5173

**Note**: The backend API should be running on http://localhost:8000 for the frontend to function properly.

## API Documentation

The frontend communicates with the backend API. Refer to the backend documentation for API details:

- **Swagger UI**: http://localhost:8000/docs
- **OpenAPI JSON**: http://localhost:8000/api-json

## Important Development Guidelines

**Always run everything in the Docker environment.** This includes:

- Package installation: `docker exec -it hr-ops-portal-frontend-dev sh -c "pnpm install <package>"`
- Running scripts: `docker exec -it hr-ops-portal-frontend-dev sh -c "pnpm run <script>"`
- Building: `docker exec -it hr-ops-portal-frontend-dev sh -c "pnpm run build"`

## Troubleshooting

### Common Issues

1. **Container won't start**

   - Check if Docker is running: `docker --version`
   - Verify the network exists: `docker network ls | grep hr-ops-portal-network`
   - If network doesn't exist, run the one-time setup command above

2. **Backend API connection issues**

   - Ensure the backend container is running: `docker compose ps`
   - Verify API URL in `.env` file matches backend address
   - Check backend logs: `docker compose logs hr-ops-portal-backend-dev`

3. **Port conflicts**

   - Check if port 5173 is in use: `lsof -i :5173`
   - Stop conflicting services or modify the port in docker-compose.yml

4. **Build errors**
   - Check container logs: `docker compose logs hr-ops-portal-frontend-dev`
   - Verify environment variables in `.env`
   - Ensure all dependencies are installed in the container

### Getting Help

If you encounter issues not covered above:

1. Check container logs: `docker compose logs hr-ops-portal-frontend-dev`
2. Verify environment variables in `.env`
3. Ensure all required services are running: `docker compose ps`
4. Restart services: `docker compose down && docker compose up -d`

## Architecture

This frontend is built with:

- **React** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Docker** - Containerization for consistent development environment
