# MathPulse AI - Capstone 1 Presentation
## SY 2025-26 Semester 3

---

## 1. TEAM INTRODUCTION & POSITIONS

**Project Title:** MathPulse AI - AI-Powered Math Risk Assessment & Intervention System

**Team Members (5 Members):**
- **Member 1 - Project Leader / Full-Stack Developer**
  - Overall project coordination
  - Backend development and AI integration
  - Database architecture

- **Member 2 - Frontend Developer / UI/UX Designer**
  - User interface design and implementation
  - React component development
  - Responsive design implementation

- **Member 3 - AI/ML Specialist / Data Analyst**
  - Machine learning model development
  - Predictive analytics implementation
  - Data preprocessing and analysis

- **Member 4 - Backend Developer / API Specialist**
  - RESTful API development
  - Supabase integration
  - Authentication and authorization

- **Member 5 - QA Tester / Documentation Specialist**
  - System testing and quality assurance
  - Technical documentation
  - User manual preparation

---

## 2. TOPIC PURPOSE AND CORE

### Purpose
To develop an AI-powered recommender system that identifies senior high school students at risk in mathematics subjects through predictive analytics, enabling early intervention and personalized learning support.

### Core Problem
- High failure rates in mathematics among senior high school students
- Lack of early warning systems for at-risk students
- Teachers unable to provide timely, personalized interventions
- Limited data-driven decision making in education

### Core Solution
- **AI-Powered Risk Assessment**: Machine learning algorithms analyze student performance data to predict risk levels (High, Medium, Low)
- **Early Intervention System**: Automated generation of personalized intervention plans
- **Dual-Role Platform**: Separate interfaces for teachers (monitoring & management) and students (personalized learning)
- **Real-Time Analytics**: Data visualization dashboards for tracking student progress
- **AI Tutor Integration**: Chatbot-based learning support for students

### Expected Impact
- Early identification of struggling students (before they fail)
- Personalized learning paths based on individual risk profiles
- Improved teacher efficiency through automated analysis
- Better student outcomes in mathematics
- Data-driven educational decision making

---

## 3. LOCALE AND COORDINATION

### Target Locale
**Senior High School (Grades 11-12) - Mathematics Departments**

### Key Person Coordination Strategy

**Primary Contact:**
- **Position**: Mathematics Department Head / Coordinator
- **Purpose**: Project approval, teacher access, and data collection permissions

**Secondary Contacts:**
- **Math Teachers** (3-5 teachers): System testing, feedback, and user requirements
- **School IT Coordinator**: Technical infrastructure assessment, deployment support
- **Guidance Counselor**: Intervention strategy validation

### Coordination Plan

**Phase 1: Initial Contact (Week 1-2)**
- Formal letter request to school administration
- Presentation of project proposal to Math Department Head
- Discussion of data privacy and ethical considerations
- Obtain consent forms and MOA (Memorandum of Agreement)

**Phase 2: Requirements Gathering (Week 3-4)**
- Interview with 3-5 math teachers about current assessment methods
- Review existing grading systems and data formats
- Identify pain points and specific needs
- Collect sample (anonymized) student data for model training

**Phase 3: Testing & Validation (Mid-Development)**
- Weekly check-ins with key teachers
- Pilot testing with one classroom/section
- Gather feedback on UI/UX and functionality
- Validate AI predictions against teacher observations

**Phase 4: Final Deployment & Training (End of Project)**
- Teacher training sessions
- Full system deployment
- Post-implementation support

### Data Collection Method
- CSV file imports of student grades (Quarters 1-4)
- Attendance records
- Assessment scores (quizzes, exams, assignments)
- All data anonymized to protect student privacy

---

## 4. SYSTEM FEATURES (WITH DIFFICULTY LEVELS)

### For Teachers

