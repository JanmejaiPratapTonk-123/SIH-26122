# Plan2Progress Backend (SIH 2026)

AI-assisted Planning-to-Execution Bridge for infrastructure projects.

The backend ingests project schedules (Primavera P6, CSV, XLSX) and field progress reports (PDF, XLSX, CSV), extracts actual progress events, semantically matches them to L5/L6 schedule activities with explainable confidence scores, provides a planner review queue with approval/overrule actions, updates actual progress in the schedule, and generates an immutable audit trail.

---

## 🛠️ Tech Stack

- **Framework**: FastAPI (async Python 3.10+)
- **ORM**: SQLAlchemy 2.0 (AsyncSession)
- **Database**: Supabase PostgreSQL
- **Migrations**: Alembic
- **Security**: JWT tokens (python-jose), bcrypt password hashing, Role-Based Access Control (RBAC)
- **Validation**: Pydantic v2 (Pydantic-Settings)
- **File & Data Ingestion**: PyPDF2, openpyxl, pandas, python-multipart

---

## 📂 Project Structure

```
backend/
├── alembic/                      # Database migrations
│   ├── versions/                 # Revision scripts
│   │   └── 001_initial_schema.py # Initial 11-table schema
│   ├── env.py                    # Async migration environment
│   └── script.py.mako            # Migration template
├── alembic.ini                   # Alembic configuration
├── app/
│   ├── api/                      # REST API Endpoints
│   │   ├── admin.py              # System Admin Console endpoints
│   │   ├── audit.py              # Audit log, timeline & activity feeds
│   │   ├── auth.py               # Authentication & user profile endpoints
│   │   ├── matches.py            # Planner review queue, approvals & rejects
│   │   ├── projects.py           # Projects and team member assignments
│   │   ├── reports.py            # Report uploads, extraction & supervisor DPRs
│   │   ├── router.py             # Master /api/v1 router
│   │   ├── schedules.py          # Schedule uploads & activity queries
│   │   └── supervisor.py         # Field notes & supervisor updates
│   ├── core/
│   │   ├── config.py             # Pydantic BaseSettings (env vars)
│   │   └── security.py           # JWT, password hashing, and role dependencies
│   ├── db/
│   │   ├── database.py           # Async engine, sessionmaker & Base
│   │   └── seed.py               # Seed script populated with realistic SIH data
│   ├── models/
│   │   └── models.py             # SQLAlchemy 2.x ORM models
│   ├── repositories/             # Data access repository layer
│   │   ├── audit_repository.py
│   │   ├── base.py
│   │   ├── match_repository.py
│   │   ├── project_repository.py
│   │   ├── report_repository.py
│   │   ├── schedule_repository.py
│   │   ├── supervisor_repository.py
│   │   └── user_repository.py
│   ├── schemas/                  # Pydantic v2 schemas matching frontend types
│   │   ├── admin.py
│   │   ├── audit.py
│   │   ├── auth.py
│   │   ├── common.py
│   │   ├── matching.py
│   │   ├── project.py
│   │   ├── report.py
│   │   ├── schedule.py
│   │   └── supervisor.py
│   ├── services/                 # Business logic & AI/ML pipelines
│   │   ├── audit_service.py      # Timeline & activity presentation
│   │   ├── extraction_service.py # Deterministic & extensible event extractor
│   │   ├── matching_service.py   # Deterministic & extensible semantic matcher
│   │   ├── report_service.py     # End-to-end report processing pipeline
│   │   ├── review_service.py     # Planner queue & progress updates
│   │   └── schedule_service.py   # Schedule ingestion and activity parsing
│   └── main.py                   # FastAPI app, CORS, lifespan & health checks
├── tests/                        # Pytest suite
│   ├── test_api.py
│   ├── test_extraction.py
│   └── test_matching.py
├── .env.example                  # Environment configuration template
└── requirements.txt              # Production and test Python dependencies
```

---

## 🚀 Setup & Installation

### 1. Create Python Virtual Environment

```bash
cd backend
python -m venv venv

# On Windows:
.\venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and configure your Supabase PostgreSQL connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql+asyncpg://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres
SECRET_KEY=generate-a-secure-random-key-here
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:5173","http://127.0.0.1:5173"]
```

---

## 🗄️ Database Migrations & Seeding

### 1. Run Alembic Migrations

To apply all database tables to your Supabase PostgreSQL database:

```bash
alembic upgrade head
```

### 2. Seed Initial Data

Populate initial users, project, schedule, L5/L6 activities, reports, review queue items, and audit logs:

```bash
python -m app.db.seed
```

---

## 🏃 Running the Application

### Start the FastAPI Dev Server

```bash
uvicorn app.main:app --reload --port 8000
```

- **Interactive API Docs (Swagger UI)**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc Documentation**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
- **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Running Tests

```bash
pytest
```

---

## 🔌 Frontend Integration Mapping

The backend API contracts are strictly shaped to match the existing React frontend (`frontend/src/types.ts`):

| Frontend Screen | API Endpoint | Description |
|---|---|---|
| **Login / Role Switcher** | `POST /api/v1/auth/login`<br>`GET /api/v1/auth/users` | Authenticates role user, returns `UserProfile` |
| **Site Reports Screen** | `GET /api/v1/reports`<br>`POST /api/v1/reports/upload` | Lists DPRs, uploads report & triggers AI extraction/matching |
| **Match Review Screen** | `GET /api/v1/matches/queue`<br>`POST /api/v1/matches/{id}/approve`<br>`POST /api/v1/matches/{id}/reject` | ReviewQueueItems with confidence, approve updates activity progress into P6 |
| **Home Screen Dashboard** | `GET /api/v1/audit/timeline`<br>`GET /api/v1/projects` | Recent timeline updates and project KPI status |
| **Supervisor Screens** | `GET /api/v1/supervisor/notes`<br>`POST /api/v1/supervisor/notes`<br>`GET /api/v1/supervisor/updates` | Field observation logs and activity verification status |
| **Admin Console** | `GET /api/v1/admin/users`<br>`GET /api/v1/admin/contractors`<br>`GET /api/v1/admin/data-sources`<br>`GET /api/v1/admin/ai-settings` | System configuration, connectors, and audit trail |
