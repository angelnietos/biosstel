# 🚀 Setup Checklist - GitHub Repository

El código ha sido pushed a: **https://github.com/angelnietos/biosstel**

---

## ✅ Completado Automáticamente

- ✅ Repositorio inicializado
- ✅ Rama `main` creada y pusheada
- ✅ Rama `develop` creada y pusheada
- ✅ CI/CD workflows configurados (`.github/workflows/`)
- ✅ Dependabot configurado
- ✅ CODEOWNERS creado
- ✅ PR template creado
- ✅ Documentación completa

---

## 🔧 Configuración Manual Requerida en GitHub

### 1️⃣ Branch Protection Rules (CRÍTICO)

Ve a: **Settings** → **Branches** → **Add branch protection rule**

#### Regla para `main`

- **Branch name pattern**: `main`
- ✅ **Require a pull request before merging**
  - Required approvals: **2**
  - ✅ Dismiss stale pull request approvals when new commits are pushed
  - ✅ Require review from Code Owners
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `lint`
    - `test-unit`
    - `build (frontend)`
    - `build (backend)`
    - `ci-success`
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits**
- ✅ **Require linear history**
- ✅ **Do not allow bypassing the above settings**
- ❌ **Allow force pushes**: Disabled
- ❌ **Allow deletions**: Disabled

**Merge methods:**

- ❌ Allow merge commits
- ✅ Allow squash merging
- ❌ Allow rebase merging

#### Regla para `develop`

- **Branch name pattern**: `develop`
- ✅ **Require a pull request before merging**
  - Required approvals: **1**
- ✅ **Require status checks to pass before merging**
  - Required status checks:
    - `lint`
    - `test-unit`
- ✅ **Require conversation resolution before merging**
- ❌ **Require linear history**: Disabled (permite merge commits)
- ❌ **Allow force pushes**: Disabled
- ❌ **Allow deletions**: Disabled

**Merge methods:**

- ✅ Allow merge commits
- ✅ Allow squash merging
- ❌ Allow rebase merging

#### Regla para `release/*`

- **Branch name pattern**: `release/*`
- ✅ **Require a pull request before merging**
  - Required approvals: **1**
- ✅ **Require status checks to pass before merging**
  - ✅ Require branches to be up to date before merging
  - Required status checks:
    - `lint`
    - `test-unit`
    - `build (frontend)`
    - `build (backend)`
- ✅ **Require conversation resolution before merging**
- ✅ **Require linear history**
- ❌ **Allow force pushes**: Disabled
- ❌ **Allow deletions**: Disabled

---

### 2️⃣ Default Branch

Ve a: **Settings** → **General** → **Default branch**

- Cambiar de `main` a `main` (ya debería estar bien)
- ✅ Verificar que `main` es el default

---

### 3️⃣ GitHub Actions Permissions

Ve a: **Settings** → **Actions** → **General**

- ✅ **Actions permissions**: Allow all actions and reusable workflows
- ✅ **Workflow permissions**: Read and write permissions
- ✅ **Allow GitHub Actions to create and approve pull requests**: Enabled

---

### 4️⃣ Secrets Configuration

Ve a: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### Mínimos Requeridos:

| Secret Name  | Value                                    | Uso               |
| ------------ | ---------------------------------------- | ----------------- |
| `JWT_SECRET` | `[generar con: openssl rand -base64 32]` | Autenticación JWT |

#### Para Deployment (opcional ahora):

| Secret Name        | Value               | Uso                   |
| ------------------ | ------------------- | --------------------- |
| `PROD_DB_HOST`     | `tu-db-host.com`    | PostgreSQL producción |
| `PROD_DB_PORT`     | `5432`              | Puerto PostgreSQL     |
| `PROD_DB_USER`     | `biosstel_prod`     | Usuario DB            |
| `PROD_DB_PASSWORD` | `[password seguro]` | Password DB           |
| `PROD_DB_NAME`     | `biosstel_prod`     | Nombre DB             |
| `DEPLOY_SSH_KEY`   | `[SSH private key]` | Deploy via SSH        |
| `DEPLOY_HOST`      | `server.com`        | Servidor producción   |
| `DEPLOY_USER`      | `deploy`            | Usuario SSH           |

Ver guía completa: [`.github/SECRETS.md`](.github/SECRETS.md)

---

### 5️⃣ Environments (opcional ahora, configurar antes de deploy)

Ve a: **Settings** → **Environments** → **New environment**

#### Production Environment

- **Name**: `production`
- **Deployment branches**: Selected branches → `main`
- **Environment secrets**: Añadir secrets específicos de producción
- **Required reviewers**: Añadir 2 reviewers

#### Staging Environment

- **Name**: `staging`
- **Deployment branches**: Selected branches → `release/*`
- **Environment secrets**: Añadir secrets específicos de staging
- **Required reviewers**: Añadir 1 reviewer

