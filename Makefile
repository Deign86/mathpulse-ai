# MathPulse AI - Makefile
# Convenient shortcuts for Docker and development commands

.PHONY: help build up down logs restart clean dev prod shell-frontend shell-backend test

# Default target
help:
	@echo "MathPulse AI - Docker Commands"
	@echo "=============================="
	@echo ""
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  build          Build all Docker images"
	@echo "  up             Start all services (production)"
	@echo "  dev            Start all services (development with hot-reload)"
	@echo "  down           Stop all services"
	@echo "  restart        Restart all services"
	@echo "  logs           View logs for all services"
	@echo "  logs-f         Follow logs in real-time"
	@echo "  clean          Remove all containers, images, and volumes"
	@echo "  shell-frontend Open shell in frontend container"
	@echo "  shell-backend  Open shell in backend container"
	@echo "  status         Show container status"
	@echo ""

# Build all images
build:
	docker-compose build

# Build without cache
build-fresh:
	docker-compose build --no-cache

# Start production services
up:
	docker-compose up -d
	@echo ""
	@echo "✅ MathPulse AI is running!"
	@echo "   Frontend: http://localhost:3000"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"

# Start with logs visible
up-logs:
	docker-compose up

# Start development services
dev:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo ""
	@echo "✅ MathPulse AI (Dev Mode) is running!"
	@echo "   Frontend: http://localhost:5173"
	@echo "   Backend:  http://localhost:8000"
	@echo "   API Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Hot-reload is enabled for both frontend and backend."

# Start development with logs
dev-logs:
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Stop all services
down:
	docker-compose down
	@echo "✅ All services stopped."

# Stop and remove volumes
down-clean:
	docker-compose down -v
	@echo "✅ All services and volumes removed."

# Restart all services
restart:
	docker-compose restart
	@echo "✅ All services restarted."

# View logs
logs:
	docker-compose logs

# Follow logs
logs-f:
	docker-compose logs -f

# Logs for specific services
logs-frontend:
	docker-compose logs -f frontend

logs-backend:
	docker-compose logs -f backend

# Show status
status:
	docker-compose ps

# Clean everything
clean:
	docker-compose down -v --rmi all
	docker system prune -f
	@echo "✅ Cleanup complete."

# Open shell in frontend container
shell-frontend:
	docker-compose exec frontend sh

# Open shell in backend container
shell-backend:
	docker-compose exec backend bash

# Rebuild and restart a specific service
rebuild-frontend:
	docker-compose up -d --build frontend

rebuild-backend:
	docker-compose up -d --build backend

# Health check
health:
	@echo "Checking service health..."
	@curl -s http://localhost:3000/health && echo " Frontend: OK" || echo " Frontend: FAIL"
	@curl -s http://localhost:8000/health && echo " Backend: OK" || echo " Backend: FAIL"

# Install local dependencies (without Docker)
install:
	npm ci --legacy-peer-deps
	cd backend && pip install -r requirements.txt

# Run locally (without Docker)
local-frontend:
	npm run dev

local-backend:
	cd backend && uvicorn main:app --reload --port 8000
