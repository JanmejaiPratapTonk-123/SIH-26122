# Plan2Progress
> AI-powered Planning-to-Execution Bridge for Infrastructure Project Management

---

## 1. Project Overview

**Plan2Progress** is an intelligent data capture and schedule-linking platform designed to bridge the gap between high-level project master schedules and ground-level execution realities. In large-scale infrastructure and energy projects, daily field progress is often fragmented across unstructured reports, site logs, spreadsheets, and informal updates. Plan2Progress ingests these heterogeneous inputs, extracts operational progress events using NLP, and semantically maps them to granular (L5/L6) schedule activities—enabling real-time actual progress tracking, transparent audit trails, and data-driven project controls.

---

## 2. SIH Problem Statement

- **Problem Statement ID:** SIH26122
- **Title:** Intelligent Data Capture & Schedule-Linking Layer for Infrastructure Project Management: Real-Time Actual Progress Tracking (Planning-to-Execution Bridge)
- **Organization:** Oil India Limited
- **Category:** Software
- **Theme:** Smart Automation

---

## 3. Problem We Are Solving

Infrastructure and capital projects frequently encounter significant time and cost overruns due to a disconnect between project management schedules and site execution:

- **Information Silos & Lag:** Daily progress reports (DPRs), contractor spreadsheets, and site notes take days or weeks to be synthesized into schedule updates.
- **Granular Activity Disconnect:** Master schedules define detailed Level 5/Level 6 work breakdown structures (WBS), but field updates lack standardized naming conventions or direct cross-referencing.
- **Manual Overhead & Errors:** Project planners spend substantial manual effort deciphering ambiguous field updates, leading to subjective reporting and lack of verifiable auditability.
- **Lack of Early Warning:** Without real-time actual start and finish dates, delays compound unnoticed until critical milestones are breached.

---

## 4. Proposed Solution

Plan2Progress provides an automated, AI-assisted layer that connects field data directly to the project schedule:

- **Automated Extraction:** Ingests daily progress reports, structured spreadsheets, and supervisor logs to parse operational updates, milestones, quantities, and dates.
- **Semantic Activity Matching:** Leverages NLP embedding models and fuzzy matching algorithms to accurately pair field-reported accomplishments with formal L5/L6 schedule activities.
- **Confidence Scoring & Human-in-the-Loop:** Assigns confidence scores to each candidate match, providing intuitive verification workflows for planners while automating high-confidence linkages.
- **Real-Time Schedule Synchronization:** Updates actual start/finish dates, percent complete, and progress velocity, delivering timely operational visibility.

---

## 5. Core Workflow

```
Schedule / L5-L6 activities
         │
         ▼
Field reports / spreadsheets / supervisor inputs
         │
         ▼
Data extraction
         │
         ▼
Activity matching
         │
         ▼
Confidence scoring
         │
         ▼
Human review
         │
         ▼
Schedule update
         │
         ▼
Monitoring and analytics
```

---

## 6. Key Features

- **Heterogeneous Input Ingestion:** Support for unstructured text reports, structured spreadsheets (Excel/CSV), and supervisor inputs.
- **Activity/Event Extraction:** Automated extraction of work descriptions, quantities, locations, and execution dates from raw field updates.
- **L5/L6 Semantic & Fuzzy Matching:** Context-aware matching between field descriptions and granular schedule WBS items.
- **Confidence Scoring:** Transparent match confidence metrics to guide review prioritization.
- **Human-in-the-Loop Review:** Streamlined planner verification interface to approve, adjust, or reject suggested activity mappings.
- **Actual Start/End Tracking:** Automated recording of actual execution timelines against baseline schedules.
- **Audit Trail:** Immutable logging of data sources, match history, and planner approvals for complete compliance.
- **Progress Analytics:** Real-time dashboards displaying progress velocity, variance analysis, and milestone tracking.
- **Institutional Memory:** Progressive learning from planner corrections to enhance future matching accuracy on project-specific nomenclature.

---

## 7. Planned Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** FastAPI, Python
- **Database:** PostgreSQL
- **NLP / AI:** Sentence Transformers, spaCy, LLM-based extraction
- **Data Processing:** pandas
- **Excel Processing:** openpyxl
- **OCR (Planned):** Tesseract / PaddleOCR

---

## 8. Repository Structure

```
Plan2Progress/
├── frontend/        # React + Vite web client (planned)
├── backend/         # FastAPI REST APIs and core services (planned)
├── ml/              # NLP pipelines, embedding models, and matching logic
├── data/            # Sample schedules, templates, and schemas
├── docs/            # Architecture specifications and documentation
├── .gitignore       # Repository git ignore configuration
└── README.md        # Project documentation
```

---

## 9. Development Roadmap

- [x] **Phase 0: Project Setup & Architecture Definition**
  - Repository structure initialization
  - Scope and requirements alignment
- [ ] **Phase 1: Ingestion & Extraction Engine**
  - Parsing pipelines for Excel/CSV and text field reports
  - Named entity and event extraction module
- [ ] **Phase 2: Semantic Matching & Scoring**
  - Embedding pipeline for L5/L6 schedule activities
  - Hybrid fuzzy + vector similarity matching model
- [ ] **Phase 3: Backend API & Database Layer**
  - FastAPI endpoints for ingestion, mapping, and schedule sync
  - PostgreSQL schema for schedules, logs, and audit trails
- [ ] **Phase 4: Frontend Web Interface**
  - Interactive planner review dashboard
  - Progress monitoring and variance visualization
- [ ] **Phase 5: Validation & Deployment**
  - End-to-end testing with realistic infrastructure project schedules
  - Containerization and deployment readiness

---

## 10. Future Scope

- Direct two-way integration with enterprise project management tools (e.g., Primavera P6, Microsoft Project).
- On-site mobile companion application for real-time supervisor logging and photo attachment.
- Predictive delay forecasting and critical path impact modeling based on historical progress velocity.
- Multi-language support for regional field reporting dialects.

---

## 11. Team / Contributors

- **Team Name:** [To be added]
- **Members:**
  - Contributor 1 - [Role / Responsibility]
  - Contributor 2 - [Role / Responsibility]
  - Contributor 3 - [Role / Responsibility]
  - Contributor 4 - [Role / Responsibility]
  - Contributor 5 - [Role / Responsibility]
  - Contributor 6 - [Role / Responsibility]