| Feature | Description | Difficulty | Priority |
|---------|-------------|------------|----------|
| **Student Risk Dashboard** | Visual overview of all students with color-coded risk indicators (red/amber/green) | ⭐⭐ Medium | High |
| **AI Risk Prediction** | Machine learning model predicting student risk levels based on performance data | ⭐⭐⭐⭐ Very High | High |
| **CSV Import & Analysis** | Upload class records (CSV) and automatically analyze using AI | ⭐⭐⭐ High | High |
| **Edit Class Records** | Manual editing of imported data in case of AI misanalysis | ⭐⭐ Medium | Medium |
| **Intervention Plan Generator** | AI-generated personalized intervention strategies for at-risk students | ⭐⭐⭐⭐ Very High | High |
| **Analytics Dashboard** | Charts showing class performance, risk distribution, trends over time | ⭐⭐⭐ High | Medium |
| **Classroom/Section Management** | Manage multiple classes, switch between sections | ⭐⭐ Medium | High |
| **Export Printed Materials** | Generate PDF/DOCX worksheets, study guides for offline use | ⭐⭐⭐ High | Low |
| **AI External Link Validation** | Review and approve AI-recommended learning resources before students access them | ⭐⭐ Medium | Low |
| **Student Progress Tracking** | Monitor individual student improvement over time | ⭐⭐ Medium | Medium |
| **Activity Timeline** | View recent activities and intervention history | ⭐ Low | Low |

### For Students

| Feature | Description | Difficulty | Priority |
|---------|-------------|------------|----------|
| **Personalized Learning Portal** | Dashboard showing personalized risk level, areas for improvement | ⭐⭐ Medium | High |
| **AI Chat Tutor** | Conversational AI assistant for math help and explanations | ⭐⭐⭐⭐ Very High | High |
| **Module-Based Learning** | Organized math modules (Algebra, Calculus, etc.) with lessons and exercises | ⭐⭐⭐ High | High |
| **Progress Visualization** | Charts showing performance trends and improvement areas | ⭐⭐ Medium | Medium |
| **Gamification/Rewards System** | XP points, levels, achievements, streaks to motivate learning | ⭐⭐⭐ High | Low |
| **Recommended Resources** | AI-curated learning materials based on student needs (teacher-approved) | ⭐⭐ Medium | Medium |
| **Practice Exercises** | Interactive math problems with instant feedback | ⭐⭐⭐ High | Medium |

### Shared Features

| Feature | Description | Difficulty | Priority |
|---------|-------------|------------|----------|
| **Authentication System** | Secure login with role-based access (teacher/student) | ⭐⭐⭐ High | High |
| **Profile Management** | Edit profile, change password, manage settings | ⭐⭐ Medium | Medium |
| **Responsive Design** | Works on desktop, tablet, and mobile devices | ⭐⭐⭐ High | High |

**Difficulty Legend:**
- ⭐ Low: Basic CRUD operations, simple UI components
- ⭐⭐ Medium: Complex UI logic, state management
- ⭐⭐⭐ High: API integration, data processing, advanced algorithms
- ⭐⭐⭐⭐ Very High: AI/ML models, predictive analytics, complex algorithms

---

## 5. DEVELOPMENT PLAN

### Platform Type
**Web Application (Responsive)**
- Primary: Desktop browsers (for teachers - larger screens for data analysis)
- Secondary: Mobile/Tablet responsive (for students - on-the-go learning)
- **Why Web?** Cross-platform compatibility, no installation required, easier deployment in schools

### Technology Stack

#### **Frontend**
- **Programming Language:** TypeScript (with JavaScript)
- **Framework:** React 18+ (Component-based UI library)
- **Styling:** Tailwind CSS v4 (Utility-first CSS framework)
- **UI Components:** Custom component library + shadcn/ui
- **State Management:** React Hooks (useState, useEffect, useContext)
- **Charts/Visualizations:** Recharts (for analytics dashboards)
- **Icons:** Lucide React

#### **Backend**
- **Platform:** Supabase (Backend-as-a-Service)
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (JWT-based)
- **API:** RESTful API (Supabase Auto-generated)
- **Real-time:** Supabase Realtime (WebSocket for live updates)
- **Storage:** Supabase Storage (for uploaded CSV files, exported materials)

#### **AI/Machine Learning**
- **Primary Model:** Python-based ML model (scikit-learn or TensorFlow)
- **Risk Prediction Algorithm:** 
  - Random Forest Classifier / Logistic Regression
  - Features: grades, attendance, assessment scores, trend analysis
- **AI Chat Tutor:** 
  - OpenAI GPT API (or similar LLM API)
  - Fine-tuned prompts for math tutoring
- **Intervention Generator:** Rule-based AI + NLP templates

#### **Development Tools**
- **IDE:** Visual Studio Code
- **Version Control:** Git + GitHub
- **Package Manager:** npm / pnpm
- **Build Tool:** Vite (Fast build tool for React)
- **Testing:** Jest (Unit testing), React Testing Library