---

### 6️⃣ Teams (si trabajas en equipo)

Ve a: **Organization Settings** → **Teams** → **New team**

Crear estos teams y añadir miembros:

- `@biosstel-team` → Todos los desarrolladores
- `@frontend-team` → Equipo frontend
- `@backend-team` → Equipo backend
- `@devops-team` → DevOps/Infrastructure
- `@tech-lead` → Tech leads
- `@qa-team` → QA/Testing
- `@security-team` → Security
- `@database-team` → Database admins

**Permisos sugeridos:**

- `@biosstel-team`: **Write**
- `@tech-lead`: **Admin**
- `@devops-team`: **Maintain**

---

### 7️⃣ Dependabot Alerts

Ve a: **Settings** → **Code security and analysis**

- ✅ **Dependency graph**: Enabled
- ✅ **Dependabot alerts**: Enabled
- ✅ **Dependabot security updates**: Enabled
- ✅ **Dependabot version updates**: Enabled (ya configurado en `.github/dependabot.yml`)

---

### 8️⃣ Repository Settings Recomendados

Ve a: **Settings** → **General**

#### Features

- ✅ **Issues**: Enabled
- ✅ **Projects**: Enabled (si quieres usar GitHub Projects)
- ✅ **Wiki**: Disabled (usamos README)
- ✅ **Discussions**: Optional

#### Pull Requests

- ✅ **Allow squash merging**: Enabled
- ✅ **Allow merge commits**: Enabled (solo para develop)
- ❌ **Allow rebase merging**: Disabled
- ✅ **Always suggest updating pull request branches**: Enabled
- ✅ **Allow auto-merge**: Enabled
- ✅ **Automatically delete head branches**: Enabled

---

## 🧪 Verificar Pipeline

### 1️⃣ Crear PR de prueba

```bash
# Desde develop
git checkout develop
git checkout -b feature/test-ci

# Hacer un cambio mínimo
echo "# Test" >> TEST.md
git add TEST.md
git commit -m "test: verificar CI pipeline"
git push origin feature/test-ci
```

### 2️⃣ Crear PR en GitHub

- Ve a: https://github.com/angelnietos/biosstel/pull/new/feature/test-ci
- Base: `develop` ← Compare: `feature/test-ci`
- **Verificar que los checks se ejecutan:**
  - ✅ Lint
  - ✅ Test unit
  - ✅ PR checks

### 3️⃣ Merge y verificar develop

Una vez mergeado:

- ✅ Pipeline de CI se ejecuta en `develop`
- ✅ Todos los checks pasan

---

## 📊 URLs Útiles

| Recurso         | URL                                              |
| --------------- | ------------------------------------------------ |
| **Repositorio** | https://github.com/angelnietos/biosstel          |
| **Actions**     | https://github.com/angelnietos/biosstel/actions  |
| **Issues**      | https://github.com/angelnietos/biosstel/issues   |
| **PRs**         | https://github.com/angelnietos/biosstel/pulls    |
| **Settings**    | https://github.com/angelnietos/biosstel/settings |
| **Branches**    | https://github.com/angelnietos/biosstel/branches |
| **Releases**    | https://github.com/angelnietos/biosstel/releases |

---

## ✅ Checklist Final

### Configuración Básica (HACER AHORA)

- [ ] Branch protection para `main` configurada
- [ ] Branch protection para `develop` configurada
- [ ] GitHub Actions habilitado
- [ ] Default branch es `main`
- [ ] Secret `JWT_SECRET` añadido

### Configuración Avanzada (ANTES DE PRODUCCIÓN)

- [ ] Environments creados (production, staging)
- [ ] Secrets de producción añadidos
- [ ] Teams creados y miembros asignados
- [ ] Branch protection para `release/*` configurada
- [ ] Dependabot alerts habilitado
- [ ] CODEOWNERS configurado con teams correctos

### Testing

- [ ] PR de prueba creado y mergeado
- [ ] Pipeline CI ejecuta correctamente
- [ ] Pipeline CD ejecuta en `main` (cuando esté listo)

---

## 🚨 Importante

**NO subas a producción sin:**

1. ✅ Configurar todos los secrets de producción
2. ✅ Configurar environments con reviewers
3. ✅ Probar deployment en staging primero
4. ✅ Tener backups de base de datos
5. ✅ Documentar proceso de rollback

---

**Siguiente paso recomendado:** Configurar branch protection rules para `main` y `develop` AHORA.

Ver documentación completa en:

- [`.github/BRANCH_PROTECTION.md`](.github/BRANCH_PROTECTION.md)
- [`.github/SECRETS.md`](.github/SECRETS.md)
- [`.github/README.md`](.github/README.md)
