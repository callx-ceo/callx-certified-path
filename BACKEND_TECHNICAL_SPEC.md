# CallX Agent Certification Platform - Backend Technical Specification

## 1. Overview

The CallX Agent Certification Platform is a Learning Management System (LMS) designed for call center agent onboarding and certification. This document outlines the complete backend architecture, database schema, API requirements, and security considerations.

## 2. Technology Stack

- **Database:** PostgreSQL (via Supabase/Lovable Cloud)
- **Authentication:** Supabase Auth (email/password)
- **Storage:** Supabase Storage (for videos, PDFs, certificates)
- **Serverless Functions:** Supabase Edge Functions (Deno)
- **AI Integration:** OpenAI API for call simulations
- **Email:** Resend API for notifications

## 3. Database Schema

### 3.1 Core Tables

#### `profiles`
Stores basic user information (extends auth.users).

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

#### `user_roles`
Implements role-based access control (RBAC).

```sql
create type public.app_role as enum ('trainee', 'manager', 'admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz default now(),
  unique (user_id, role)
);

-- Security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;
```

#### `manager_assignments`
Links trainees to their managers.

```sql
create table public.manager_assignments (
  id uuid primary key default gen_random_uuid(),
  trainee_id uuid references auth.users(id) on delete cascade not null,
  manager_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique (trainee_id, manager_id)
);
```

#### `products` (Certification Programs)
Top-level container for certification programs.

```sql
create table public.products (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  is_active boolean default true,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `modules`
Modules within a certification program.

```sql
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade not null,
  title text not null,
  description text,
  order_index int not null,
  is_prerequisite boolean default false, -- For content dripping
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (product_id, order_index)
);
```

#### `lessons`
Individual lessons within modules.

```sql
create type public.lesson_type as enum ('video', 'text', 'quiz', 'simulation');

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid references public.modules(id) on delete cascade not null,
  title text not null,
  lesson_type lesson_type not null,
  order_index int not null,
  
  -- Content fields (populated based on lesson_type)
  video_url text, -- Storage path for video lessons
  text_content text, -- Rich text content for text lessons
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (module_id, order_index)
);
```

#### `lesson_attachments`
Downloadable files attached to lessons.

```sql
create table public.lesson_attachments (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  file_name text not null,
  file_path text not null, -- Storage path
  file_size bigint,
  created_at timestamptz default now()
);
```

#### `quizzes`
Quiz configuration (one per quiz lesson).

```sql
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade not null unique,
  passing_grade int not null check (passing_grade >= 0 and passing_grade <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

#### `quiz_questions`
Individual quiz questions.

```sql
create type public.question_type as enum ('multiple_choice', 'true_false');

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  question_type question_type not null,
  order_index int not null,
  created_at timestamptz default now(),
  unique (quiz_id, order_index)
);
```

#### `quiz_answers`
Answer options for quiz questions.

```sql
create table public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references public.quiz_questions(id) on delete cascade not null,
  answer_text text not null,
  is_correct boolean not null default false,
  order_index int not null,
  created_at timestamptz default now()
);
```

#### `simulations`
AI call simulation configuration.

```sql
create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade not null unique,
  scenario_description text not null, -- Instructions for the trainee
  ai_system_prompt text not null, -- System prompt for OpenAI
  passing_grade int not null check (passing_grade >= 0 and passing_grade <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 3.2 Progress Tracking Tables

#### `lesson_completions`
Tracks which lessons a trainee has completed.

```sql
create table public.lesson_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  completed_at timestamptz default now(),
  unique (user_id, lesson_id)
);
```

#### `quiz_attempts`
Records quiz attempts and scores.

```sql
create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score int not null check (score >= 0 and score <= 100),
  passed boolean not null,
  answers jsonb not null, -- Array of { question_id, selected_answer_id, is_correct }
  attempted_at timestamptz default now()
);
```

#### `simulation_attempts`
Records call simulation attempts.

```sql
create table public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  simulation_id uuid references public.simulations(id) on delete cascade not null,
  overall_score int not null check (overall_score >= 0 and overall_score <= 100),
  passed boolean not null,
  
  -- Detailed metrics
  script_adherence int check (script_adherence >= 0 and script_adherence <= 100),
  empathy_score text, -- 'Excellent', 'Good', 'Needs Improvement'
  call_flow_score int check (call_flow_score >= 0 and call_flow_score <= 100),
  
  -- Full transcript with inline AI feedback
  transcript jsonb not null, -- Array of { speaker: 'ai'|'user', text, feedback?, timestamp }
  
  attempted_at timestamptz default now()
);
```

#### `certifications`
Issued certificates.

```sql
create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  certificate_url text not null, -- Path to generated PDF in storage
  issued_at timestamptz default now(),
  unique (user_id, product_id)
);
```

## 4. Row-Level Security (RLS) Policies

### 4.1 General Principles

- **Trainees** can only see their own data and assigned courses
- **Managers** can see all data for their assigned trainees
- **Admins** can see and modify everything

### 4.2 Example RLS Policies

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.simulation_attempts enable row level security;
-- (repeat for all tables)

-- Profiles: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

-- Profiles: Managers can view profiles of their trainees
create policy "Managers can view trainee profiles"
  on public.profiles for select
  to authenticated
  using (
    exists (
      select 1 from public.manager_assignments ma
      join public.user_roles ur on ur.user_id = ma.manager_id
      where ma.trainee_id = profiles.id
        and ma.manager_id = auth.uid()
        and ur.role = 'manager'
    )
  );

-- Profiles: Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- Lesson Completions: Users can view/insert their own
create policy "Users can manage own completions"
  on public.lesson_completions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Lesson Completions: Managers can view trainee completions
create policy "Managers can view trainee completions"
  on public.lesson_completions for select
  to authenticated
  using (
    exists (
      select 1 from public.manager_assignments
      where trainee_id = lesson_completions.user_id
        and manager_id = auth.uid()
    )
  );

-- Products, Modules, Lessons: All authenticated users can read
create policy "All users can view courses"
  on public.products for select
  to authenticated
  using (is_active = true);

create policy "All users can view modules"
  on public.modules for select
  to authenticated
  using (true);

create policy "All users can view lessons"
  on public.lessons for select
  to authenticated
  using (true);

-- Admins can modify courses
create policy "Admins can manage products"
  on public.products for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));
```

