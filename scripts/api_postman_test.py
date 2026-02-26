#!/usr/bin/env python3
"""
Script que prueba todos los endpoints de la API Biosstel (equivalente a Postman).
Ejecuta las mismas peticiones HTTP que harías en Postman y devuelve qué endpoints fallan.

Recomendado: usar la versión Node (no depende de Python en PATH):
  pnpm api:postman-test   ->   node scripts/api-postman-test.js

Si prefieres Python (requiere Python 3 en PATH):
  python scripts/api_postman_test.py
  python scripts/api_postman_test.py --curl  # genera además un .sh con los curl equivalentes

Variables de entorno:
  API_URL          Base URL (default http://localhost:4000)
  API_SMOKE_USER   Email de login (default admin@biosstel.com)
  API_SMOKE_PASSWORD  Contraseña (default admin123)
"""

import json
import os
import sys
import time
import base64
import argparse
import urllib.request
import urllib.error
from typing import Optional

# --- Config (mismo que Postman / api-smoke-test.js) ---
BASE = os.environ.get("API_URL", "http://localhost:4000").rstrip("/")
API = f"{BASE}/api/v1"
HEALTH = f"{BASE}/api"
USER = os.environ.get("API_SMOKE_USER", "admin@biosstel.com")
PASS = os.environ.get("API_SMOKE_PASSWORD", "admin123")

results = {"ok": 0, "fail": 0, "skip": 0}
failed_endpoints = []  # lista de (método, path, status, preview)
ids = {}
curl_commands = []


def request(
    method: str,
    url: str,
    token: Optional[str] = None,
    body: Optional[dict] = None,
    expected_status: Optional[int] = None,
) -> tuple[int, str]:
    """Hace la petición HTTP (equivalente a curl/Postman). Devuelve (status_code, body)."""
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if body and method != "GET":
        data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return resp.status, resp.read().decode("utf-8", errors="replace")
    except urllib.error.HTTPError as e:
        body_read = e.read().decode("utf-8", errors="replace") if e.fp else ""
        return e.code, body_read
    except Exception as e:
        return 0, str(e)


def record_curl(method: str, url: str, token: Optional[str], body: Optional[dict]):
    """Guarda el comando curl equivalente para reproducir en terminal/Postman."""
    parts = ["curl", "-s", "-w", "'%{http_code}'", "-X", method]
    parts.append(f"-H 'Content-Type: application/json'")
    if token:
        parts.append(f"-H 'Authorization: Bearer {token}'")
    parts.append(f"'{url}'")
    if body and method != "GET":
        parts.append(f"-d '{json.dumps(body)}'")
    curl_commands.append(" \\\n  ".join(parts))


def ok(label: str):
    results["ok"] += 1
    print(f"  [OK]   {label}")


def fail(label: str, status: int, body: str = ""):
    results["fail"] += 1
    preview = (body[:120] + "...") if len(body) > 120 else body
    preview = preview.replace("\n", " ").strip()
    failed_endpoints.append((label, status, preview))
    print(f"  [FAIL] {label} -> {status} {preview}")


def skip(label: str, reason: str):
    results["skip"] += 1
    print(f"  [SKIP] {label} ({reason})")


