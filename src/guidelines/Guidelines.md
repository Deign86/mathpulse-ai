# MathPulse AI - Design System Guidelines

> Design system rules and conventions for AI assistants and developers.

---

## 🎨 Design Tokens

### Color Palette

#### Brand Colors
```css
--brand-50:  #f0f9ff   /* Lightest tint */
--brand-100: #e0f2fe
--brand-200: #bae6fd
--brand-300: #7dd3fc
--brand-400: #38bdf8
--brand-500: #0ea5e9   /* Primary */
--brand-600: #0284c7   /* Primary hover */
--brand-700: #0369a1
--brand-800: #075985
--brand-900: #0c4a6e   /* Darkest shade */
```

#### Semantic Colors
```css
/* Risk Levels */
--risk-high:    #ef4444  /* red-500 */
--risk-medium:  #f59e0b  /* amber-500 */
--risk-low:     #10b981  /* emerald-500 */

/* Status */
--success: #10b981
--warning: #f59e0b
--error:   #ef4444
--info:    #3b82f6
```

#### Neutral Colors
```css
--slate-50:  #f8fafc   /* Page background */
--slate-100: #f1f5f9
--slate-200: #e2e8f0   /* Borders */
--slate-300: #cbd5e1
--slate-400: #94a3b8   /* Placeholder text */
--slate-500: #64748b   /* Secondary text */
--slate-600: #475569
--slate-700: #334155
--slate-800: #1e293b
--slate-900: #0f172a   /* Primary text */
```

---

## 📐 Spacing System

Use Tailwind's spacing scale consistently:
- `p-2` / `gap-2` - Tight spacing (8px)
- `p-3` / `gap-3` - Default compact (12px)
- `p-4` / `gap-4` - Standard spacing (16px)
- `p-6` / `gap-6` - Comfortable spacing (24px)
- `p-8` / `gap-8` - Generous spacing (32px)

---

## 🔲 Component Guidelines

### Buttons

#### Primary Button
```tsx
<button className="px-4 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-lg hover:from-brand-600 hover:to-brand-700 transition-all shadow-md hover:shadow-lg">
  Primary Action
</button>
```

#### Secondary Button
```tsx
<button className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors">
  Secondary Action
</button>
```

#### Icon Button
```tsx
<button className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

### Cards

#### Standard Card
```tsx
<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
  {/* Content */}
</div>
```

#### Interactive Card
```tsx
<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 cursor-pointer hover:shadow-md transition-all">
  {/* Content */}
</div>
```

#### Risk-Bordered Card
```tsx
<div 
  className="border-l-4 bg-white rounded-lg p-3 shadow-sm"
  style={{ borderLeftColor: getRiskColor(student.riskLevel) }}
>
  {/* Content */}
</div>
```

### Inputs

#### Text Input
```tsx
<input
  type="text"
  className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
  placeholder="Placeholder text..."
/>
```

#### Search Input with Icon
```tsx
<div className="relative">
  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
  <input
    type="text"
    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
    placeholder="Search..."
  />
</div>
```

### Badges

#### Risk Badge
```tsx
<span 
  className="px-2 py-1 rounded-full text-xs font-medium"
  style={{ 
    backgroundColor: `${getRiskColor(risk)}20`, 
    color: getRiskColor(risk) 
  }}
>
  {risk} Risk
</span>
```

#### Status Badge
```tsx
// Pending
<span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">Pending</span>

// Approved
<span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs">Approved</span>

// Completed
<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">Completed</span>
```

---

## 📱 Responsive Design

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

### Layout Patterns
```tsx
// Sidebar + Main Content
<div className="min-h-screen flex">
  <aside className="w-80 bg-white border-r border-slate-200">
    {/* Sidebar */}
  </aside>
  <main className="flex-1 p-6">
    {/* Main content */}
  </main>
</div>
```

---

## 🖼️ Icons

Use Lucide React icons consistently:

```tsx
import { 
  BrainCircuit,    // AI/ML features
  LayoutDashboard, // Dashboard
  BarChart3,       // Analytics
  Users,           // Students/People
  Bell,            // Notifications
  Search,          // Search
  Trophy,          // Achievements
  Star,            // Favorites/Ratings
  FileVideo,       // Video content
  FileQuestion,    // Quiz content
  FileText,        // Text content
  ChevronRight,    // Navigation
  LogOut,          // Sign out
  Edit2,           // Edit action
  Shield,          // Security/Protection
} from 'lucide-react';

// Standard icon sizes
<Icon className="w-4 h-4" /> // Small
<Icon className="w-5 h-5" /> // Default
<Icon className="w-6 h-6" /> // Large
```

---

## 🔤 Typography

### Font Sizes (Tailwind)
- `text-xs` - 12px - Labels, badges
- `text-sm` - 14px - Secondary text, inputs
- `text-base` - 16px - Body text
- `text-lg` - 18px - Section headers
- `text-xl` - 20px - Page headers
- `text-2xl` - 24px - Main titles

### Font Weights
- `font-normal` - Body text
- `font-medium` - Labels, buttons
- `font-semibold` - Headers
- `font-bold` - Emphasis

---

## 📊 Data Visualization

### Chart Colors
```tsx
const CHART_COLORS = {
  primary: '#0ea5e9',   // brand-500
  secondary: '#8b5cf6', // violet-500
  success: '#10b981',   // emerald-500
  warning: '#f59e0b',   // amber-500
  danger: '#ef4444',    // red-500
};
```

### Recharts Pattern
```tsx
<ResponsiveContainer width="100%" height={200}>
  <PieChart>
    <Pie data={data} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={80}>
      {data.map((entry, index) => (
        <Cell key={index} fill={entry.color} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>
```

---

## ✨ Animation & Transitions

### Standard Transitions
```css
transition-colors  /* Color changes */
transition-all     /* Multiple properties */
transition-transform /* Movement */
```

### Hover States
```tsx
// Button hover
"hover:bg-slate-50"
"hover:shadow-md"
"hover:scale-105"

// Card hover
"hover:shadow-lg hover:border-brand-300"
```

### Focus States
```tsx
"focus:outline-none focus:ring-2 focus:ring-brand-500"
```

---

## 🚫 Anti-Patterns (Avoid)

1. ❌ Inline styles (except dynamic colors like risk levels)
2. ❌ Custom CSS files - use Tailwind classes
3. ❌ Hard-coded colors - use design tokens
4. ❌ Inconsistent spacing - follow the spacing scale
5. ❌ Missing hover/focus states on interactive elements
6. ❌ Fixed widths that break responsiveness

---

*This guide ensures visual consistency across the MathPulse AI application.*
