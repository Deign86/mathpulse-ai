# MathPulse AI - Educational Learning Platform

> An AI-powered mathematics learning platform designed to help teachers monitor student progress and provide personalized intervention strategies.

[![Live Demo](https://img.shields.io/badge/Live-mathpulse--ai.vercel.app-00C853?logo=vercel)](https://mathpulse-ai.vercel.app)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](DOCKER.md)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python)](https://python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Hugging Face](https://img.shields.io/badge/HuggingFace-Spaces-FFD21E?logo=huggingface)](https://huggingface.co/)

## 🌐 Live Deployment

| Component | URL | Platform |
|-----------|-----|----------|
| **Frontend** | https://mathpulse-ai.vercel.app | Vercel |
| **Backend API** | https://deign86-mathpulse-api.hf.space | Hugging Face Spaces |
| **Database** | Firebase Firestore | Google Cloud |

### Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | `prof.anderson@school.edu` | `demo123` |
| Student | `alex.johnson@school.edu` | `demo123` |
| Admin | `admin@mathpulse.edu` | `demo123` |

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [ML Backend Setup](#ml-backend-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Component Documentation](#component-documentation)

---

## Overview

MathPulse AI is a full-stack educational learning management system that leverages AI to:
- Monitor student engagement and performance in real-time
- Identify at-risk students through ML-powered risk classification
- Generate personalized intervention plans and learning paths
- Provide interactive learning modules with gamification
- Enable comprehensive teacher dashboard analytics
- Support real-time announcements and classroom management

**Figma Design:** [High-Fidelity UI Design](https://www.figma.com/design/ExniW5RHSJPtb6kxW0pefy/High-Fidelity-UI-Design)

---

## Features

### 👨‍🏫 Teacher Dashboard
- **Student Risk Monitoring** - View students categorized by risk levels (High/Medium/Low) with color-coded indicators
- **AI-Generated Intervention Plans** - Personalized remedial paths with step-by-step learning activities
- **Live Classroom Pulse** - Real-time activity feed of student actions
- **Analytics Dashboard** - Interactive charts (pie, bar) for class performance with date range filters
- **Daily AI Insights** - Automated analysis of class trends and focus areas
- **Classroom Management** - Switch between multiple classrooms/sections seamlessly
- **External Link Validation** - Review and approve AI-recommended learning resources before students access them
- **Announcements System** - Send targeted announcements to classrooms or all students
- **Smart File Import** - Upload CSV/Excel/PDF class records with AI-powered column detection
- **Export & Print Materials** - Generate personalized worksheets and study guides (PDF)
- **Edit Class Records** - In-app editing of student data with Firebase persistence

### 👨‍🎓 Student View
- **Interactive Learning Modules** - Videos, quizzes, and exercises with progress tracking
- **AI Chat Tutor** - Conversational math help powered by Qwen LLM via Hugging Face
- **Gamification System** - XP points, levels (1-50), daily streaks, and 12+ achievements
- **Progress Dashboard** - Circular progress indicators and module completion tracking
- **Real-time Announcements** - Receive teacher announcements instantly
- **Profile Customization** - Avatar selection with DiceBear integration

### 🔐 Admin Panel
- **User Management** - Create, edit, suspend users across all roles
- **System Analytics** - Platform-wide metrics and usage statistics
- **Content Management** - Module templates and curriculum management
- **Audit Logging** - Track all system actions with severity levels
- **System Settings** - Configure maintenance mode, session timeouts, feature flags

### 🤖 ML-Powered Features (Python Backend)
- **AI Math Tutor** - Conversational AI using Qwen/Qwen2.5-3B-Instruct
- **Risk Prediction** - Zero-shot classification using facebook/bart-large-mnli
- **Learning Path Generation** - Personalized module recommendations based on weaknesses
- **Class Analytics** - Daily insights with trend detection (up/down indicators)
- **Smart Document Parsing** - AI-powered extraction from CSV, Excel, PDF, DOCX files
- **Course Material Analysis** - Topic detection and curriculum mapping

### 🔥 Firebase Integration
- **Authentication** - Email/password login with role-based access
- **Firestore Database** - Real-time data sync for students, activities, announcements
- **Chat Persistence** - Conversation history saved per user
- **Progress Tracking** - XP, achievements, and streaks persisted across sessions
- **Activity Logging** - Real-time classroom activity feeds

---

## Tech Stack

### Frontend
| Category | Technologies |
|----------|-------------|
| **Framework** | React 18.3.1 with TypeScript 5.x |
| **Build Tool** | Vite 5.x |
| **Styling** | Tailwind CSS 3.x with custom design tokens |
| **UI Components** | Radix UI Primitives, shadcn/ui (40+ components) |
| **Charts** | Recharts (PieChart, BarChart, ResponsiveContainer) |
| **Icons** | Lucide React |
| **Forms** | React Hook Form with Zod validation |
| **PDF Generation** | jsPDF + html2canvas |
| **Notifications** | Sonner (toast notifications) |

### Backend
| Category | Technologies |
|----------|-------------|
| **Framework** | FastAPI 0.109 (Python 3.11) |
| **ML Inference** | Hugging Face Inference API |
| **LLM Model** | Qwen/Qwen2.5-3B-Instruct |
| **Classification** | facebook/bart-large-mnli (zero-shot) |
| **Document Parsing** | pandas, openpyxl, pdfplumber, python-docx |
| **Server** | Uvicorn (ASGI) |
| **CORS** | FastAPI CORSMiddleware |

### Infrastructure
| Category | Technologies |
|----------|-------------|
| **Frontend Hosting** | Vercel (automatic deployments) |
| **Backend Hosting** | Hugging Face Spaces (Docker) |
| **Database** | Firebase Firestore (NoSQL, real-time) |
| **Authentication** | Firebase Auth |
| **CDN/Assets** | Vercel Edge Network |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    React Frontend (Vercel)                           │   │
│  │                  mathpulse-ai.vercel.app                            │   │
│  │                                                                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │ TeacherDash  │  │ StudentView  │  │  AdminPanel  │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  │           │                │                │                        │   │
│  │           └────────────────┴────────────────┘                        │   │
│  │                            │                                         │   │
│  │              ┌─────────────┴─────────────┐                          │   │
│  │              │     API Service Layer      │                          │   │
│  │              │    (src/services/api.ts)   │                          │   │
│  │              └─────────────┬─────────────┘                          │   │
│  └────────────────────────────┼────────────────────────────────────────┘   │
└───────────────────────────────┼────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐    ┌─────────────────────┐    ┌──────────────┐
│   Firebase    │    │   FastAPI Backend   │    │   Hugging    │
│   Firestore   │    │   (HF Spaces)       │    │   Face API   │
│               │    │                     │    │              │
│ • Students    │    │ • /api/chat         │    │ • Qwen LLM   │
│ • Activities  │    │ • /api/predict-risk │    │ • BART MNLI  │
│ • Chat History│    │ • /api/learning-path│    │              │
│ • Progress    │    │ • /api/upload/*     │    │              │
│ • Achievements│    │ • /api/analytics/*  │    │              │
│ • Announce.   │    │                     │    │              │
└───────────────┘    └─────────────────────┘    └──────────────┘
```

---

## Project Structure

```
MathPulse Prototype/
├── 📄 index.html                    # HTML entry point
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.ts                # Vite configuration
├── 📄 firebase.json                 # Firebase hosting config
├── 📄 firestore.rules               # Firestore security rules
├── 📄 vercel.json                   # Vercel deployment config
├── 📄 README.md                     # Project documentation
├── 📄 DOCKER.md                     # Docker setup guide
│
├── 🐳 Docker Configuration
├── 📄 Dockerfile                    # Frontend production build
├── 📄 Dockerfile.dev                # Frontend development build
├── 📄 docker-compose.yml            # Main Docker orchestration
├── 📄 docker-compose.dev.yml        # Development override (hot-reload)
├── 📄 nginx.conf                    # Nginx config for production
├── 📄 .dockerignore                 # Docker build exclusions
├── 📄 docker-run.bat                # Windows helper script
├── 📄 Makefile                      # Unix/Mac helper commands
│
├── 📁 backend/                      # Python ML Backend (HF Spaces)
│   ├── 📄 main.py                   # FastAPI application (387 lines)
│   ├── 📄 config.py                 # Configuration management
│   ├── 📄 models.py                 # Pydantic request/response models
│   ├── 📄 requirements.txt          # Python dependencies
│   ├── 📄 Dockerfile                # Backend Docker build
│   ├── 📄 .dockerignore             # Backend Docker exclusions
│   ├── 📄 .env.example              # Environment template
│   ├── 📄 run.bat                   # Windows startup script
│   └── 📁 services/
│       ├── 📄 ml_services.py        # AI/ML services (HF Inference)
│       └── 📄 document_parser.py    # Smart file parsing (CSV, Excel, PDF)
│
├── 📁 .github/                      # GitHub configuration
│   └── 📄 copilot-instructions.md   # AI coding assistant guidelines
│
├── 📁 scripts/                      # Utility scripts
│   └── 📄 injectFirebaseData.mjs    # Seed Firebase with mock data
│
├── 📁 test_data/                    # Sample files for testing uploads
│   ├── 📄 sample_grades.csv
│   ├── 📄 alt_format_grades.csv
│   └── 📄 semicolon_format.csv
│
├── 📁 docs/                         # Documentation
│   ├── 📄 Attributions.md
│   ├── 📄 CAPSTONE_PRESENTATION.md
│   └── 📄 QUICK_REFERENCE_SHEET.md
│
└── 📁 src/                          # Frontend source code
    ├── 📄 App.tsx                   # Root component with auth routing
    ├── 📄 main.tsx                  # React entry point
    ├── 📄 index.css                 # Global CSS imports
    ├── 📄 types.ts                  # TypeScript definitions (200+ lines)
    │
    ├── 📁 components/               # React components
    │   │
    │   │  # Core Views
    │   ├── 📄 LoginView.tsx                    # Firebase authentication
    │   ├── 📄 TeacherDashboard.tsx             # Main teacher interface (800+ lines)
    │   ├── 📄 StudentView.tsx                  # Student learning portal (500+ lines)
    │   ├── 📄 AdminPanel.tsx                   # System administration
    │   │
    │   │  # Feature Components
    │   ├── 📄 ModuleContent.tsx                # Video/quiz/exercise renderer
    │   ├── 📄 RewardSystem.tsx                 # Gamification (XP, achievements)
    │   │
    │   │  # Modal Components
    │   ├── 📄 ProfileEditModal.tsx             # Avatar & profile editor
    │   ├── 📄 ClassroomOverviewModal.tsx       # Classroom selector
    │   ├── 📄 EditClassRecordsModal.tsx        # In-app student data editor
    │   ├── 📄 ExportPrintedMaterialsModal.tsx  # PDF worksheet generator
    │   ├── 📄 ExternalLinkValidationModal.tsx  # AI link approval workflow
    │   │
    │   ├── 📁 admin/                # Admin panel sub-components
    │   │   ├── 📄 UserManagement.tsx
    │   │   ├── 📄 SystemAnalytics.tsx
    │   │   ├── 📄 ContentManagement.tsx
    │   │   ├── 📄 AuditLog.tsx
    │   │   └── 📄 SystemSettings.tsx
    │   │
    │   └── 📁 ui/                   # shadcn/ui library (40+ components)
    │       ├── 📄 button.tsx, card.tsx, dialog.tsx, input.tsx
    │       ├── 📄 tabs.tsx, select.tsx, progress.tsx, avatar.tsx
    │       └── 📄 ... (see full list in directory)
    │
    ├── 📁 services/                 # API & external services
    │   ├── 📄 api.ts                # Backend API client (600+ lines)
    │   ├── 📄 firebase.ts           # Firebase SDK integration (500+ lines)
    │   └── 📄 pdfGenerator.ts       # Client-side PDF generation
    │
    ├── 📁 utils/                    # Utilities and mock data
    │   ├── 📄 mockData.ts           # Prototype data (students, modules, etc.)
    │   ├── 📄 demoAccounts.ts       # Demo login credentials
    │   └── 📄 adminMockData.ts      # Admin panel mock data
    │
    ├── 📁 styles/                   # Global styles
    │   └── 📄 globals.css           # Tailwind + custom CSS variables
    │
    └── 📁 guidelines/               # Development guidelines
        └── 📄 Guidelines.md         # Design system documentation
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Python 3.11+ (for local ML backend development)
- **Docker Desktop** (recommended for consistent development environment)

### Option 1: Docker Setup (Recommended) 🐳

Docker ensures consistent development environment across all team members.

```bash
# Clone the repository
git clone <repository-url>
cd "MathPulse Prototype"

# Copy environment template
cp .env.example .env

# Start with Docker (production mode)
docker-compose up --build

# Or use the helper script (Windows)
docker-run.bat up
```

**Access the application:**
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

**Development mode with hot-reload:**
```bash
# Enable hot-reload for both frontend and backend
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Windows helper
docker-run.bat dev
```

**Common Docker commands:**
```bash
docker-compose down          # Stop all services
docker-compose logs -f       # View logs
docker-compose restart       # Restart services
docker-compose down -v       # Stop and clean volumes
```

📖 **Full Docker documentation:** See [DOCKER.md](DOCKER.md)

---

### Option 2: Manual Installation

```bash
# Clone the repository
git clone <repository-url>
cd "MathPulse Prototype"

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Configuration

Create a `.env` file in the root directory:

```env
# API Configuration (defaults to HF Spaces backend)
VITE_API_URL=https://deign86-mathpulse-api.hf.space

# Firebase Configuration (already configured in firebase.ts)
# These are public keys and safe to commit
VITE_FIREBASE_API_KEY=AIzaSyDFGHJKL...
VITE_FIREBASE_AUTH_DOMAIN=mathpulse-ai-edu.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mathpulse-ai-edu
```

### Build for Production

```bash
npm run build    # Outputs to /dist
npm run preview  # Preview production build locally
```

---

## ML Backend Setup

The ML backend provides AI-powered features using Hugging Face Inference API.

### Option 1: Use Hosted Backend (Recommended)

The frontend is pre-configured to use the hosted backend at:
- **URL**: https://deign86-mathpulse-api.hf.space
- **Health Check**: https://deign86-mathpulse-api.hf.space/health

No setup required—just run `npm run dev` and it works!

### Option 2: Docker Backend (Local Development)

```bash
# Run backend in Docker
cd backend
docker build -t mathpulse-backend .
docker run -p 8000:7860 mathpulse-backend
```

Or use docker-compose (recommended):
```bash
docker-compose up backend
```

### Option 3: Run Backend Locally

#### Quick Setup (Windows)

```bash
cd backend
run.bat
```

#### Manual Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your Hugging Face API token
# Get token from: https://huggingface.co/settings/tokens

# Run server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: `http://localhost:8000`

Then update your frontend `.env`:
```env
VITE_API_URL=http://localhost:8000
```

---

## Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Or connect your GitHub repo to Vercel for automatic deployments.

### Backend (Hugging Face Spaces)

1. Create a new Space at https://huggingface.co/new-space
2. Select **Docker** SDK
3. Push the `backend/` directory contents
4. Add `HUGGINGFACE_API_TOKEN` as a Space variable
5. The Space will auto-build and deploy

### Firebase Setup

1. Create a project at https://console.firebase.google.com
2. Enable **Authentication** (Email/Password)
3. Create a **Firestore** database
4. Deploy security rules: `firebase deploy --only firestore:rules`
5. Seed initial data: `node scripts/injectFirebaseData.mjs`

---

## API Documentation

### Backend Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Health check (basic) |
| `GET` | `/health` | Full health with service status |
| `POST` | `/api/chat` | AI Math Tutor conversation |
| `POST` | `/api/chat/simple` | Simple single-turn chat |
| `POST` | `/api/predict-risk` | Single student risk prediction |
| `POST` | `/api/predict-risk/batch` | Batch risk prediction |
| `POST` | `/api/learning-path` | Generate learning path |
| `GET` | `/api/learning-path/{topic}` | Get path for specific topic |
| `POST` | `/api/analytics/daily-insight` | Generate daily AI insight |
| `GET` | `/api/analytics/summary` | Get class analytics summary |
| `POST` | `/api/upload/class-records` | Upload CSV/Excel/PDF records |
| `POST` | `/api/upload/course-materials` | Upload course documents |
| `GET` | `/api/upload/supported-formats` | List supported file formats |

### Interactive API Docs

When running locally:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### ML Models Used

| Feature | Model | Provider |
|---------|-------|----------|
| AI Chat Tutor | Qwen/Qwen2.5-3B-Instruct | Hugging Face |
| Risk Classification | facebook/bart-large-mnli | Hugging Face |
| Document Extraction | Qwen/Qwen2.5-3B-Instruct | Hugging Face |

> **Note:** The frontend works with or without the backend. If the backend is unavailable, it uses intelligent fallback responses.

---

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `node scripts/injectFirebaseData.mjs` | Seed Firebase with demo data |

### Backend Scripts

| Script | Description |
|--------|-------------|
| `cd backend && run.bat` | Start backend (Windows) |
| `cd backend && python -m uvicorn main:app --reload` | Start with auto-reload |

### User Roles

| Role | Access | Demo Login |
|------|--------|------------|
| **Teacher** | Dashboard, analytics, student management, announcements | `prof.anderson@school.edu` |
| **Student** | Learning modules, AI chat, rewards, progress | `alex.johnson@school.edu` |
| **Admin** | User management, system settings, audit logs | `admin@mathpulse.edu` |

### Firebase Collections

| Collection | Purpose |
|------------|---------|
| `students` | Student profiles and academic data |
| `chatHistory` | AI tutor conversation persistence |
| `activities` | Real-time classroom activity feed |
| `announcements` | Teacher announcements |
| `studentProgress` | XP, level, streak data |
| `achievements` | Unlocked achievement tracking |
| `learningProgress` | Module completion records |

---

## Component Documentation

### Core Types (`src/types.ts`)

```typescript
// Risk levels for student classification
enum RiskLevel { LOW = 'Low', MEDIUM = 'Medium', HIGH = 'High' }

// Main data models
interface Student { 
  id, name, avatar, riskLevel, engagementScore, 
  avgQuizScore, weakestTopic, classroomId 
}
interface Module { id, title, type: 'video'|'quiz'|'exercise', duration, completed }
interface Classroom { id, name, section, gradeLevel, schedule, studentCount, semester, academicYear, room }
interface InterventionPlan { analysis, remedial_path, strategies }
interface ExternalLink { id, title, url, type, topic, status: 'pending'|'approved'|'rejected', source }

// Admin types
interface SystemUser { id, email, name, role: UserRole, status: UserStatus }
interface AuditLogEntry { id, userId, action, category, severity, timestamp }
interface SystemSettings { siteName, maintenanceMode, aiTutorEnabled, ... }
```

### Key Components

| Component | Lines | Purpose |
|-----------|-------|---------|
| `TeacherDashboard.tsx` | 800+ | Main teacher interface with sidebar, analytics, file uploads, announcements |
| `StudentView.tsx` | 500+ | Student portal with modules, chat, gamification |
| `AdminPanel.tsx` | 300+ | System administration with tabs for users, analytics, settings |
| `ModuleContent.tsx` | 300+ | Renders video, quiz, and exercise modules |
| `RewardSystem.tsx` | 200+ | XP display, achievements, streak tracking |
| `api.ts` | 600+ | Backend API client with fallback handling |
| `firebase.ts` | 500+ | Firebase SDK with all service integrations |

### Service Layer (`src/services/`)

```typescript
// api.ts - Backend communication
const apiService = {
  chat(message, history),           // AI tutor conversation
  predictRisk(studentData),         // Risk classification
  getLearningPath(topic, gaps),     // Learning recommendations
  getDailyInsight(students),        // Class analytics
  uploadClassRecords(file),         // Smart file parsing
  uploadCourseMaterials(file),      // Curriculum analysis
}

// firebase.ts - Firestore integration
const studentService = { getAll(), getById(id), save(student) }
const chatService = { getHistory(userId), saveMessage(userId, message) }
const activityService = { subscribeToActivities(classroomId, callback), logActivity(activity) }
const announcementService = { create(announcement), getForStudent(studentId, classroomId) }
const studentProgressService = { getProgress(id), addXP(id, amount), updateStreak(id) }
const achievementService = { checkAndUnlockAchievements(id, progress) }
```

---

## AI Coding Guidelines

For AI coding assistants working on this project, see [.github/copilot-instructions.md](.github/copilot-instructions.md) for detailed guidelines including:
- Architecture patterns and state management
- Component structure conventions
- Styling rules (Tailwind-only)
- Firebase integration patterns
- API service usage

---

## License

This project is a prototype for educational purposes.

---

## Acknowledgments

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Charts: [Recharts](https://recharts.org/)
- AI Models: [Hugging Face](https://huggingface.co/)
- Database: [Firebase](https://firebase.google.com/)
- Hosting: [Vercel](https://vercel.com/) & [Hugging Face Spaces](https://huggingface.co/spaces)