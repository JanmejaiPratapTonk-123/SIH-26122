"""
Verification script for Plan2Progress live API endpoints.
"""

import json
import urllib.request
import urllib.error

BASE_URL = "http://127.0.0.1:8000"


def send_req(method, path, data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = json.dumps(data).encode("utf-8") if data else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            try:
                parsed = json.loads(content)
            except Exception:
                parsed = content
            return status, parsed
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = content
        return e.code, parsed


def main():
    print("================ LIVE API VERIFICATION ================")

    # 1. Health
    s, r = send_req("GET", "/health")
    print(f"[1] GET /health -> HTTP {s} | {r}")
    assert s == 200, f"Health check failed: {s}"

    # 2. Root
    s, r = send_req("GET", "/")
    print(f"[2] GET / -> HTTP {s} | {r}")
    assert s == 200

    # 3. Auth login
    login_payload = {
        "email": "vikram.sharma@plan2progress.in",
        "password": "password123",
    }
    s, r = send_req("POST", "/api/v1/auth/login", data=login_payload)
    print(f"[3] POST /api/v1/auth/login -> HTTP {s} | User: {r.get('user', {}).get('name') if isinstance(r, dict) else r}")
    assert s == 200, f"Login failed: {r}"
    token = r["access_token"]
    user = r["user"]

    # 4. Auth Me
    s, r = send_req("GET", "/api/v1/auth/me", token=token)
    print(f"[4] GET /api/v1/auth/me -> HTTP {s} | Name: {r.get('name')}, Role: {r.get('role')}")
    assert s == 200

    # 5. List Projects
    s, projects = send_req("GET", "/api/v1/projects")
    print(f"[5] GET /api/v1/projects -> HTTP {s} | Count: {len(projects)}")
    assert s == 200 and len(projects) > 0
    project = projects[0]
    proj_id = project["id"]
    print(f"    Active Project: {project['name']} ({project['code']}) - Manager: {project['manager']}")

    # 6. Project Details
    s, p_detail = send_req("GET", f"/api/v1/projects/{proj_id}")
    print(f"[6] GET /api/v1/projects/{proj_id} -> HTTP {s} | Progress: {p_detail.get('progress')}%")
    assert s == 200

    # 7. Project Activities
    s, activities = send_req("GET", f"/api/v1/projects/{proj_id}/activities")
    print(f"[7] GET /api/v1/projects/{proj_id}/activities -> HTTP {s} | Activities Count: {len(activities)}")
    assert s == 200 and len(activities) > 0
    print(f"    Sample Activity: {activities[0]['activityCode']} - {activities[0]['name']}")

    # 8. Project Reports
    s, reports = send_req("GET", f"/api/v1/projects/{proj_id}/reports")
    print(f"[8] GET /api/v1/projects/{proj_id}/reports -> HTTP {s} | Reports Count: {len(reports)}")
    assert s == 200 and len(reports) > 0

    # 9. Project Review Queue (Pending matches)
    s, rqueue = send_req("GET", f"/api/v1/projects/{proj_id}/matches/pending")
    print(f"[9] GET /api/v1/projects/{proj_id}/matches/pending -> HTTP {s} | Queue Items: {len(rqueue)}")
    assert s == 200

    # 10. Project Timeline / Audit Trail
    s, timeline = send_req("GET", f"/api/v1/projects/{proj_id}/audit-trail")
    print(f"[10] GET /api/v1/projects/{proj_id}/audit-trail -> HTTP {s} | Timeline Events: {len(timeline)}")
    assert s == 200

    # 11. Global Matches Review Queue
    s, matches = send_req("GET", "/api/v1/matches/queue")
    print(f"[11] GET /api/v1/matches/queue -> HTTP {s} | Pending Matches: {len(matches)}")
    assert s == 200 and len(matches) > 0
    print(f"     First Match: {matches[0].get('quote', '')[:60]}... (Activity: {matches[0].get('suggestedActivity', {}).get('activityId')})")

    # 12. Audit Timeline
    s, atimeline = send_req("GET", "/api/v1/audit/timeline")
    print(f"[12] GET /api/v1/audit/timeline -> HTTP {s} | Items: {len(atimeline)}")
    assert s == 200

    # 13. Audit Platform Activities
    s, pactivities = send_req("GET", "/api/v1/audit/platform-activities")
    print(f"[13] GET /api/v1/audit/platform-activities -> HTTP {s} | Items: {len(pactivities)}")
    assert s == 200

    # 14. Audit System Logs
    s, slogs = send_req("GET", "/api/v1/audit/system-logs")
    print(f"[14] GET /api/v1/audit/system-logs -> HTTP {s} | Items: {len(slogs)}")
    assert s == 200

    # 15. Admin Users
    s, users = send_req("GET", "/api/v1/admin/users")
    print(f"[15] GET /api/v1/admin/users -> HTTP {s} | Users Count: {len(users)}")
    assert s == 200 and len(users) >= 5

    # 16. Admin Data Sources
    s, dsources = send_req("GET", "/api/v1/admin/data-sources")
    print(f"[16] GET /api/v1/admin/data-sources -> HTTP {s} | Sources Count: {len(dsources)}")
    assert s == 200 and len(dsources) >= 2

    # 17. Admin Contractors
    s, contractors = send_req("GET", "/api/v1/admin/contractors")
    print(f"[17] GET /api/v1/admin/contractors -> HTTP {s} | Contractors Count: {len(contractors)}")
    assert s == 200

    # 18. Admin AI Settings
    s, ai_cfg = send_req("GET", "/api/v1/admin/ai-settings")
    print(f"[18] GET /api/v1/admin/ai-settings -> HTTP {s} | Threshold: {ai_cfg.get('confidenceThreshold')}%")
    assert s == 200

    # 20. Supervisor Notes
    s, snotes = send_req("GET", f"/api/v1/supervisor/notes?project_id={proj_id}")
    print(f"[20] GET /api/v1/supervisor/notes -> HTTP {s} | Shift Notes Count: {len(snotes)}")
    assert s == 200 and len(snotes) > 0

    print("================ ALL ENDPOINT CHECKS PASSED ================")


if __name__ == "__main__":
    main()
