@echo off
REM MathPulse AI - Docker Commands for Windows
REM Usage: docker-run.bat [command]

if "%1"=="" goto help
if "%1"=="help" goto help
if "%1"=="build" goto build
if "%1"=="up" goto up
if "%1"=="dev" goto dev
if "%1"=="down" goto down
if "%1"=="logs" goto logs
if "%1"=="restart" goto restart
if "%1"=="clean" goto clean
if "%1"=="status" goto status
if "%1"=="health" goto health
goto help

:help
echo.
echo MathPulse AI - Docker Commands
echo ==============================
echo.
echo Usage: docker-run.bat [command]
echo.
echo Commands:
echo   build     Build all Docker images
echo   up        Start all services (production)
echo   dev       Start all services (development with hot-reload)
echo   down      Stop all services
echo   logs      View logs for all services
echo   restart   Restart all services
echo   clean     Remove all containers and volumes
echo   status    Show container status
echo   health    Check service health
echo.
goto end

:build
echo Building Docker images...
docker-compose -f docker-compose.yml build
goto end

:up
echo Starting MathPulse AI (Production)...
docker-compose -f docker-compose.yml up -d
echo.
echo ✅ MathPulse AI is running!
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
goto end

:dev
echo Starting MathPulse AI (Development with hot-reload)...
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
echo.
echo ✅ MathPulse AI (Dev Mode) is running!
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo Hot-reload is enabled for both frontend and backend.
goto end

:down
echo Stopping all services...
docker-compose -f docker-compose.yml down
echo ✅ All services stopped.
goto end

:logs
docker-compose -f docker-compose.yml logs -f
goto end

:restart
echo Restarting all services...
docker-compose -f docker-compose.yml restart
echo ✅ All services restarted.
goto end

:clean
echo Cleaning up Docker resources...
docker-compose -f docker-compose.yml down -v
docker system prune -f
echo ✅ Cleanup complete.
goto end

:status
docker-compose -f docker-compose.yml ps
goto end

:health
echo Checking service health...
curl -s http://localhost:3000/health >nul 2>&1 && echo Frontend: OK || echo Frontend: FAIL
curl -s http://localhost:8000/health >nul 2>&1 && echo Backend: OK || echo Backend: FAIL
goto end

:end
