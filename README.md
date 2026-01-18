# MathPulse AI - Educational Learning Platform

> An AI-powered mathematics learning platform designed to help teachers monitor student progress and provide personalized intervention strategies.

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Component Documentation](#component-documentation)

---

## Overview

MathPulse AI is a high-fidelity prototype for an educational learning management system that leverages AI to:
- Monitor student engagement and performance
- Identify at-risk students through risk-level classification
- Generate personalized intervention plans
- Provide interactive learning modules for students
- Enable teacher dashboard analytics and classroom management

**Figma Design:** [High-Fidelity UI Design](https://www.figma.com/design/ExniW5RHSJPtb6kxW0pefy/High-Fidelity-UI-Design)

---

## Features

### 👨‍🏫 Teacher Dashboard
- **Student Risk Monitoring** - View students categorized by risk levels (High/Medium/Low)
- **AI-Generated Intervention Plans** - Personalized remedial paths for struggling students
- **Analytics Dashboard** - Charts and metrics for class performance
- **Classroom Management** - Switch between multiple classrooms/sections
- **External Link Validation** - Review AI-recommended learning resources
- **Export & Print Materials** - Generate printed materials for students

### 👨‍🎓 Student View
- **Interactive Learning Modules** - Videos, quizzes, and exercises
- **AI Chat Assistant** - Get help with math concepts
- **Gamification System** - XP, levels, streaks, and achievements
- **Progress Tracking** - Monitor completed modules and performance

---

## Tech Stack

| Category | Technologies |
|----------|-------------|
| **Framework** | React 18 with TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS |
| **UI Components** | Radix UI Primitives, shadcn/ui |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Forms** | React Hook Form |
| **Carousel** | Embla Carousel |
| **Notifications** | Sonner |

---

## Project Structure

```
MathPulse Prototype/
├── 📄 index.html                    # HTML entry point
├── 📄 package.json                  # Dependencies and scripts
├── 📄 vite.config.ts                # Vite configuration
├── 📄 README.md                     # Project documentation
│
├── 📁 .github/                      # GitHub configuration
│   └── 📄 AGENT_INSTRUCTIONS.md     # AI agent guidelines
│
└── 📁 src/                          # Source code
    ├── 📄 App.tsx                   # Root application component
    ├── 📄 main.tsx                  # React entry point
    ├── 📄 index.css                 # Global CSS imports
    ├── 📄 types.ts                  # TypeScript type definitions
    │
    ├── 📁 components/               # React components
    │   │
    │   │  # Core Views
    │   ├── 📄 LoginView.tsx                    # Authentication view
    │   ├── 📄 TeacherDashboard.tsx             # Main teacher interface
    │   ├── 📄 StudentView.tsx                  # Main student interface
    │   │
    │   │  # Feature Components
    │   ├── 📄 ModuleContent.tsx                # Learning module renderer
    │   ├── 📄 RewardSystem.tsx                 # Gamification UI
    │   │
    │   │  # Modal Components
    │   ├── 📄 ProfileEditModal.tsx             # User profile editor
    │   ├── 📄 ClassroomOverviewModal.tsx       # Classroom selector/viewer
    │   ├── 📄 EditClassRecordsModal.tsx        # Class records management
    │   ├── 📄 ExportPrintedMaterialsModal.tsx  # Export functionality
    │   ├── 📄 ExternalLinkValidationModal.tsx  # AI link validation
    │   │
    │   ├── 📁 ui/                   # shadcn/ui component library (40+ components)
    │   │   ├── 📄 button.tsx        # Button variants
    │   │   ├── 📄 card.tsx          # Card containers
    │   │   ├── 📄 dialog.tsx        # Modal dialogs
    │   │   ├── 📄 input.tsx         # Form inputs
    │   │   ├── 📄 progress.tsx      # Progress bars
    │   │   ├── 📄 select.tsx        # Dropdowns
    │   │   ├── 📄 tabs.tsx          # Tab navigation
    │   │   ├── 📄 utils.ts          # cn() helper function
    │   │   └── 📄 ...               # Additional UI primitives
    │   │
    │   └── 📁 figma/                # Figma-specific components
    │       └── 📄 ImageWithFallback.tsx
    │
    ├── 📁 utils/                    # Utility functions and data
    │   └── 📄 mockData.ts           # Mock data for prototyping
    │
    ├── 📁 styles/                   # Global styles
    │   └── 📄 globals.css           # Tailwind + custom styles
    │
    └── 📁 guidelines/               # Development guidelines
        └── 📄 Guidelines.md         # Design system guidelines
```

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

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

### Build for Production

```bash
npm run build
```

---

## Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### User Roles

The application supports two user roles:

1. **Teacher** - Access to dashboard, analytics, student management
2. **Student** - Access to learning modules, chat assistant, rewards

### AI Agent Guidelines

For AI coding assistants working on this project, see [.github/AGENT_INSTRUCTIONS.md](.github/AGENT_INSTRUCTIONS.md) for detailed guidelines.

---

## Component Documentation

### Core Types (`src/types.ts`)

```typescript
// Risk levels for student classification
enum RiskLevel { LOW, MEDIUM, HIGH }

// Main data models
interface Student { id, name, avatar, riskLevel, engagementScore, avgQuizScore, weakestTopic, classroomId }
interface Module { id, title, type, duration, completed }
interface Classroom { id, name, section, gradeLevel, schedule, studentCount, semester, academicYear, room }
interface InterventionPlan { analysis, remedial_path, strategies }
interface ExternalLink { id, title, url, type, topic, status, source }
```

### Key Components

| Component | Purpose |
|-----------|---------|
| `App.tsx` | Root component handling authentication state and routing |
| `LoginView.tsx` | User authentication and role selection |
| `TeacherDashboard.tsx` | Main teacher interface with sidebar, analytics, and student management |
| `StudentView.tsx` | Student learning interface with modules, chat, and rewards |
| `ModuleContent.tsx` | Renders video, quiz, and exercise modules |
| `RewardSystem.tsx` | XP, achievements, and gamification UI |

---

## License

This project is a prototype for educational purposes.

---

## Acknowledgments

- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icons: [Lucide](https://lucide.dev/)
- Charts: [Recharts](https://recharts.org/)