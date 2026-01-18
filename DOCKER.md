# MathPulse AI - Docker Setup Guide

This guide helps you run MathPulse AI using Docker for consistent development environments.

## 📋 Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (to clone the repository)

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd "MathPulse Prototype"

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment (Optional)

Edit `.env` file if you need to customize:
- `HF_TOKEN` - Your Hugging Face API token (for AI features)
- Firebase configuration (already set in code, but can override)

### 3. Run with Docker Compose

**Production Mode** (optimized build):
```bash
docker-compose up --build
```

**Development Mode** (with hot-reload):
```bash
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

### 4. Access the Application

| Service  | URL                    | Description          |
|----------|------------------------|----------------------|
| Frontend | http://localhost:3000  | React application    |
| Backend  | http://localhost:8000  | FastAPI server       |
| API Docs | http://localhost:8000/docs | Swagger UI        |

For development mode:
| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:8000  |

---

## 🛠️ Common Commands

### Starting Services

```bash
# Start all services in background
docker-compose up -d

# Start with logs visible
docker-compose up

# Rebuild and start (after code changes)
docker-compose up --build
```

### Stopping Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Viewing Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs frontend
docker-compose logs backend

# Follow logs in real-time
docker-compose logs -f
```

### Rebuilding

```bash
# Rebuild a specific service
docker-compose build frontend
docker-compose build backend

# Rebuild everything from scratch (no cache)
docker-compose build --no-cache
```

---

## 📁 Project Structure

```
MathPulse Prototype/
├── Dockerfile              # Frontend production build
├── Dockerfile.dev          # Frontend development build
├── docker-compose.yml      # Main compose configuration
├── docker-compose.dev.yml  # Development override
├── nginx.conf              # Nginx configuration for production
├── .dockerignore           # Files excluded from Docker build
├── .env.example            # Environment template
├── backend/
│   ├── Dockerfile          # Backend build
│   └── .dockerignore       # Backend Docker exclusions
└── src/                    # Frontend source code
```

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :8000

# Or change ports in docker-compose.yml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Container Won't Start

```bash
# Check container logs
docker-compose logs backend

# Check container status
docker-compose ps

# Restart a specific service
docker-compose restart backend
```

### Build Failures

```bash
# Clean Docker build cache
docker builder prune

# Remove all unused images
docker image prune -a

# Full cleanup (use with caution)
docker system prune -a
```

### "Module not found" Errors

```bash
# Rebuild without cache
docker-compose build --no-cache

# Remove node_modules volume and rebuild
docker-compose down -v
docker-compose up --build
```

---

## 🌐 Environment Configuration

### For Local Development

```env
VITE_API_URL=http://localhost:8000
```

### For Docker Internal Communication

When frontend needs to communicate with backend inside Docker network:
```env
VITE_API_URL=http://backend:7860
```

### For Production

```env
VITE_API_URL=https://your-api-domain.com
```

---

## 🐳 Individual Container Commands

### Frontend Only

```bash
# Build frontend image
docker build -t mathpulse-frontend .

# Run frontend container
docker run -p 3000:80 mathpulse-frontend
```

### Backend Only

```bash
# Build backend image
docker build -t mathpulse-backend ./backend

# Run backend container
docker run -p 8000:7860 mathpulse-backend
```

---

## ✅ Health Checks

Both services include health checks:

- **Frontend**: `http://localhost:3000/health`
- **Backend**: `http://localhost:8000/health`

Check health status:
```bash
docker-compose ps
# Look for (healthy) status
```

---

## 🔐 Security Notes

1. **Never commit `.env` files** - They contain secrets
2. **Use `.env.example`** as a template
3. **In production**, use Docker secrets or environment injection
4. **Firebase credentials** are safe in client-side code (restricted by Firebase rules)

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review container logs: `docker-compose logs`
3. Ensure Docker Desktop is running
4. Try a clean rebuild: `docker-compose down -v && docker-compose up --build`

---

Happy coding! 🎉