## 5. Storage Buckets

### 5.1 Required Buckets

```sql
-- Create storage buckets
insert into storage.buckets (id, name, public)
values 
  ('lesson-videos', 'lesson-videos', false),
  ('lesson-attachments', 'lesson-attachments', false),
  ('certificates', 'certificates', false);
```

### 5.2 Storage RLS Policies

```sql
-- lesson-videos: Authenticated users can view
create policy "Authenticated users can view videos"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lesson-videos');

-- lesson-videos: Admins can upload/delete
create policy "Admins can manage videos"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'lesson-videos' 
    and public.has_role(auth.uid(), 'admin')
  );

-- lesson-attachments: Similar policies
create policy "Authenticated users can download attachments"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'lesson-attachments');

create policy "Admins can manage attachments"
  on storage.objects for all
  to authenticated
  using (
    bucket_id = 'lesson-attachments'
    and public.has_role(auth.uid(), 'admin')
  );

-- certificates: Users can only view their own
create policy "Users can view own certificates"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'certificates'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
```

## 6. Edge Functions (Serverless APIs)

### 6.1 `ai-call-simulation`

**Purpose:** Powers the AI call simulation using OpenAI's Realtime API or Chat Completions API.

**Method:** POST  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "simulation_id": "uuid",
  "user_message": "string (user's spoken/typed input)"
}
```

**Response:**
```json
{
  "ai_response": "string",
  "transcript_entry": {
    "speaker": "ai",
    "text": "string",
    "timestamp": "ISO 8601"
  }
}
```

**Implementation Notes:**
- Use OpenAI API (requires `OPENAI_API_KEY` secret)
- Fetch simulation system prompt from `simulations` table
- Maintain conversation history in the session
- Return AI's response for text-to-speech playback

### 6.2 `evaluate-simulation`

**Purpose:** Evaluates a completed simulation and generates a report card with inline feedback.

**Method:** POST  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "simulation_id": "uuid",
  "transcript": [
    { "speaker": "ai|user", "text": "string", "timestamp": "ISO 8601" }
  ]
}
```

**Response:**
```json
{
  "overall_score": 88,
  "script_adherence": 95,
  "empathy_score": "Good",
  "call_flow_score": 80,
  "transcript_with_feedback": [
    {
      "speaker": "ai",
      "text": "I've been overcharged!",
      "timestamp": "..."
    },
    {
      "speaker": "user",
      "text": "What's your account number?",
      "timestamp": "...",
      "feedback": {
        "rating": "poor",
        "comment": "You failed to show empathy first. Try: 'I'm so sorry to hear that...'"
      }
    }
  ]
}
```

**Implementation Notes:**
- Use OpenAI API with structured output (tool calling)
- Provide the full transcript and evaluation criteria
- Insert result into `simulation_attempts` table

### 6.3 `generate-certificate`

**Purpose:** Generates a PDF certificate when a trainee completes all modules.

