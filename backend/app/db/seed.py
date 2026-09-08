"""
Plan2Progress — Database Seeder Script.

Seeds standard users, project, schedule, L1-L6 hierarchical activities,
reports, progress events, candidate matches (Pending, Approved, Rejected),
audit logs, shift notes, and enterprise data sources.

Safe to run repeatedly in development (safely resets existing seed data).
"""

import asyncio
import uuid
from datetime import datetime, date, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete

from app.db.database import async_session_factory, Base, engine
from app.core.security import hash_password
from app.models.models import (
    User,
    Project,
    UserProject,
    Schedule,
    Activity,
    ProgressReport,
    ProgressEvent,
    ActivityMatch,
    AuditLog,
    ShiftNote,
    DataSource,
)


async def seed_data():
    async with async_session_factory() as db:
        print("Resetting development seed data...")

        # 0. Clean up in reverse dependency order for safe re-runs
        await db.execute(delete(AuditLog))
        await db.execute(delete(ShiftNote))
        await db.execute(delete(ActivityMatch))
        await db.execute(delete(ProgressEvent))
        await db.execute(delete(ProgressReport))
        await db.execute(delete(Activity))
        await db.execute(delete(Schedule))
        await db.execute(delete(UserProject))
        await db.execute(delete(Project))
        await db.execute(delete(DataSource))
        await db.execute(delete(User))
        await db.flush()

        print("Seeding new development dataset...")

        # -------------------------------------------------------------------
        # 1. Users
        # -------------------------------------------------------------------
        default_pwd = hash_password("password123")

        u_planner = User(
            id=uuid.uuid4(),
            name="Vikramaditya Sharma",
            email="vikram.sharma@plan2progress.in",
            password_hash=default_pwd,
            role="Chief Planning Engineer",
            role_type="planner",
            department="Project Controls & Scheduling",
            initials="VS",
            avatar_color="#004D40",
            permissions=[
                "Upload & Ingest Progress Reports",
                "Review & Overrule AI Candidate Matches",
                "Approve Progress into Primavera P6",
                "Manage WBS / Activity Mappings",
                "Export Audit Trail & Claim Packages",
                "Configure Confidence Thresholds",
            ],
            disallowed_actions=[
                "Direct Site Report Submission",
                "System User Administration",
                "Contractor Billing Sign-off",
            ],
        )

        u_manager = User(
            id=uuid.uuid4(),
            name="Ananya Roy Chowdhury",
            email="ananya.rc@infrastructure.gov.in",
            password_hash=default_pwd,
            role="Project Director (Owner / Client)",
            role_type="manager",
            department="Executive Oversight & Governance",
            initials="AR",
            avatar_color="#1E3A8A",
            permissions=[
                "Executive KPI & Progress Analytics",
                "Milestone & Critical Path Oversight",
                "Variance & Slippage Alerts Review",
                "Read-only Match Review & Audit Trail",
                "Contractor Performance Dashboards",
                "Generate Board Progress Reports",
            ],
            disallowed_actions=[
                "Schedule Baseline Modification",
                "Match Review Approval / Rejection",
                "Site Report Upload",
            ],
        )

        u_supervisor = User(
            id=uuid.uuid4(),
            name="Bupendra Hazarika",
            email="b.hazarika@siteops.in",
            password_hash=default_pwd,
            role="Resident Construction Engineer",
            role_type="supervisor",
            department="Field Operations — Section B",
            initials="BH",
            avatar_color="#0D9488",
            permissions=[
                "Submit Daily Progress Reports (DPR)",
                "Log Shift Notes, Weather & Manpower",
                "Upload Geotagged Site Inspection Photos",
                "View Assigned Chainage WBS Activities",
                "Track Status of Submitted Field Updates",
                "Flag Field Obstructions & Delays",
            ],
            disallowed_actions=[
                "Primavera P6 Progress Approval",
                "Schedule Logic Modification",
                "Audit Trail Modification",
            ],
        )

        u_contractor = User(
            id=uuid.uuid4(),
            name="Praveen K. Bora",
            email="p.bora@kalpataru-epc.com",
            password_hash=default_pwd,
            role="Lead Project Manager (EPC Contractor)",
            role_type="contractor",
            department="Kalpataru Field Ops — Package 2",
            initials="PB",
            avatar_color="#D97706",
            permissions=[
                "Submit Contractor Daily & Weekly DPRs",
                "View Contract Milestone Status",
                "Log Turnkey Equipment & Labor Deployment",
                "Submit Billing Progress Claims",
                "Respond to Planner Verification Requests",
            ],
            disallowed_actions=[
                "Direct Primavera P6 Approval",
                "View Internal Owner Contingency Float",
                "Manage Other Contractors' Packages",
            ],
        )

        u_admin = User(
            id=uuid.uuid4(),
            name="Devendra Nath Sarmah",
            email="admin@plan2progress.in",
            password_hash=default_pwd,
            role="Lead System Administrator",
            role_type="admin",
            department="IT Infrastructure & Platform Governance",
            initials="DS",
            avatar_color="#7C3AED",
            permissions=[
                "User Provisioning & Role-Based Access Control",
                "Enterprise Data Source & P6 Connector Setup",
                "AI Model Pipeline & Confidence Threshold Config",
                "System Audit Logs & Security Compliance",
                "Project Creation, Archival & Tenant Settings",
                "Database Health, Backups & Integration Monitoring",
            ],
            disallowed_actions=[],
        )

        db.add_all([u_planner, u_manager, u_supervisor, u_contractor, u_admin])
        await db.flush()

        # -------------------------------------------------------------------
        # 2. Project
        # -------------------------------------------------------------------
        proj = Project(
            id=uuid.uuid4(),
            name="Duliajan Gas Processing Plant & Trunk Pipeline",
            code="DGPP-2026",
            location="Assam, India",
            manager="Ananya Roy Chowdhury",
            progress_pct=68.4,
            status="On Track",
            schedule_status="Healthy",
            open_issues=2,
            start_date=date(2025, 4, 1),
            target_completion=date(2027, 3, 31),
            description="380 MMSCMD Gas Processing Facility and 110km High-Pressure Natural Gas Pipeline Corridor.",
        )
        db.add(proj)
        await db.flush()

        # -------------------------------------------------------------------
        # 3. User ↔ Project Assignments
        # -------------------------------------------------------------------
        for u in [u_planner, u_manager, u_supervisor, u_contractor, u_admin]:
            db.add(UserProject(user_id=u.id, project_id=proj.id, role_in_project=u.role))
        await db.flush()

        # -------------------------------------------------------------------
        # 4. Schedule
        # -------------------------------------------------------------------
        schedule = Schedule(
            id=uuid.uuid4(),
            project_id=proj.id,
            file_name="DGPP_Master_Baseline_Rev4.xer",
            file_type="xer",
            version=4,
            total_activities=24,
            baseline_start=date(2025, 4, 1),
            baseline_finish=date(2027, 3, 31),
            uploaded_by="Vikramaditya Sharma",
            status="Active",
        )
        db.add(schedule)
        await db.flush()

        # -------------------------------------------------------------------
        # 5. Hierarchical Activities (L1 - L6) across 3 Disciplines
        # Disciplines: Mechanical/Piping, Civil/Structural, Electrical/Instrumentation
        # -------------------------------------------------------------------
        activities_data = [
            # L1 - Project Root
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01",
                name="Duliajan Gas Processing Plant Facility & Trunkline",
                wbs_code="01",
                work_package="Program Management",
                level="L1",
                planned_quantity=100.0,
                actual_quantity=68.4,
                uom="%",
                progress_pct=68.4,
                status="In Progress",
                is_critical=True,
                float_days=0,
            ),
            # L2 - Civil Discipline Root
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.CIV",
                name="Civil & Structural Works Package",
                wbs_code="01.01",
                work_package="Civil Engineering",
                level="L2",
                planned_quantity=100.0,
                actual_quantity=62.0,
                uom="%",
                progress_pct=62.0,
                status="In Progress",
                is_critical=False,
                float_days=14,
            ),
            # L3 - Civil Foundations
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.CIV.FND",
                name="Station Heavy Equipment Foundations",
                wbs_code="01.01.01",
                work_package="Civil Engineering",
                level="L3",
                planned_quantity=100.0,
                actual_quantity=58.0,
                uom="%",
                progress_pct=58.0,
                status="In Progress",
                is_critical=True,
                float_days=0,
            ),
            # L4 - Compressor Foundation Pad TB-02
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L4-CIV-COMP-012",
                name="Compressor Foundation Concreting TB-02",
                wbs_code="01.01.01.02",
                work_package="Civil Works → Compressor Station",
                level="L4",
                planned_start=date(2026, 8, 15),
                planned_finish=date(2026, 9, 20),
                planned_quantity=320.0,
                actual_quantity=140.0,
                uom="m³",
                progress_pct=43.75,
                status="In Progress",
                corridor_start="Pad TB-02",
                corridor_finish="Pad TB-02",
                is_critical=True,
                float_days=-4,
            ),
            # L4 - Pipe Rack Structural Steel
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L4-STR-PRACK-008",
                name="Structural Steel Erection - Pipe Racks PR-01",
                wbs_code="01.01.02.01",
                work_package="Civil/Structural → Pipe Racks",
                level="L4",
                planned_start=date(2026, 8, 28),
                planned_finish=date(2026, 9, 25),
                planned_quantity=45.0,
                actual_quantity=21.0,
                uom="MT",
                progress_pct=46.67,
                status="In Progress",
                corridor_start="Pipe Rack PR-01",
                corridor_finish="Pipe Rack PR-01",
                is_critical=False,
                float_days=6,
            ),
            # L2 - Mechanical & Piping Root
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.MEC",
                name="Mechanical Equipment & Cross-Country Piping",
                wbs_code="01.02",
                work_package="Mechanical Discipline",
                level="L2",
                planned_quantity=100.0,
                actual_quantity=71.2,
                uom="%",
                progress_pct=71.2,
                status="In Progress",
                is_critical=True,
                float_days=0,
            ),
            # L3 - Trunkline Piping
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.MEC.TRUNK",
                name="Mainline 24-inch Trunk Pipeline Section B",
                wbs_code="01.02.01",
                work_package="Pipeline Construction",
                level="L3",
                planned_quantity=100.0,
                actual_quantity=64.5,
                uom="%",
                progress_pct=64.5,
                status="In Progress",
                is_critical=True,
                float_days=0,
            ),
            # L5 - Guaranteed Demo Activity: PIP-204 — Erect Line 24-P-XX
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="PIP-204",
                name="Erect Line 24-P-XX",
                wbs_code="01.02.01.04",
                work_package="Mechanical → Spool Erection",
                level="L5",
                planned_start=date(2026, 9, 1),
                planned_finish=date(2026, 9, 15),
                planned_quantity=180.0,
                actual_quantity=0.0,
                uom="m",
                progress_pct=0.0,
                status="Not Started",
                corridor_start="KP 14+200",
                corridor_finish="KP 14+500",
                is_critical=True,
                float_days=0,
                remarks="High pressure 24-inch gas spool section connecting slug catcher to compressor header.",
            ),
            # L5 - Mainline Welding
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L5-MECH-WELD-024",
                name="Mainline Pipeline Welding & NDT Sector C",
                wbs_code="01.02.01.02",
                work_package="Mechanical → Mainline Welding",
                level="L5",
                planned_start=date(2026, 8, 20),
                planned_finish=date(2026, 9, 30),
                planned_quantity=160.0,
                actual_quantity=88.0,
                uom="joints",
                progress_pct=55.0,
                status="In Progress",
                corridor_start="KP 18+000",
                corridor_finish="KP 18+500",
                is_critical=True,
                float_days=2,
            ),
            # L6 - Pipeline Trench Excavation
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L6-PIPE-EXC-042",
                name="Pipeline Trench Excavation (KP 12+400 to 12+850)",
                wbs_code="01.02.01.01",
                work_package="Pipeline → Trench Excavation",
                level="L6",
                planned_start=date(2026, 8, 25),
                planned_finish=date(2026, 9, 18),
                planned_quantity=1200.0,
                actual_quantity=700.0,
                uom="m",
                progress_pct=58.33,
                status="In Progress",
                corridor_start="KP 12+000",
                corridor_finish="KP 13+200",
                is_critical=True,
                float_days=0,
            ),
            # L6 - Alternative Candidate 1
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L6-TIEIN-TR-018",
                name="Compressor Tie-in Corridor Trenching",
                wbs_code="01.02.01.03",
                work_package="Tie-in Piping",
                level="L6",
                planned_start=date(2026, 9, 10),
                planned_finish=date(2026, 9, 28),
                planned_quantity=500.0,
                actual_quantity=0.0,
                uom="m",
                progress_pct=0.0,
                status="Not Started",
                corridor_start="KP 13+000",
                corridor_finish="KP 13+500",
                is_critical=False,
                float_days=8,
            ),
            # L6 - Alternative Candidate 2
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L6-VALV-EXC-002",
                name="Valve Station Pit Excavation",
                wbs_code="01.02.01.05",
                work_package="Valve Stations",
                level="L6",
                planned_start=date(2026, 9, 15),
                planned_finish=date(2026, 10, 5),
                planned_quantity=300.0,
                actual_quantity=0.0,
                uom="m",
                progress_pct=0.0,
                status="Not Started",
                corridor_start="Valve Stn 01",
                corridor_finish="Valve Stn 01",
                is_critical=False,
                float_days=12,
            ),
            # L5 - Field Joint Coating
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L5-MECH-COAT-009",
                name="Field Joint Coating & Holiday Testing",
                wbs_code="01.02.01.06",
                work_package="Mechanical → Pipeline Coating",
                level="L5",
                planned_start=date(2026, 8, 25),
                planned_finish=date(2026, 9, 25),
                planned_quantity=160.0,
                actual_quantity=72.0,
                uom="joints",
                progress_pct=45.0,
                status="In Progress",
                corridor_start="KP 18+000",
                corridor_finish="KP 18+500",
                is_critical=False,
                float_days=5,
            ),
            # L5 - Hydrotesting Section 1
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L5-MECH-HYDRO-011",
                name="Hydrostatic Pressure Testing Sector 1",
                wbs_code="01.02.02.01",
                work_package="Mechanical → Commissioning",
                level="L5",
                planned_start=date(2026, 10, 1),
                planned_finish=date(2026, 10, 15),
                planned_quantity=24.0,
                actual_quantity=0.0,
                uom="km",
                progress_pct=0.0,
                status="Not Started",
                corridor_start="KP 00+000",
                corridor_finish="KP 24+000",
                is_critical=True,
                float_days=0,
            ),
            # L2 - Electrical & Instrumentation Discipline Root
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.ELE",
                name="Electrical, Instrumentation & Telecom Works",
                wbs_code="01.03",
                work_package="E&I Discipline",
                level="L2",
                planned_quantity=100.0,
                actual_quantity=48.5,
                uom="%",
                progress_pct=48.5,
                status="In Progress",
                is_critical=False,
                float_days=10,
            ),
            # L3 - Substation & Power Distribution
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="DGPP-01.ELE.SUB",
                name="Plant Main 33kV Substation & Transformers",
                wbs_code="01.03.01",
                work_package="Electrical Systems",
                level="L3",
                planned_quantity=100.0,
                actual_quantity=52.0,
                uom="%",
                progress_pct=52.0,
                status="In Progress",
                is_critical=False,
                float_days=12,
            ),
            # L4 - Transformer Installation
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L4-ELE-SUBST-003",
                name="33kV Substation Transformer Placement Pad TR-01",
                wbs_code="01.03.01.02",
                work_package="Electrical → Transformers",
                level="L4",
                planned_start=date(2026, 8, 10),
                planned_finish=date(2026, 9, 12),
                planned_quantity=2.0,
                actual_quantity=2.0,
                uom="units",
                progress_pct=100.0,
                status="Completed",
                corridor_start="Pad TR-01",
                corridor_finish="Pad TR-01",
                is_critical=False,
                float_days=20,
            ),
            # L5 - Cable Tray Installation
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L5-ELE-TRAY-015",
                name="Instrumentation Cable Tray Installation Section B",
                wbs_code="01.03.02.01",
                work_package="Electrical → Cable Trays",
                level="L5",
                planned_start=date(2026, 8, 20),
                planned_finish=date(2026, 9, 22),
                planned_quantity=850.0,
                actual_quantity=420.0,
                uom="m",
                progress_pct=49.41,
                status="In Progress",
                corridor_start="Pipe Rack PR-01",
                corridor_finish="Substation SS-01",
                is_critical=False,
                float_days=8,
            ),
            # L5 - Cable Pulling
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L5-ELE-PULL-022",
                name="HV Power Feeder Cable Pulling & Termination",
                wbs_code="01.03.02.02",
                work_package="Electrical → Cabling",
                level="L5",
                planned_start=date(2026, 9, 1),
                planned_finish=date(2026, 9, 30),
                planned_quantity=1400.0,
                actual_quantity=600.0,
                uom="m",
                progress_pct=42.86,
                status="In Progress",
                corridor_start="SS-01",
                corridor_finish="Compressor Pad",
                is_critical=False,
                float_days=9,
            ),
            # L6 - Loop Checking
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L6-INST-LOOP-007",
                name="Pressure Transmitter PT-204 Loop Checking",
                wbs_code="01.03.03.01",
                work_package="Instrumentation → Loop Checking",
                level="L6",
                planned_start=date(2026, 9, 15),
                planned_finish=date(2026, 9, 30),
                planned_quantity=28.0,
                actual_quantity=0.0,
                uom="loops",
                progress_pct=0.0,
                status="Not Started",
                corridor_start="Pad TB-02",
                corridor_finish="Control Room",
                is_critical=False,
                float_days=15,
            ),
            # L6 - Flow Meter Calibration
            Activity(
                id=uuid.uuid4(),
                schedule_id=schedule.id,
                activity_code="L6-INST-CALB-014",
                name="Ultrasonic Flow Meter FT-101 Calibration & Certification",
                wbs_code="01.03.03.02",
                work_package="Instrumentation → Calibration",
                level="L6",
                planned_start=date(2026, 8, 25),
                planned_finish=date(2026, 9, 10),
                planned_quantity=8.0,
                actual_quantity=4.0,
                uom="units",
                progress_pct=50.0,
                status="In Progress",
                corridor_start="Metering Skid MS-01",
                corridor_finish="Metering Skid MS-01",
                is_critical=False,
                float_days=11,
            ),
        ]

        # Activity lookup map by code
        act_map = {}
        for act in activities_data:
            db.add(act)
            act_map[act.activity_code] = act
        await db.flush()

        # -------------------------------------------------------------------
        # 6. Progress Reports
        # -------------------------------------------------------------------
        report1 = ProgressReport(
            id=uuid.uuid4(),
            project_id=proj.id,
            file_name="DPR_06_Sep_2026.pdf",
            file_type="pdf",
            file_size="3.8 MB",
            submitted_by=u_supervisor.id,
            status="Processed",
        )
        report2 = ProgressReport(
            id=uuid.uuid4(),
            project_id=proj.id,
            file_name="Contractor_Progress_W36.xlsx",
            file_type="xlsx",
            file_size="12.4 MB",
            submitted_by=u_contractor.id,
            status="Processed",
        )
        report3 = ProgressReport(
            id=uuid.uuid4(),
            project_id=proj.id,
            file_name="Welding_Inspection_05Sep.pdf",
            file_type="pdf",
            file_size="1.9 MB",
            submitted_by=u_supervisor.id,
            status="Processed",
        )
        report4 = ProgressReport(
            id=uuid.uuid4(),
            project_id=proj.id,
            file_name="Earthwork_ShiftLog_04Sep.csv",
            file_type="csv",
            file_size="840 KB",
            submitted_by=u_contractor.id,
            status="Need Review",
        )

        db.add_all([report1, report2, report3, report4])
        await db.flush()

        # -------------------------------------------------------------------
        # 7. Progress Events
        # -------------------------------------------------------------------
        ev1 = ProgressEvent(
            id=uuid.uuid4(),
            report_id=report1.id,
            project_id=proj.id,
            description="450m of pipeline trench excavation completed between KP 12+400 and KP 12+850 on 5 Sep.",
            reported_quantity=450.0,
            reported_uom="m",
            location_corridor="KP 12+400 – KP 12+850",
            chainage_start="12+400",
            chainage_end="12+850",
            execution_date=date(2026, 9, 5),
            shift="Day Shift #1",
            raw_quote="450m of pipeline trench excavation completed between KP 12+400 and KP 12+850 on 5 Sep.",
            photo_url="https://lh3.googleusercontent.com/aida-public/AB6AXuAgPtvTHaCHDPK9btqv9bXS9qsUnQSLw4RqQl-ID5-WODCiPdxEtjodRchdvfKZ3pxW3SoQGLnQic0B5Avit8cUGvBSnGuXsR6AfNeTZMXwxapOIENzlEXq3uqBu-BIxJ7_kgbwWc1Vb1KudwfhHhj0jXmDgCA8hWvPTej0wC3s5igwjArAJ_GHVkR3udmgu-LQKOLYBI1Jc_zsmXkCjWP4H6irVOmSC0aQI6JpUeJ-yas9rdvJZ-fW",
        )

        ev2 = ProgressEvent(
            id=uuid.uuid4(),
            report_id=report1.id,
            project_id=proj.id,
            description="180 m³ of M35 grade concrete poured for Turbo-Compressor foundation block TB-02.",
            reported_quantity=180.0,
            reported_uom="m³",
            location_corridor="Block Area TB-02",
            chainage_start="Pad TB-02",
            chainage_end="Pad TB-02",
            execution_date=date(2026, 9, 5),
            shift="Night Shift Pour",
            raw_quote="180 m³ of M35 grade concrete poured for Turbo-Compressor foundation block TB-02.",
            photo_url="https://images.unsplash.com/photo-1541888946425-d0fbb180c5f5?w=800&auto=format&fit=crop&q=80",
        )

        ev3 = ProgressEvent(
            id=uuid.uuid4(),
            report_id=report3.id,
            project_id=proj.id,
            description="32 butt welds completed and 100% radiographic testing (RT) cleared on 24-inch trunkline joints W-104 to W-135.",
            reported_quantity=32.0,
            reported_uom="joints",
            location_corridor="Chainage KP 18+200",
            chainage_start="18+200",
            chainage_end="18+200",
            execution_date=date(2026, 9, 4),
            shift="Day Shift #2",
            raw_quote="32 butt welds completed and 100% radiographic testing (RT) cleared on 24-inch trunkline joints W-104 to W-135.",
            photo_url="https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80",
        )

        ev4 = ProgressEvent(
            id=uuid.uuid4(),
            report_id=report2.id,
            project_id=proj.id,
            description="Erection of 14 metric tonnes of structural steel pipe rack PR-01 modules 3 and 4 completed.",
            reported_quantity=14.0,
            reported_uom="MT",
            location_corridor="Pig Receiver Area",
            chainage_start="PR-01",
            chainage_end="PR-01",
            execution_date=date(2026, 9, 4),
            shift="Day Shift #1",
            raw_quote="Erection of 14 metric tonnes of structural steel pipe rack PR-01 modules 3 and 4 completed.",
            photo_url="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&auto=format&fit=crop&q=80",
        )

        ev5 = ProgressEvent(
            id=uuid.uuid4(),
            report_id=report4.id,
            project_id=proj.id,
            description="Unplanned pit trenching performed outside corridor boundaries during off-shift hours.",
            reported_quantity=120.0,
            reported_uom="m",
            location_corridor="Unauthorized Zone KP 13+900",
            chainage_start="13+900",
            chainage_end="13+900",
            execution_date=date(2026, 9, 3),
            shift="Night Shift",
            raw_quote="Unplanned pit trenching performed outside corridor boundaries during off-shift hours.",
        )

        db.add_all([ev1, ev2, ev3, ev4, ev5])
        await db.flush()

        # -------------------------------------------------------------------
        # 8. Activity Matches (Pending, Approved, Rejected)
        # -------------------------------------------------------------------
        act_exc = act_map["L6-PIPE-EXC-042"]
        act_comp = act_map["L4-CIV-COMP-012"]
        act_weld = act_map["L5-MECH-WELD-024"]
        act_rack = act_map["L4-STR-PRACK-008"]
        act_tiein = act_map["L6-TIEIN-TR-018"]
        act_valv = act_map["L6-VALV-EXC-002"]

        # Match 1: PENDING (Review queue item 1)
        m1 = ActivityMatch(
            id=uuid.uuid4(),
            event_id=ev1.id,
            activity_id=act_exc.id,
            confidence_score=96.8,
            match_rationale="AI matched this update based on work description, linear corridor (KP 12+400 to 12+850), and reported 450m trench quantity against planned baseline.",
            status="Pending",
            alternative_candidates=[
                {
                    "id": str(act_tiein.id),
                    "title": act_tiein.name,
                    "activityId": act_tiein.activity_code,
                    "workPackage": act_tiein.work_package,
                    "matchPct": 81.0,
                    "reason": "Target corridor is designated KP 13+000 to KP 13+500 (offset from this report by ~150m).",
                },
                {
                    "id": str(act_valv.id),
                    "title": act_valv.name,
                    "activityId": act_valv.activity_code,
                    "workPackage": act_valv.work_package,
                    "matchPct": 64.0,
                    "reason": "Stationary pit excavation rather than linear trenching, with scheduled start in late September.",
                },
            ],
        )

        # Match 2: PENDING (Review queue item 2)
        m2 = ActivityMatch(
            id=uuid.uuid4(),
            event_id=ev2.id,
            activity_id=act_comp.id,
            confidence_score=94.2,
            match_rationale="Matched via foundation block ID TB-02, concrete specification M35, and civil compressor station work package baseline.",
            status="Pending",
            alternative_candidates=[],
        )

        # Match 3: PENDING (Review queue item 3)
        m3 = ActivityMatch(
            id=uuid.uuid4(),
            event_id=ev3.id,
            activity_id=act_weld.id,
            confidence_score=98.1,
            match_rationale="Exact match with Weld Numbers W-104 through W-135, RT radiographic clearance stamp, and 24-inch mainline schedule tracking item.",
            status="Pending",
            alternative_candidates=[],
        )

        # Match 4: APPROVED (Demonstrating approved historical state)
        m4 = ActivityMatch(
            id=uuid.uuid4(),
            event_id=ev4.id,
            activity_id=act_rack.id,
            confidence_score=93.5,
            match_rationale="Matched structural steel tonnages and tagged pipe rack module IDs (PR-01 M3/M4) from contractor milestone manifest.",
            status="Approved",
            reviewed_by=u_planner.id,
            reviewed_at=datetime(2026, 9, 5, 11, 30, tzinfo=timezone.utc),
            reviewer_notes="Verified against contractor delivery manifest and rigging inspection signoff.",
            alternative_candidates=[],
        )

        # Match 5: REJECTED (Demonstrating rejected historical state)
        m5 = ActivityMatch(
            id=uuid.uuid4(),
            event_id=ev5.id,
            activity_id=act_tiein.id,
            confidence_score=54.0,
            match_rationale="Location does not align with sanctioned construction Right of Way. Flagged for site inspection.",
            status="Rejected",
            reviewed_by=u_planner.id,
            reviewed_at=datetime(2026, 9, 4, 16, 45, tzinfo=timezone.utc),
            reviewer_notes="Reason: Unsanctioned excavation outside design boundary. Returned to contractor.",
            alternative_candidates=[],
        )

        db.add_all([m1, m2, m3, m4, m5])

        # -------------------------------------------------------------------
        # 9. Audit Logs
        # -------------------------------------------------------------------
        log1 = AuditLog(
            id=uuid.uuid4(),
            project_id=proj.id,
            user_id=u_planner.id,
            user_name=u_planner.name,
            role=u_planner.role,
            action="MATCH_APPROVED",
            entity_type="ActivityMatch",
            entity_id=str(act_rack.id),
            details={"activityCode": act_rack.activity_code, "quantityAdded": 14.0, "newProgressPct": 46.67},
        )
        log2 = AuditLog(
            id=uuid.uuid4(),
            project_id=proj.id,
            user_id=u_planner.id,
            user_name=u_planner.name,
            role=u_planner.role,
            action="MATCH_REJECTED",
            entity_type="ActivityMatch",
            entity_id=str(act_tiein.id),
            details={"activityCode": act_tiein.activity_code, "reason": "Unsanctioned excavation outside boundary."},
        )
        log3 = AuditLog(
            id=uuid.uuid4(),
            project_id=proj.id,
            user_id=u_supervisor.id,
            user_name=u_supervisor.name,
            role=u_supervisor.role,
            action="REPORT_PROCESSED",
            entity_type="ProgressReport",
            entity_id=str(report1.id),
            details={"fileName": report1.file_name, "eventsCount": 2},
        )
        db.add_all([log1, log2, log3])

        # -------------------------------------------------------------------
        # 10. Shift Notes
        # -------------------------------------------------------------------
        note1 = ShiftNote(
            id=uuid.uuid4(),
            project_id=proj.id,
            author_id=u_supervisor.id,
            author_name=u_supervisor.name,
            chainage="KP 12+600",
            category="Observation",
            content="Trench depth surveyed at 2.1m. Bedding sand layer meets compaction specifications. Zero ground water ingress noted.",
            note_date=date(2026, 9, 6),
        )
        note2 = ShiftNote(
            id=uuid.uuid4(),
            project_id=proj.id,
            author_id=u_supervisor.id,
            author_name=u_supervisor.name,
            chainage="Pad TB-02",
            category="Quality",
            content="Curing compound applied to Compressor Block TB-02 at 06:00 AM. Ambient temp 28°C, humidity 82%. Concrete cube specimens tagged for 7-day compressive test.",
            note_date=date(2026, 9, 6),
        )
        db.add_all([note1, note2])

        # -------------------------------------------------------------------
        # 11. Data Sources
        # -------------------------------------------------------------------
        ds1 = DataSource(
            name="Oracle Primavera P6 EPPM",
            source_type="Enterprise Scheduling",
            status="Connected",
            records_processed=1420,
            description="Bi-directional XML/API sync for L4-L6 WBS and activity baselines.",
        )
        ds2 = DataSource(
            name="Autodesk BIM 360 / ACC",
            source_type="Field Documentation",
            status="Connected",
            records_processed=840,
            description="Automated ingestion of field inspection sheets and PDF markups.",
        )
        db.add_all([ds1, ds2])

        await db.commit()
        print("Database seeding completed successfully!")


if __name__ == "__main__":
    asyncio.run(seed_data())
