# 🔐 GitHub Secrets Configuration

Este documento lista todos los secrets que deben configurarse en GitHub para que la pipeline CI/CD funcione correctamente.

## 📋 Secrets Requeridos

### Repository Secrets

Ir a **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

#### 🐳 Docker Registry

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `DOCKER_USERNAME` | Usuario de Docker Hub / GHCR | `biosstel` |
| `DOCKER_PASSWORD` | Password / Token de Docker | `ghp_xxxxxxxxxxxxx` |

> **Nota:** Si usas GitHub Container Registry (GHCR), usa `GITHUB_TOKEN` automático en vez de estos.

#### 🚀 Deployment

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `DEPLOY_SSH_KEY` | SSH private key para deployment | `-----BEGIN RSA PRIVATE KEY-----...` |
| `DEPLOY_HOST` | Host del servidor de producción | `biosstel.com` |
| `DEPLOY_USER` | Usuario SSH para deployment | `deploy` |
| `DEPLOY_PORT` | Puerto SSH | `22` |

#### 🗄️ Database (Production)

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `PROD_DB_HOST` | Host de PostgreSQL producción | `db.biosstel.com` |
| `PROD_DB_PORT` | Puerto de PostgreSQL | `5432` |
| `PROD_DB_USER` | Usuario de base de datos | `biosstel_prod` |
| `PROD_DB_PASSWORD` | Password de base de datos | `xxx` |
| `PROD_DB_NAME` | Nombre de base de datos | `biosstel_prod` |

#### 🔑 Auth & Security

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `JWT_SECRET` | Secret para JWT tokens | `random-secret-key-here` |
| `JWT_EXPIRES_IN` | Expiración de tokens | `7d` |

#### 📧 Email (opcional)

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `SMTP_HOST` | Host SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Puerto SMTP | `587` |
| `SMTP_USER` | Usuario SMTP | `no-reply@biosstel.com` |
| `SMTP_PASSWORD` | Password SMTP | `xxx` |

#### 🔔 Notifications (opcional)

| Secret | Descripción | Ejemplo |
|--------|-------------|---------|
| `SLACK_WEBHOOK_URL` | Webhook de Slack | `https://hooks.slack.com/...` |
| `DISCORD_WEBHOOK_URL` | Webhook de Discord | `https://discord.com/api/webhooks/...` |

---

## 🌍 Environment Secrets

Para configurar secrets por environment (production, staging):

Ir a **Settings** → **Environments** → **New environment** → **Add secret**

### Production Environment

| Secret | Valor |
|--------|-------|
| `API_URL` | `https://api.biosstel.com` |
| `FRONTEND_URL` | `https://biosstel.com` |
| `NODE_ENV` | `production` |

### Staging Environment

| Secret | Valor |
|--------|-------|
| `API_URL` | `https://api-staging.biosstel.com` |
| `FRONTEND_URL` | `https://staging.biosstel.com` |
| `NODE_ENV` | `staging` |

---

## 📝 Cómo Configurar

### 1️⃣ Generar SSH Key para Deployment

```bash
# Generar nueva key
ssh-keygen -t ed25519 -C "deploy@biosstel" -f deploy_key

# Copiar public key al servidor
ssh-copy-id -i deploy_key.pub user@server

# Copiar private key a GitHub Secret
cat deploy_key | pbcopy  # macOS
cat deploy_key | xclip   # Linux
```

### 2️⃣ Generar JWT Secret

```bash
# Generar secret aleatorio
openssl rand -base64 32
```

### 3️⃣ Configurar en GitHub

1. Ve a tu repositorio en GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Añade nombre y valor
5. Click **Add secret**

### 4️⃣ Verificar en Actions

```yaml
# Ejemplo de uso en workflow
env:
  DATABASE_URL: ${{ secrets.PROD_DB_PASSWORD }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}
```

---

## ✅ Checklist de Configuración

### Básico (requerido para CI)
- [ ] `GITHUB_TOKEN` (automático)

### Docker (si usas Docker Hub)
- [ ] `DOCKER_USERNAME`
- [ ] `DOCKER_PASSWORD`

### Deployment (si autodeploy habilitado)
- [ ] `DEPLOY_SSH_KEY`
- [ ] `DEPLOY_HOST`
- [ ] `DEPLOY_USER`

### Database (producción)
- [ ] `PROD_DB_HOST`
- [ ] `PROD_DB_PORT`
- [ ] `PROD_DB_USER`
- [ ] `PROD_DB_PASSWORD`
- [ ] `PROD_DB_NAME`

### Security
- [ ] `JWT_SECRET`

### Opcional
- [ ] Email SMTP config
- [ ] Slack/Discord webhooks

---

## 🔒 Seguridad

### ✅ Buenas Prácticas

1. **Nunca commitear secrets** en código
2. **Rotar secrets regularmente** (cada 90 días)
3. **Usar secrets con mínimos privilegios**
4. **Auditar acceso** a secrets periódicamente
5. **Usar environments** para separar prod/staging

### ❌ NO HACER

- ❌ No usar secrets en pull requests de forks (seguridad)
- ❌ No loguear secrets en outputs de actions
- ❌ No compartir secrets entre repositorios sin necesidad
- ❌ No usar valores dummy en producción

---

## 📚 Referencias

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub Environments](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Security Best Practices](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)

---

**Última actualización:** Febrero 2026