**Method:** POST  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "product_id": "uuid"
}
```

**Response:**
```json
{
  "certificate_url": "https://...storage.../certificates/{user_id}/{product_id}.pdf"
}
```

**Implementation Notes:**
- Verify all modules/lessons are completed
- Use a PDF generation library (e.g., `pdfkit` or `jspdf` in Deno)
- Upload PDF to `certificates` storage bucket
- Insert record into `certifications` table

### 6.4 `send-notification-email`

**Purpose:** Sends email notifications (e.g., "Congratulations, you're certified!").

**Method:** POST  
**Authentication:** Required (JWT)  
**Request Body:**
```json
{
  "to_email": "string",
  "template": "certification_complete",
  "data": { "user_name": "string", "product_title": "string" }
}
```

**Response:**
```json
{
  "success": true,
  "message_id": "string"
}
```

**Implementation Notes:**
- Use Resend API (requires `RESEND_API_KEY` secret)
- Support multiple email templates
- Handle errors gracefully

### 6.5 `get-user-progress`

**Purpose:** Calculates overall progress for a trainee on a specific product.

**Method:** GET  
**Authentication:** Required (JWT)  
**Query Params:** `?product_id=uuid&user_id=uuid`

**Response:**
```json
{
  "overall_progress": 65,
  "modules": [
    {
      "module_id": "uuid",
      "title": "Module 1",
      "progress": 100,
      "completed_lessons": 5,
      "total_lessons": 5,
      "is_locked": false
    },
    {
      "module_id": "uuid",
      "title": "Module 2",
      "progress": 60,
      "completed_lessons": 3,
      "total_lessons": 5,
      "is_locked": false
    }
  ]
}
```

**Implementation Notes:**
- Query `lesson_completions` table
- Check prerequisite logic for locked modules
- Return aggregated data

### 6.6 `get-team-progress` (Manager only)

**Purpose:** Returns progress data for all trainees assigned to a manager.

**Method:** GET  
**Authentication:** Required (JWT, must have 'manager' role)  
**Response:**
```json
{
  "team_stats": {
    "total_agents": 15,
    "certified": 8,
    "in_progress": 7
  },
  "agents": [
    {
      "user_id": "uuid",
      "full_name": "John Doe",
      "certification_status": "Certified|In Progress|Not Started",
      "overall_progress": 100,
      "last_activity": "ISO 8601"
    }
  ]
}
```

## 7. Required Environment Variables / Secrets

Add these via Supabase Dashboard or Lovable Cloud:

- `OPENAI_API_KEY` - For AI call simulations
- `RESEND_API_KEY` - For email notifications

## 8. API Client Integration (Frontend)

### 8.1 Supabase Client Setup

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

### 8.2 Example Queries

**Fetch all products:**
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('is_active', true)
```

**Fetch modules with lessons:**
```typescript
const { data, error } = await supabase
  .from('modules')
  .select(`
    *,
    lessons (*)
  `)
  .eq('product_id', productId)
  .order('order_index')
```

**Mark lesson as complete:**
```typescript
const { error } = await supabase
  .from('lesson_completions')
  .insert({
    user_id: userId,
    lesson_id: lessonId
  })
```

**Submit quiz attempt:**
```typescript
const { error } = await supabase
  .from('quiz_attempts')
  .insert({
    user_id: userId,
    quiz_id: quizId,
    score: 85,
    passed: true,
    answers: [/* ... */]
  })
```

**Call edge function:**
```typescript
const { data, error } = await supabase.functions.invoke('ai-call-simulation', {
  body: { simulation_id: 'uuid', user_message: 'Hello' }
})
```

## 9. Content Dripping Logic

**Requirement:** Modules can be locked until the previous module is completed.

**Implementation:**
1. Set `is_prerequisite = true` on a module to enable content dripping
2. In the `get-user-progress` function, check if all lessons in the previous module are completed before unlocking the next module
3. Frontend should gray out locked modules and display a lock icon

**Example Query:**
```sql
select 
  m.id,
  m.title,
  case 
    when m.is_prerequisite and (
      select count(*)
      from lessons l
      join lesson_completions lc on lc.lesson_id = l.id
      where l.module_id = prev_module.id and lc.user_id = $user_id
    ) < (
      select count(*)
      from lessons
      where module_id = prev_module.id
    ) then true
    else false
  end as is_locked
from modules m
left join modules prev_module on prev_module.order_index = m.order_index - 1
```

## 10. Testing Checklist

### Database
- [ ] All tables created with correct foreign keys
- [ ] RLS policies tested for each role (trainee, manager, admin)
- [ ] Triggers fire correctly (e.g., profile creation on signup)

### Authentication
- [ ] Users can sign up and log in
- [ ] Users are assigned default 'trainee' role
- [ ] Role checks work correctly in RLS policies

### Storage
- [ ] Videos upload and stream correctly
- [ ] PDFs download correctly
- [ ] RLS policies prevent unauthorized access

### Edge Functions
- [ ] `ai-call-simulation` returns valid AI responses
- [ ] `evaluate-simulation` generates accurate scores and feedback
- [ ] `generate-certificate` creates valid PDFs
- [ ] `send-notification-email` delivers emails

### Frontend Integration
- [ ] Trainee can view and complete lessons
- [ ] Quizzes submit and score correctly
- [ ] Simulations record attempts with full transcripts
- [ ] Managers can view team progress
- [ ] Admins can create/edit courses

## 11. Deployment Steps

1. **Enable Lovable Cloud / Supabase**
2. **Run all SQL migrations** (create tables, RLS policies, storage buckets)
3. **Add secrets** (OPENAI_API_KEY, RESEND_API_KEY)
4. **Deploy edge functions**
5. **Upload seed data** (sample products, modules, lessons)
6. **Create test users** with different roles
7. **Test critical user flows**

## 12. Future Enhancements

- Real-time audio streaming for simulations (WebRTC/WebSockets)
- Analytics dashboard for admins
- Gamification (badges, leaderboards)
- Multi-language support
- SCORM compliance for enterprise LMS integration
- Mobile app (React Native)

---

**End of Backend Technical Specification**
