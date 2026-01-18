# MathPulse AI - Copilot Instructions

## Architecture Overview

**MathPulse AI** is a full-stack educational platform with:
- **Frontend**: React 18 + TypeScript + Vite (deployed on Vercel)
- **Backend**: FastAPI + Python (deployed on Hugging Face Spaces)
- **Database**: Firebase Firestore (real-time NoSQL)
- **Auth**: Firebase Authentication

### Main Views
- **TeacherDashboard** (`src/components/TeacherDashboard.tsx`) - Student monitoring, analytics, file uploads, announcements
- **StudentView** (`src/components/StudentView.tsx`) - Learning modules, AI chat tutor, gamification
- **AdminPanel** (`src/components/AdminPanel.tsx`) - User management, system settings, audit logs

### State Management
State flows from `App.tsx` → view components via props. No external state library—use `useState` and prop drilling.
For shared data (students, activities), use Firebase real-time subscriptions in `useEffect`.

## Key Files

| File | Purpose |
|------|---------|
| `src/types.ts` | All TypeScript interfaces (`Student`, `Module`, `RiskLevel` enum, admin types) |
| `src/utils/mockData.ts` | Prototype data—`mockStudents`, `mockModules`, `mockClassrooms` |
| `src/utils/demoAccounts.ts` | Demo login credentials for all roles |
| `src/services/api.ts` | Backend API client with fallback handling |
| `src/services/firebase.ts` | Firebase SDK integration (all Firestore services) |
| `src/guidelines/Guidelines.md` | Design tokens, colors, component patterns |
| `src/components/ui/` | shadcn/ui primitives—**do not modify** unless necessary |

## Development Commands

```bash
# Frontend
npm run dev          # Start at localhost:5173
npm run build        # Production build
npm run preview      # Preview build locally

# Backend (local development)
cd backend
.\venv\Scripts\activate     # Windows
source venv/bin/activate    # Mac/Linux
python -m uvicorn main:app --reload --port 8000

# Firebase
node scripts/injectFirebaseData.mjs  # Seed database
```

## Deployment URLs

| Service | URL |
|---------|-----|
| Frontend | https://mathpulse-ai.vercel.app |
| Backend API | https://deign86-mathpulse-api.hf.space |
| API Health | https://deign86-mathpulse-api.hf.space/health |

## Code Patterns

### Component Structure
```tsx
import { useState, useEffect } from 'react';
import { IconName } from 'lucide-react';
import { Button } from './ui/button';
import { studentService } from '../services/firebase';

interface Props { onAction: () => void; }

export function Component({ onAction }: Props) {
  const [state, setState] = useState<Type>(initial);
  
  useEffect(() => {
    // Load data from Firebase
    const loadData = async () => {
      const data = await studentService.getAll();
      setState(data);
    };
    loadData();
  }, []);
  
  return <div className="tailwind-classes">{/* content */}</div>;
}
```

### Risk Level Colors (use consistently)
```tsx
const getRiskColor = (risk: RiskLevel) => {
  switch (risk) {
    case RiskLevel.HIGH: return '#ef4444';   // red-500
    case RiskLevel.MEDIUM: return '#f59e0b'; // amber-500
    case RiskLevel.LOW: return '#10b981';    // emerald-500
  }
};
```

### Modal Pattern (using Radix Dialog)
```tsx
const [isOpen, setIsOpen] = useState(false);
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

### Firebase Data Pattern
```tsx
import { studentService, activityService } from '../services/firebase';

// Load data once
useEffect(() => {
  const load = async () => {
    const students = await studentService.getAll();
    setStudents(students);
  };
  load();
}, []);

// Real-time subscription
useEffect(() => {
  const unsubscribe = activityService.subscribeToActivities(classroomId, (activities) => {
    setActivities(activities);
  });
  return () => unsubscribe();
}, [classroomId]);

// Save data
const handleSave = async (student: Student) => {
  await studentService.save(student);
};
```

### API Service Pattern
```tsx
import { apiService } from '../services/api';

// AI Chat
const response = await apiService.chat(message, chatHistory);

// File Upload
const result = await apiService.uploadClassRecords(file);
if (result.success) {
  // result.students contains parsed data
}

// Daily Insight
const insight = await apiService.getDailyInsight(studentData);
```

## Styling Rules

- **Only Tailwind CSS**—no inline styles, no new CSS files
- **Brand colors**: `from-brand-500 to-brand-600` gradient for primary actions
- **Cards**: `bg-white rounded-lg shadow-sm border border-slate-200 p-4`
- **Background**: `bg-slate-50` for pages
- **Icons**: Import from `lucide-react` only
- **Responsive**: Use `md:` and `lg:` prefixes for breakpoints

## Adding Features

1. **New component**: Create in `src/components/`, define props interface, use existing UI primitives
2. **New data type**: Add interface to `types.ts`, mock data to `mockData.ts`
3. **New modal**: Follow `ProfileEditModal.tsx` pattern with Dialog component
4. **Charts**: Use Recharts with `<ResponsiveContainer>` wrapper
5. **New API endpoint**: Add to `backend/main.py`, then add client method in `api.ts`
6. **New Firebase collection**: Add service in `firebase.ts` following existing patterns

## Backend API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | AI Math Tutor conversation |
| POST | `/api/predict-risk` | Student risk classification |
| POST | `/api/learning-path` | Generate learning recommendations |
| POST | `/api/analytics/daily-insight` | Class analytics with trends |
| POST | `/api/upload/class-records` | Parse CSV/Excel/PDF files |
| POST | `/api/upload/course-materials` | Analyze curriculum documents |
| GET | `/api/upload/supported-formats` | List supported file types |

## Constraints

- ✅ TypeScript strict typing for all props/state
- ✅ Functional components with hooks only
- ✅ Reuse `src/components/ui/` components
- ✅ Use Firebase for persistent data
- ✅ Use API service for ML features
- ❌ No class components
- ❌ No external state management libraries (Redux, Zustand)
- ❌ Don't delete mock data used by other components
- ❌ No new dependencies without justification
- ❌ Don't hardcode API URLs (use `import.meta.env.VITE_API_URL`)

## Testing

Manual testing checklist:
1. Test all three views (Teacher, Student, Admin)
2. Verify Firebase auth login/logout
3. Test AI chat responses
4. Verify file upload parsing
5. Check modals open/close
6. Test responsive breakpoints (mobile, tablet, desktop)

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | `prof.anderson@school.edu` | `demo123` |
| Student | `alex.johnson@school.edu` | `demo123` |
| Admin | `admin@mathpulse.edu` | `demo123` |
