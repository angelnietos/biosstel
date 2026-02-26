# 🔒 Branch Protection Strategy

Este documento define las reglas de protección de ramas que deben configurarse en GitHub.

## 🌳 Estrategia de Branching

```
main (production)
  ↑
release/* (staging)
  ↑
develop (integration)
  ↑
feature/* (development)
```

---

## 📋 Configuración por Rama

### `main` (Producción)

**Protecciones:**

- ✅ Require pull request before merging
  - Required approvals: **2**
  - Dismiss stale reviews: **Yes**
  - Require review from Code Owners: **Yes**
- ✅ Require status checks to pass
  - Strict: **Yes** (require branches to be up to date)
  - Required checks:
    - `lint`
    - `test-unit`
    - `test-e2e`
    - `build (frontend)`
    - `build (backend)`
- ✅ Require conversation resolution before merging
- ✅ Require signed commits
- ✅ Require linear history (no merge commits)
- ✅ Do not allow bypassing the above settings
- ✅ Restrict who can push to matching branches
  - Only: **Release managers**
- ❌ Allow force pushes: **No**
- ❌ Allow deletions: **No**

**Merge Strategy:** `Squash and merge` only

---

### `release/*` (Staging)

**Protecciones:**

- ✅ Require pull request before merging
  - Required approvals: **1**
  - Dismiss stale reviews: **Yes**
- ✅ Require status checks to pass
  - Strict: **Yes**
  - Required checks:
    - `lint`
    - `test-unit`
    - `build (frontend)`
    - `build (backend)`
- ✅ Require conversation resolution before merging
- ✅ Require linear history
- ❌ Allow force pushes: **No**
- ❌ Allow deletions: **No**

**Merge Strategy:** `Squash and merge` only

**Naming Convention:** `release/YYYY.MM.DD` o `release/vX.Y.Z`

---

### `develop` (Integración)

**Protecciones:**

- ✅ Require pull request before merging
  - Required approvals: **1**
- ✅ Require status checks to pass
  - Strict: **No** (permite merges más rápidos)
  - Required checks:
    - `lint`
    - `test-unit`
- ✅ Require conversation resolution before merging
- ❌ Require linear history: **No** (permite merge commits)
- ❌ Allow force pushes: **No**
- ❌ Allow deletions: **No**

**Merge Strategy:** `Merge commit` (para mantener historia de features)

---

### `feature/*` (Desarrollo)

**Protecciones:**

- ✅ Require pull request before merging
  - Required approvals: **1**
- ✅ Require status checks to pass
  - Required checks:
    - `lint`
- ❌ Allow force pushes: **Yes** (solo el autor)
- ❌ Allow deletions: **Yes** (después de merge)

**Merge Strategy:** `Squash and merge`

**Naming Convention:**

- `feature/nombre-descriptivo`
- `bugfix/nombre-descriptivo`
- `hotfix/nombre-descriptivo`

---

## 🔄 Flujo de Trabajo

### 1️⃣ Desarrollo de Feature

```bash
# Crear feature desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# Desarrollo...
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear PR: feature/nueva-funcionalidad → develop
# ✅ Requiere: lint + 1 approval
```

### 2️⃣ Release Candidate

```bash
# Crear release desde develop
git checkout develop
git pull origin develop
git checkout -b release/2024.02.16

# PR: release/2024.02.16 → main
# ✅ Requiere: lint + test-unit + test-e2e + build + 2 approvals
```

### 3️⃣ Hotfix en Producción

```bash
# Crear hotfix desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Desarrollo...
git commit -m "fix: critical bug"
git push origin hotfix/critical-bug

# PR: hotfix/critical-bug → main
# ✅ Requiere: todos los checks + 2 approvals

# Después del merge, sincronizar develop
git checkout develop
git merge main
git push origin develop
```

---

## 📊 CODEOWNERS

Crear archivo `.github/CODEOWNERS`:

```
# Global owners
* @biosstel-team

# Frontend
/apps/front-biosstel/ @frontend-team
/libs/frontend/ @frontend-team

# Backend
/apps/api-biosstel/ @backend-team
/libs/backend/ @backend-team

# Infrastructure
/docker/ @devops-team
/.github/ @devops-team
/docker-compose*.yml @devops-team

# Documentation
*.md @tech-lead
```

---

## 🚨 Configuración en GitHub

1. Ir a **Settings** → **Branches**
2. Añadir regla para cada rama (`main`, `release/*`, `develop`)
3. Copiar configuración de arriba
4. Guardar cambios

5. **Configurar CODEOWNERS**:
   - Crear `.github/CODEOWNERS`
   - Habilitar "Require review from Code Owners" en `main`

6. **Configurar teams**:
   - Crear teams: `@biosstel-team`, `@frontend-team`, `@backend-team`, `@devops-team`
   - Asignar miembros

---

## ✅ Checklist de Configuración

- [ ] Protecciones de `main` configuradas
- [ ] Protecciones de `release/*` configuradas
- [ ] Protecciones de `develop` configuradas
- [ ] Protecciones de `feature/*` configuradas
- [ ] CODEOWNERS creado y configurado
- [ ] Teams creados en GitHub
- [ ] Dependabot habilitado
- [ ] GitHub Actions habilitadas
- [ ] Secrets configurados (DOCKER_USERNAME, DOCKER_PASSWORD, etc.)
- [ ] Branch `develop` creado
- [ ] Branch `main` como default

---

**Última actualización:** Febrero 2026
