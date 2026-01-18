# MathPulse AI - Copilot Instructions

## Architecture Overview

**MathPulse AI** is a React/TypeScript/Vite educational prototype with two main views:
- **TeacherDashboard** ([TeacherDashboard.tsx](../src/components/TeacherDashboard.tsx)) - Student monitoring, analytics, classroom management
- **StudentView** ([StudentView.tsx](../src/components/StudentView.tsx)) - Learning modules, AI chat, gamification

State flows from `App.tsx` → view components via props. No external state library—use `useState` and prop drilling.

## Key Files

| File | Purpose |
|------|---------|
| [types.ts](../src/types.ts) | All TypeScript interfaces (`Student`, `Module`, `RiskLevel` enum, etc.) |
| [mockData.ts](../src/utils/mockData.ts) | Prototype data—`mockStudents`, `mockModules`, `mockClassrooms`, etc. |
| [Guidelines.md](../src/guidelines/Guidelines.md) | Design tokens, colors, component patterns |
| `src/components/ui/` | shadcn/ui primitives—**do not modify** unless necessary |

## Development Commands

```bash
npm run dev    # Start at localhost:5173
npm run build  # Production build
```

## Code Patterns

### Component Structure
```tsx
import { useState } from 'react';
import { IconName } from 'lucide-react';
import { Button } from './ui/button';

interface Props { onAction: () => void; }

export function Component({ onAction }: Props) {
  const [state, setState] = useState<Type>(initial);
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

### Modal Pattern
```tsx
const [isOpen, setIsOpen] = useState(false);
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
    {/* content */}
  </DialogContent>
</Dialog>
```

## Styling Rules

- **Only Tailwind CSS**—no inline styles, no new CSS files
- **Brand colors**: `from-brand-500 to-brand-600` gradient for primary actions
- **Cards**: `bg-white rounded-lg shadow-sm border border-slate-200 p-4`
- **Background**: `bg-slate-50` for pages
- **Icons**: Import from `lucide-react` only

## Adding Features

1. **New component**: Create in `src/components/`, define props interface, use existing UI primitives
2. **New data type**: Add interface to `types.ts`, mock data to `mockData.ts`
3. **New modal**: Follow `ProfileEditModal.tsx` pattern with Dialog component
4. **Charts**: Use Recharts with `<ResponsiveContainer>` wrapper

## Constraints

- ✅ TypeScript strict typing for all props/state
- ✅ Functional components with hooks only
- ✅ Reuse `src/components/ui/` components
- ❌ No class components
- ❌ No external state management libraries
- ❌ Don't delete mock data used by other components
- ❌ No new dependencies without justification

## Testing

No automated tests—manual testing only:
1. Test both Teacher and Student views
2. Verify modals open/close
3. Check responsive breakpoints
