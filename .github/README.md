# ✅ CI/CD Pipeline - Documentación Completa

## 📦 Estructura Implementada

```
.github/
├── workflows/
│   ├── ci.yml              # ✅ Pipeline principal (lint, test, build)
│   ├── cd.yml              # ✅ Deployment (Docker + release)
│   └── pr-checks.yml       # ✅ Checks automáticos en PRs
│
├── BRANCH_PROTECTION.md    # 📖 Estrategia de branching
├── CODEOWNERS              # 👥 Revisores automáticos
├── SECRETS.md              # 🔐 Configuración de secrets
├── dependabot.yml          # 🤖 Actualizaciones automáticas
└── pull_request_template.md # 📝 Template para PRs
```

---

## 🚀 Resumen de Pipelines

### 1️⃣ CI Pipeline (`ci.yml`)

**Triggers:**
- Push a `main`, `develop`, `release/*`
- Pull requests a `main`, `develop`, `release/*`

**Jobs:**
```
┌─────────────┐
│    LINT     │ → ESLint + TypeScript check
└─────────────┘
      ↓
┌─────────────┐
│  TEST UNIT  │ → Vitest (unit tests)
└─────────────┘
      ↓
┌─────────────┐
│   TEST E2E  │ → Playwright (solo main/develop/release)
└─────────────┘
      ↓
┌─────────────┐
│    BUILD    │ → Frontend + Backend
└─────────────┘
      ↓
┌─────────────┐
│ CI SUCCESS  │ → Verificación final
└─────────────┘
```

**Duración estimada:** 10-20 minutos

---

### 2️⃣ CD Pipeline (`cd.yml`)

**Triggers:**
- Push a `main` (producción)
- Push a `release/*` (staging)

**Jobs:**
```
┌──────────────────┐
│  DOCKER BUILD    │ → Construir imágenes (frontend + backend)
│                  │   - GHCR (GitHub Container Registry)
│                  │   - Tags: branch, sha, latest
└──────────────────┘
      ↓
┌──────────────────┐
│     DEPLOY       │ → Deploy automático
│                  │   - main → Production
│                  │   - release/* → Staging
└──────────────────┘
      ↓
┌──────────────────┐
│  CREATE RELEASE  │ → Solo en main
│                  │   - Tag vYYYY.MM.DD-N
│                  │   - Changelog automático
│                  │   - GitHub Release
└──────────────────┘
```

**Duración estimada:** 20-30 minutos

---

### 3️⃣ PR Checks (`pr-checks.yml`)

**Triggers:**
- Apertura, actualización o reapertura de PR

**Jobs:**
```
┌──────────────────┐
│    PR INFO       │ → Información del PR
└──────────────────┘
      ↓
┌──────────────────┐
│ DETECT CHANGES   │ → Detectar archivos modificados
│                  │   - frontend
│                  │   - backend
│                  │   - libs
│                  │   - CI
└──────────────────┘
      ↓
┌──────────────────┐
│  CONDITIONAL     │ → Solo lintear lo que cambió
│  LINT            │   - Frontend si hay cambios
│                  │   - Backend si hay cambios
└──────────────────┘
      ↓
┌──────────────────┐
│  BUNDLE SIZE     │ → Check de tamaño (solo frontend)
└──────────────────┘
```

**Duración estimada:** 5-10 minutos

---

## 🌳 Estrategia de Branching

### Ramas Principales

```
main (production)
  ↑ Merge con 2 approvals + todos los checks
release/* (staging)
  ↑ Merge con 1 approval + checks
develop (integration)
  ↑ Merge con 1 approval + lint + test
feature/* (development)
  ↑ PR para merge
```

### Flujo de Trabajo

#### 1️⃣ Nueva Feature

```bash
# Desde develop
git checkout develop
git pull origin develop
git checkout -b feature/nueva-funcionalidad

# Desarrollo...
git add .
git commit -m "feat: nueva funcionalidad"
git push origin feature/nueva-funcionalidad

# Crear PR: feature/nueva-funcionalidad → develop
# ✅ Checks: lint + test-unit + 1 approval
```

#### 2️⃣ Release Candidate