#### **APIs Needed**
- **Supabase API:** Database operations, authentication, file storage
- **OpenAI API / Google Gemini API:** AI chat tutor functionality
- **Chart.js / Recharts:** Data visualization (client-side, no API)
- **Export Libraries:** jsPDF (PDF generation), docx.js (DOCX generation)

#### **Database Schema (PostgreSQL via Supabase)**
```
Tables:
- users (id, email, role, name, created_at)
- teachers (id, user_id, department, subjects)
- students (id, user_id, grade_level, section)
- classrooms (id, teacher_id, name, section, subject, school_year)
- student_records (id, student_id, classroom_id, grades, attendance, risk_level)
- interventions (id, student_id, teacher_id, plan, status, created_at)
- ai_chat_history (id, student_id, messages, timestamp)
- external_links (id, title, url, subject, status, approved_by)
- achievements (id, student_id, xp, level, badges)
```

### Prototype Draft Look

**Current Status:** ✅ **Working High-Fidelity UI Prototype Completed**

#### Screenshots/Features Implemented:
1. **Login Screen**
   - Role selection (Teacher/Student)
   - Email/Password authentication
   - Modern Sky Blue (#0ea5e9) gradient design
   - Inter font typography

2. **Teacher Dashboard**
   - Student risk overview with colored indicators
   - Analytics charts (risk distribution pie chart, performance trends)
   - Classroom selector with stats
   - Quick action cards for main features
   - CSV import functionality
   - Edit Class Records feature (inline editing, add/delete students)

3. **Student Portal**
   - Personalized risk level display
   - Module-based learning interface
   - AI Chat Tutor with conversational UI
   - Progress tracking charts
   - Gamification system (XP, levels, achievements, streaks)

4. **Modals/Features**
   - Classroom Overview Modal (section management)
   - Edit Class Records Modal (data correction)
   - Export Printed Materials Modal (PDF/DOCX generation)
   - AI External Link Validation Modal (resource approval)
   - Profile Edit Modal

**Design System:**
- Color Palette: Sky Blue (#0ea5e9 to #0c4a6e)
- Risk Colors: Red (High), Amber (Medium), Green (Low)
- Typography: Inter font family
- Modern EdTech/SaaS aesthetic with clean cards and shadows

### Development Timeline (Capstone 1 & 2)

**Capstone 1 - Planning & Initial Development (Current Semester)**
- Week 1-2: Requirements gathering, locale coordination
- Week 3-4: Database design, API architecture
- Week 5-8: Frontend UI development (✅ COMPLETED)
- Week 9-12: Basic authentication, CRUD operations
- Week 13-16: Initial AI model training with sample data

**Capstone 2 - Full Development & Deployment (Next Semester)**
- Week 1-4: AI integration (risk prediction, intervention generator)
- Week 5-8: AI Chat Tutor implementation
- Week 9-10: Testing with real users (pilot school)
- Week 11-12: Refinement based on feedback
- Week 13-14: Final deployment and documentation
- Week 15-16: Defense preparation

### Deployment Strategy
- **Hosting:** Vercel / Netlify (Frontend), Supabase (Backend & DB)
- **Domain:** Custom domain for professional access
- **SSL:** HTTPS encryption for data security
- **Backup:** Automated database backups via Supabase

---

## 6. DATA PRIVACY & ETHICAL CONSIDERATIONS

- All student data will be anonymized in the prototype
- Compliance with Data Privacy Act of 2012 (RA 10173)
- Informed consent from school, teachers, students, and parents
- Secure data storage with encryption
- No sharing of data with third parties
- AI predictions are advisory only - final decisions by teachers

---

## 7. EXPECTED DELIVERABLES

### Capstone 1
- ✅ Working UI Prototype (High-Fidelity)
- Requirements Documentation
- Database Schema Design
- System Architecture Diagram
- Initial User Testing Results

### Capstone 2
- Fully Functional Web Application
- Trained AI Model with validation results
- User Manual (Teacher & Student)
- Technical Documentation
- Source Code Repository
- Deployment on Live Server
- Final Research Paper

---

## CONTACT & COLLABORATION

**Team Repository:** [GitHub Link]
**Project Documentation:** [Google Drive/Notion Link]
**Meeting Schedule:** [Weekly Schedule]

---

**Prepared by:** [Your Group Name]  
**Date:** January 2026  
**Adviser:** [Adviser Name]  
**Subject:** Capstone Project 1