def run(emit_curl: bool):
    print(f"\nAPI Postman-style test (todos los endpoints) -> {API}\n")

    token = None

    # --- Login ---
    login_res = request("POST", f"{API}/auth/login", body={"email": USER, "password": PASS})
    if emit_curl:
        record_curl("POST", f"{API}/auth/login", None, {"email": USER, "password": PASS})
    status, body = login_res
    if status not in (200, 201):
        fail("POST /auth/login", status, body)
        print("\nSin token. No se pueden probar endpoints protegidos.\n")
        print_summary()
        sys.exit(1)
    data = json.loads(body) if body else {}
    token = data.get("access_token") or data.get("token")
    if data.get("user", {}).get("id"):
        ids["userId"] = data["user"]["id"]
    if token:
        ok("POST /auth/login")
    else:
        fail("POST /auth/login", status, "no access_token")

    # --- Health ---
    for path in ["/health", "/health/live", "/health/ready"]:
        status, body = request("GET", f"{API}{path}", token=token)
        if status == 404:
            status, body = request("GET", f"{HEALTH}{path}", token=token)
        if 200 <= status < 300:
            ok(f"GET {path}")
        else:
            fail(f"GET {path}", status, body)

    # --- Auth ---
    status, body = request("GET", f"{API}/auth/me", token=token)
    if status == 200:
        ok("GET /auth/me")
        data = json.loads(body) if body else {}
        ids["userId"] = data.get("id") or data.get("userId") or ids.get("userId")
    else:
        fail("GET /auth/me", status, body)

    status, body = request("POST", f"{API}/auth/forgot-password", body={"email": USER})
    if status == 200:
        ok("POST /auth/forgot-password")
    else:
        fail("POST /auth/forgot-password", status, body)

    # --- Users ---
    status, users_body = request("GET", f"{API}/users?page=1&pageSize=5", token=token)
    if status == 200:
        ok("GET /users")
        data = json.loads(users_body) if users_body else {}
        items = data.get("items") or (data if isinstance(data, list) else [])
        if items and not ids.get("userId"):
            ids["userId"] = items[0].get("id")
    else:
        fail("GET /users", status, users_body)
    if not users_body:
        users_body = ""

    if ids.get("userId"):
        status, body = request("GET", f"{API}/users/{ids['userId']}", token=token)
        if status == 200:
            ok("GET /users/:id")
        else:
            fail("GET /users/:id", status, body)
    else:
        skip("GET /users/:id", "no userId")

    create_user_body = {
        "email": f"smoke-{int(time.time())}@test.local",
        "password": "SmokePass123",
        "firstName": "Smoke",
        "lastName": "Test",
    }
    status, body = request("POST", f"{API}/users", token=token, body=create_user_body)
    if status in (200, 201):
        ok("POST /users")
        data = json.loads(body) if body else {}
        ids["createdUserId"] = data.get("id")
    else:
        fail("POST /users", status, body)

    if ids.get("createdUserId"):
        status, body = request(
            "PUT",
            f"{API}/users/{ids['createdUserId']}",
            token=token,
            body={"firstName": "SmokeUpdated"},
        )
        if status == 200:
            ok("PUT /users/:id")
        else:
            fail("PUT /users/:id", status, body)

    # --- Clients ---
    status, body = request("GET", f"{API}/clients", token=token)
    if status == 200:
        ok("GET /clients")
    else:
        fail("GET /clients", status, body)

    status, body = request(
        "POST",
        f"{API}/clients",
        token=token,
        body={
            "name": "Smoke Client",
            "email": f"smoke-{int(time.time())}@client.test",
            "phone": "+34600000000",
        },
    )
    if status in (200, 201):
        ok("POST /clients")
    else:
        fail("POST /clients", status, body)

    # --- Dashboard ---
    status, body = request("GET", f"{API}/dashboard/home", token=token)
    if status == 200:
        ok("GET /dashboard/home")
    else:
        fail("GET /dashboard/home", status, body)

    status, body = request("GET", f"{API}/dashboard/terminal-objectives", token=token)
    if status == 200:
        ok("GET /dashboard/terminal-objectives")
        data = json.loads(body) if body else {}
        h = data.get("header") or {}
        ids["terminalObjectiveId"] = h.get("id") or data.get("inactiveObjective", {}).get("id")
    else:
        fail("GET /dashboard/terminal-objectives", status, body)

    if ids.get("terminalObjectiveId"):
        status, body = request(
            "PATCH",
            f"{API}/dashboard/terminal-objectives/{ids['terminalObjectiveId']}",
            token=token,
            body={"isActive": True},
        )
        if status == 200:
            ok("PATCH /dashboard/terminal-objectives/:id")
        else:
            fail("PATCH /dashboard/terminal-objectives/:id", status, body)
    else:
        skip("PATCH /dashboard/terminal-objectives/:id", "no objective id")

    # --- Empresa ---
    status, body = request("GET", f"{API}/empresa", token=token)
    if status == 200:
        ok("GET /empresa")
    else:
        fail("GET /empresa", status, body)

    status, body = request("GET", f"{API}/empresa/departments", token=token)
    if status == 200:
        ok("GET /empresa/departments")
        data = json.loads(body) if body else {}
        lst = data if isinstance(data, list) else []
        if lst:
            ids["departmentId"] = lst[0].get("id")
    else:
        fail("GET /empresa/departments", status, body)

    status, body = request(
        "POST",
        f"{API}/empresa/departments",
        token=token,
        body={"name": "Smoke Dept", "code": "SMK-1"},
    )
    if status in (200, 201):
        ok("POST /empresa/departments")
        data = json.loads(body) if body else {}
        ids["createdDepartmentId"] = data.get("id")
    else:
        fail("POST /empresa/departments", status, body)

    if ids.get("departmentId"):
        status, body = request(
            "GET", f"{API}/empresa/departments/{ids['departmentId']}", token=token
        )
        if status == 200:
            ok("GET /empresa/departments/:id")
        else:
            fail("GET /empresa/departments/:id", status, body)
    if ids.get("createdDepartmentId"):
        status, body = request(
            "PUT",
            f"{API}/empresa/departments/{ids['createdDepartmentId']}",
            token=token,
            body={"name": "Smoke Dept Updated"},
        )
        if status == 200:
            ok("PUT /empresa/departments/:id")
        else:
            fail("PUT /empresa/departments/:id", status, body)

    # --- Work centers ---
    status, body = request("GET", f"{API}/empresa/work-centers", token=token)
    if status == 200:
        ok("GET /empresa/work-centers")
        data = json.loads(body) if body else {}
        lst = data if isinstance(data, list) else []
        if lst:
            ids["workCenterId"] = lst[0].get("id")
    else:
        fail("GET /empresa/work-centers", status, body)

    status, body = request(
        "POST",
        f"{API}/empresa/work-centers",
        token=token,
        body={
            "name": "Smoke Work Center",
            "address": "C/ Smoke 1",
            "departmentId": ids.get("departmentId") or "string",
        },
    )
    if status in (200, 201):
        ok("POST /empresa/work-centers")
        data = json.loads(body) if body else {}
        ids["createdWorkCenterId"] = data.get("id")
    else:
        fail("POST /empresa/work-centers", status, body)

    if ids.get("workCenterId"):
        status, body = request(
            "GET", f"{API}/empresa/work-centers/{ids['workCenterId']}", token=token
        )
        if status == 200:
            ok("GET /empresa/work-centers/:id")
        else:
            fail("GET /empresa/work-centers/:id", status, body)
    if ids.get("createdWorkCenterId"):
        status, body = request(
            "PUT",
            f"{API}/empresa/work-centers/{ids['createdWorkCenterId']}",
            token=token,
            body={"name": "Smoke WC Updated"},
        )
        if status == 200:
            ok("PUT /empresa/work-centers/:id")
        else:
            fail("PUT /empresa/work-centers/:id", status, body)

    # --- Fichajes ---
    status, body = request("GET", f"{API}/fichajes", token=token)
    if status == 200:
        ok("GET /fichajes")
    else:
        fail("GET /fichajes", status, body)

    if ids.get("userId"):
        status, body = request(
            "GET", f"{API}/fichajes/user/{ids['userId']}", token=token
        )
        if status == 200:
            ok("GET /fichajes/user/:userId")
        else:
            fail("GET /fichajes/user/:userId", status, body)
    else:
        skip("GET /fichajes/user/:userId", "no userId")

    if ids.get("userId"):
        status, body = request(
            "GET",
            f"{API}/fichajes/current?userId={ids['userId']}",
            token=token,
        )
        if status == 200:
            ok("GET /fichajes/current")
        else:
            fail("GET /fichajes/current", status, body)
    else:
        skip("GET /fichajes/current", "no userId")

    clock_in_user = ids.get("userId")
    if not clock_in_user and users_body:
        try:
            data = json.loads(users_body)
            items = data.get("items") or []
            if items:
                clock_in_user = items[0].get("id")
        except Exception:
            pass
    if clock_in_user:
        status, body = request(
            "POST",
            f"{API}/fichajes/clock-in",
            token=token,
            body={"userId": str(clock_in_user)},
        )
        if status == 200:
            ok("POST /fichajes/clock-in")
            data = json.loads(body) if body else {}
            ids["fichajeId"] = data.get("id")
        else:
            fail("POST /fichajes/clock-in", status, body)
    else:
        skip("POST /fichajes/clock-in", "no userId")

    if ids.get("fichajeId"):
        for method, path_suffix, req_body in [
            ("POST", "/pause", {"reason": "Smoke test"}),
            ("POST", "/resume", None),
            ("POST", "/clock-out", None),
        ]:
            url = f"{API}/fichajes/{ids['fichajeId']}{path_suffix}"
            status, body = request(method, url, token=token, body=req_body)
            if status == 200:
                ok(f"{method} /fichajes/:fichajeId{path_suffix}")
            else:
                fail(f"{method} /fichajes/:fichajeId{path_suffix}", status, body)
    else:
        for label in ["pause", "resume", "clock-out"]:
            skip(f"POST /fichajes/:fichajeId/{label}", "no fichaje id")

    # --- Calendars, schedules, permission-types ---
    status, body = request("GET", f"{API}/fichajes/calendars", token=token)
    if status == 200:
        ok("GET /fichajes/calendars")
    else:
        fail("GET /fichajes/calendars", status, body)
    status, body = request(
        "POST",
        f"{API}/fichajes/calendars",
        token=token,
        body={"name": "Smoke Calendar", "description": "Smoke"},
    )
    if status in (200, 201):
        ok("POST /fichajes/calendars")
    else:
        fail("POST /fichajes/calendars", status, body)

    status, body = request("GET", f"{API}/fichajes/schedules", token=token)
    if status == 200:
        ok("GET /fichajes/schedules")
    else:
        fail("GET /fichajes/schedules", status, body)
    status, body = request(
        "POST",
        f"{API}/fichajes/schedules",
        token=token,
        body={"name": "Smoke Schedule", "hoursPerWeek": 40},
    )
    if status in (200, 201):
        ok("POST /fichajes/schedules")
    else:
        fail("POST /fichajes/schedules", status, body)

    status, body = request("GET", f"{API}/fichajes/permission-types", token=token)
    if status == 200:
        ok("GET /fichajes/permission-types")
    else:
        fail("GET /fichajes/permission-types", status, body)
    status, body = request(
        "POST",
        f"{API}/fichajes/permission-types",
        token=token,
        body={"name": "Smoke Permiso", "isPaid": True},
    )
    if status in (200, 201):
        ok("POST /fichajes/permission-types")
    else:
        fail("POST /fichajes/permission-types", status, body)

    # --- Tasks ---
    if ids.get("userId"):
        status, body = request(
            "GET", f"{API}/tasks/user/{ids['userId']}", token=token
        )
        if status == 200:
            ok("GET /tasks/user/:userId")
            data = json.loads(body) if body else {}
            lst = data if isinstance(data, list) else []
            if lst:
                ids["taskId"] = lst[0].get("id")
        else:
            fail("GET /tasks/user/:userId", status, body)
    else:
        skip("GET /tasks/user/:userId", "no userId")

    status, body = request(
        "POST",
        f"{API}/tasks",
        token=token,
        body={
            "userId": ids.get("userId"),
            "title": "Smoke task",
            "description": "Smoke test",
        },
    )
    if status in (200, 201):
        ok("POST /tasks")
        data = json.loads(body) if body else {}
        ids["createdTaskId"] = data.get("id")
    else:
        fail("POST /tasks", status, body)

    if ids.get("taskId"):
        status, body = request(
            "GET", f"{API}/tasks/{ids['taskId']}", token=token
        )
        if status == 200:
            ok("GET /tasks/:taskId")
        else:
            fail("GET /tasks/:taskId", status, body)
    else:
        skip("GET /tasks/:taskId", "no task id")
    if ids.get("createdTaskId"):
        status, body = request(
            "PATCH",
            f"{API}/tasks/{ids['createdTaskId']}",
            token=token,
            body={"completed": True},
        )
        if status == 200:
            ok("PATCH /tasks/:taskId")
        else:
            fail("PATCH /tasks/:taskId", status, body)
        status, body = request(
            "DELETE", f"{API}/tasks/{ids['createdTaskId']}", token=token
        )
        if status in (200, 204):
            ok("DELETE /tasks/:taskId")
        else:
            fail("DELETE /tasks/:taskId", status, body)

    # --- Productos ---
    status, body = request("GET", f"{API}/productos", token=token)
    if status == 200:
        ok("GET /productos")
        data = json.loads(body) if body else {}
        lst = data.get("products") or (data if isinstance(data, list) else [])
        if lst:
            ids["productId"] = lst[0].get("id")
    else:
        fail("GET /productos", status, body)

    status, body = request(
        "POST",
        f"{API}/productos",
        token=token,
        body={
            "codigo": f"SMK-{int(time.time())}",
            "nombre": "Smoke Product",
            "familia": "Smoke",
            "estado": "Activo",
        },
    )
    if status in (200, 201):
        ok("POST /productos")
        data = json.loads(body) if body else {}
        ids["createdProductId"] = data.get("id")
    else:
        fail("POST /productos", status, body)

    if ids.get("productId"):
        status, body = request(
            "GET", f"{API}/productos/{ids['productId']}", token=token
        )
        if status == 200:
            ok("GET /productos/:id")
        else:
            fail("GET /productos/:id", status, body)
    else:
        skip("GET /productos/:id", "no product id")
    if ids.get("createdProductId"):
        status, body = request(
            "PATCH",
            f"{API}/productos/{ids['createdProductId']}",
            token=token,
            body={"nombre": "Smoke Product Updated"},
        )
        if status == 200:
            ok("PATCH /productos/:id")
        else:
            fail("PATCH /productos/:id", status, body)

    # --- Inventory ---
    status, body = request("GET", f"{API}/inventory", token=token)
    if status == 200:
        ok("GET /inventory")
        data = json.loads(body) if body else {}
        lst = data.get("items") or (data if isinstance(data, list) else [])
        if lst:
            ids["inventoryId"] = lst[0].get("id")
    else:
        fail("GET /inventory", status, body)

    status, body = request(
        "POST",
        f"{API}/inventory",
        token=token,
        body={
            "codigo": f"INV-SMK-{int(time.time())}",
            "nombre": "Smoke Item",
            "cantidad": 10,
            "ubicacion": "Smoke Shelf",
        },
    )
    if status in (200, 201):
        ok("POST /inventory")
        data = json.loads(body) if body else {}
        ids["createdInventoryId"] = data.get("id")
    else:
        fail("POST /inventory", status, body)

    if ids.get("inventoryId"):
        status, body = request(
            "GET", f"{API}/inventory/{ids['inventoryId']}", token=token
        )
        if status == 200:
            ok("GET /inventory/:id")
        else:
            fail("GET /inventory/:id", status, body)
    else:
        skip("GET /inventory/:id", "no inventory id")
    if ids.get("createdInventoryId"):
        status, body = request(
            "PATCH",
            f"{API}/inventory/{ids['createdInventoryId']}",
            token=token,
            body={"cantidad": 20},
        )
        if status == 200:
            ok("PATCH /inventory/:id")
        else:
            fail("PATCH /inventory/:id", status, body)

    # --- Reports, alertas, operaciones ---
    status, body = request("GET", f"{API}/reports/summary", token=token)
    if status == 200:
        ok("GET /reports/summary")
    else:
        fail("GET /reports/summary", status, body)

    status, body = request("GET", f"{API}/alertas", token=token)
    if status == 200:
        ok("GET /alertas")
    else:
        fail("GET /alertas", status, body)

    status, body = request("GET", f"{API}/operaciones", token=token)
    if status == 200:
        ok("GET /operaciones")
    else:
        fail("GET /operaciones", status, body)

    # --- User documents ---
    if ids.get("userId"):
        status, body = request(
            "GET", f"{API}/users/{ids['userId']}/documents", token=token
        )
        if status == 200:
            ok("GET /users/:userId/documents")
        else:
            fail("GET /users/:userId/documents", status, body)

        doc_body = {
            "name": "smoke-doc.txt",
            "mimeType": "text/plain",
            "contentBase64": base64.b64encode(b"Smoke test").decode("ascii"),
        }
        status, body = request(
            "POST",
            f"{API}/users/{ids['userId']}/documents",
            token=token,
            body=doc_body,
        )
        if status in (200, 201):
            ok("POST /users/:userId/documents")
            data = json.loads(body) if body else {}
            ids["createdDocId"] = data.get("id")
        else:
            fail("POST /users/:userId/documents", status, body)

        if ids.get("createdDocId"):
            status, body = request(
                "GET",
                f"{API}/users/{ids['userId']}/documents/{ids['createdDocId']}",
                token=token,
            )
            if status == 200:
                ok("GET /users/:userId/documents/:docId")
            else:
                fail("GET /users/:userId/documents/:docId", status, body)
            status, body = request(
                "DELETE",
                f"{API}/users/{ids['userId']}/documents/{ids['createdDocId']}",
                token=token,
            )
            if status in (200, 204):
                ok("DELETE /users/:userId/documents/:docId")
            else:
                fail("DELETE /users/:userId/documents/:docId", status, body)
    else:
        skip("GET /users/:userId/documents", "no userId")
        skip("POST /users/:userId/documents", "no userId")

    print_summary()
    if emit_curl:
        out_path = os.path.join(os.path.dirname(__file__), "api_postman_curls.sh")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write("#!/bin/sh\n# Comandos curl equivalentes a Postman (generado por api_postman_test.py)\n\n")
            f.write("\n".join(curl_commands))
        print(f"\nComandos curl guardados en: {out_path}")

    sys.exit(1 if results["fail"] > 0 else 0)


def print_summary():
    print("\n--- Resumen ---")
    print(f"OK: {results['ok']} | FAIL: {results['fail']} | SKIP: {results['skip']}")
    if failed_endpoints:
        print("\n--- Endpoints que NO están funcionando (revisar en Postman) ---")
        for label, status, preview in failed_endpoints:
            print(f"  • {label} -> {status}")
            if preview:
                print(f"    {preview[:100]}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Prueba todos los endpoints de la API (como Postman).")
    parser.add_argument(
        "--curl",
        action="store_true",
        help="Genera además api_postman_curls.sh con los curl equivalentes",
    )
    args = parser.parse_args()
    try:
        run(emit_curl=args.curl)
    except KeyboardInterrupt:
        print("\nInterrumpido.")
        sys.exit(130)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