```bash
# Desde develop (cuando está listo)
git checkout develop
git pull origin develop
git checkout -b release/2026.02.16

git push origin release/2026.02.16

# Crear PR: release/2026.02.16 → main
# ✅ Checks: lint + test-unit + test-e2e + build + 2 approvals
# ✅ Deploy automático a staging
```

#### 3️⃣ Producción

```bash
# Merge del PR release/* → main
# ✅ Deploy automático a production
# ✅ Release tag automático
# ✅ Changelog generado
```

#### 4️⃣ Hotfix Crítico

```bash
# Desde main
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# Fix...
git commit -m "fix: critical bug"
git push origin hotfix/critical-bug

# PR: hotfix/critical-bug → main
# ✅ Fast-track con 2 approvals

# Sincronizar develop
git checkout develop
git merge main
git push origin develop
```

---

## 🔐 Configuración de Seguridad

### Branch Protection Rules

Configurar en **Settings** → **Branches**:

#### `main` (Production)
- ✅ Require pull request (2 approvals)
- ✅ Require status checks (lint, test, build, e2e)
- ✅ Require conversation resolution
- ✅ Require linear history
- ✅ Require signed commits
- ❌ Allow force pushes
- ❌ Allow deletions

#### `release/*` (Staging)
- ✅ Require pull request (1 approval)
- ✅ Require status checks (lint, test, build)
- ✅ Require linear history
- ❌ Allow force pushes
- ❌ Allow deletions

#### `develop` (Integration)
- ✅ Require pull request (1 approval)
- ✅ Require status checks (lint, test)
- ❌ Require linear history (permite merge commits)
- ❌ Allow force pushes
- ❌ Allow deletions

### CODEOWNERS

Revisión automática por equipo:

```
# Frontend
/apps/front-biosstel/ @frontend-team
/libs/frontend/ @frontend-team

# Backend
/apps/api-biosstel/ @backend-team
/libs/backend/ @backend-team

# DevOps
/docker/ @devops-team
/.github/ @devops-team

# Global
* @tech-lead
```

### GitHub Secrets

Ver [`SECRETS.md`](./SECRETS.md) para lista completa.

**Mínimos requeridos:**
- `GITHUB_TOKEN` (automático)
- `JWT_SECRET`
- `PROD_DB_*` (para deployment)

---

## 📊 Badges para README

Añadir al `README.md`:

```markdown
![CI](https://github.com/biosstel/babooni/workflows/CI%20Pipeline/badge.svg)
![CD](https://github.com/biosstel/babooni/workflows/CD%20Pipeline/badge.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
```

---

## ✅ Checklist de Implementación

### GitHub Configuration
- [ ] Workflows creados (`.github/workflows/`)
- [ ] Dependabot configurado
- [ ] CODEOWNERS creado
- [ ] PR template creado
- [ ] Branch protection rules configuradas
- [ ] GitHub Secrets añadidos

### Teams & Access
- [ ] Teams creados (@frontend-team, @backend-team, @devops-team, @tech-lead)
- [ ] Miembros asignados a teams
- [ ] Permisos configurados

### Branches
- [ ] `develop` branch creado
- [ ] `main` como default branch
- [ ] Branch protection rules aplicadas

### Testing
- [ ] Ejecutar pipeline en `feature/*` ✅
- [ ] Ejecutar pipeline en `develop` ✅
- [ ] Ejecutar pipeline en `release/*` ✅
- [ ] Ejecutar pipeline en `main` ✅

---

## 🐛 Troubleshooting

### Pipeline falla en Lint

```bash
# Ejecutar localmente
pnpm run lint:all

# Fix automático
pnpm run lint:all --fix
```

### Pipeline falla en Tests

```bash
# Ejecutar localmente
pnpm run test

# Ver cobertura
pnpm run test:ui
```

### Pipeline falla en Build

```bash
# Limpiar y rebuild
pnpm run build:front
pnpm run build:api
```

### Docker build falla

```bash
# Verificar Dockerfiles
docker build -f docker/frontend.Dockerfile .
docker build -f docker/api.Dockerfile .
```

---

## 📚 Referencias

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Dependabot](https://docs.github.com/en/code-security/dependabot)

---

**Última actualización:** Febrero 2026
**Mantenido por:** @tech-lead
