# 🏷️ Sistema de Tagging de Docker Images

Este documento explica el sistema de tagging de imágenes Docker para trazabilidad completa.

---

## 📦 Tags Generados

Cada build de Docker genera múltiples tags para máxima trazabilidad:

### Para rama `main` (producción):

```
ghcr.io/angelnietos/biosstel/frontend:main                    # Branch name
ghcr.io/angelnietos/biosstel/frontend:main-build-123          # Branch + Build #
ghcr.io/angelnietos/biosstel/frontend:main-a1b2c3d            # Branch + Short SHA
ghcr.io/angelnietos/biosstel/frontend:a1b2c3d4e5f6...         # Full SHA
ghcr.io/angelnietos/biosstel/frontend:latest                  # Latest (solo main)
ghcr.io/angelnietos/biosstel/frontend:v2026.02.16-123         # Version tag (si es release)
```

### Para rama `release/v1.2.3` (staging):

```
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3          # Branch name (normalizado)
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3-build-45  # Branch + Build #
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3-a1b2c3d  # Branch + Short SHA
ghcr.io/angelnietos/biosstel/frontend:a1b2c3d4e5f6...         # Full SHA
ghcr.io/angelnietos/biosstel/frontend:v1.2.3                  # Version tag
```

---

## 🏷️ Formato de Tags

| Tag Pattern               | Ejemplo                  | Uso                                       |
| ------------------------- | ------------------------ | ----------------------------------------- |
| `{branch}`                | `main`, `release-v1.2.3` | Identificar rama                          |
| `{branch}-build-{number}` | `main-build-123`         | Identificar build específico              |
| `{branch}-{short-sha}`    | `main-a1b2c3d`           | Identificar commit específico             |
| `{full-sha}`              | `a1b2c3d4e5f6...`        | SHA completo del commit                   |
| `latest`                  | `latest`                 | Última versión de main (solo producción)  |
| `v{version}`              | `v1.2.3`                 | Versión semántica (solo release branches) |

---

## 📊 Labels de Docker

Cada imagen incluye labels OCI estándar y custom para trazabilidad:

### Labels OCI Estándar:

```yaml
org.opencontainers.image.title: frontend
org.opencontainers.image.description: Biosstel frontend service
org.opencontainers.image.vendor: Biosstel
org.opencontainers.image.version: v1.2.3 (o 'dev' si no es release)
org.opencontainers.image.revision: a1b2c3d4e5f6... (SHA completo)
org.opencontainers.image.created: 2026-02-16T22:52:09Z
org.opencontainers.image.source: https://github.com/angelnietos/biosstel
org.opencontainers.image.url: https://github.com/angelnietos/biosstel
```

### Labels Custom (Biosstel):

```yaml
com.biosstel.branch: main
com.biosstel.build.number: 123
com.biosstel.build.sha: a1b2c3d4e5f6... (SHA completo)
com.biosstel.build.sha.short: a1b2c3d
com.biosstel.workflow.run: 22079802216
com.biosstel.workflow.run.url: https://github.com/.../actions/runs/22079802216
```

---

## 🔍 Consultar Información de una Imagen

### Ver todos los tags de una imagen:

```bash
# Listar tags en GitHub Container Registry
gh api /orgs/angelnietos/packages/container/biosstel-frontend/versions

# O usando Docker
docker pull ghcr.io/angelnietos/biosstel/frontend:main-build-123
docker inspect ghcr.io/angelnietos/biosstel/frontend:main-build-123 | jq '.[0].Config.Labels'
```

### Ver labels de una imagen:

```bash
docker inspect ghcr.io/angelnietos/biosstel/frontend:main-build-123 \
  | jq '.[0].Config.Labels | to_entries | from_entries'
```

**Salida ejemplo:**

```json
{
  "org.opencontainers.image.title": "frontend",
  "org.opencontainers.image.version": "dev",
  "org.opencontainers.image.revision": "a1b2c3d4e5f6...",
  "com.biosstel.branch": "main",
  "com.biosstel.build.number": "123",
  "com.biosstel.build.sha": "a1b2c3d4e5f6...",
  "com.biosstel.build.sha.short": "a1b2c3d",
  "com.biosstel.workflow.run": "22079802216",
  "com.biosstel.workflow.run.url": "https://github.com/.../actions/runs/22079802216"
}
```

---

## 🎯 Casos de Uso

### 1️⃣ Deploy a Producción

```bash
# Usar tag de build específico para trazabilidad
docker pull ghcr.io/angelnietos/biosstel/frontend:main-build-123
docker pull ghcr.io/angelnietos/biosstel/backend:main-build-123

# O usar latest (última versión de main)
docker pull ghcr.io/angelnietos/biosstel/frontend:latest
docker pull ghcr.io/angelnietos/biosstel/backend:latest
```

### 2️⃣ Deploy a Staging

```bash
# Usar tag de release branch
docker pull ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3-build-45
docker pull ghcr.io/angelnietos/biosstel/backend:release-v1.2.3-build-45
```

### 3️⃣ Rollback a Versión Anterior

```bash
# Identificar build anterior
docker pull ghcr.io/angelnietos/biosstel/frontend:main-build-122

# O usar SHA específico
docker pull ghcr.io/angelnietos/biosstel/frontend:main-a1b2c3d
```

### 4️⃣ Investigar Problema

```bash
# 1. Obtener información del build
docker inspect ghcr.io/angelnietos/biosstel/frontend:main-build-123 \
  | jq '.[0].Config.Labels."com.biosstel.workflow.run.url"'

# 2. Abrir el workflow run en GitHub
# 3. Ver logs, commits, etc.
```

### 5️⃣ Deploy por Versión (Release)

```bash
# Si es release branch, usar version tag
docker pull ghcr.io/angelnietos/biosstel/frontend:v1.2.3
docker pull ghcr.io/angelnietos/biosstel/backend:v1.2.3
```

---

## 📋 Ejemplo Completo

### Build #123 en rama `main`:

**Tags generados:**

```
ghcr.io/angelnietos/biosstel/frontend:main
ghcr.io/angelnietos/biosstel/frontend:main-build-123
ghcr.io/angelnietos/biosstel/frontend:main-a1b2c3d
ghcr.io/angelnietos/biosstel/frontend:a1b2c3d4e5f6789012345678901234567890abcdef
ghcr.io/angelnietos/biosstel/frontend:latest
```

**Labels:**

```yaml
com.biosstel.branch: main
com.biosstel.build.number: 123
com.biosstel.build.sha: a1b2c3d4e5f6789012345678901234567890abcdef
com.biosstel.build.sha.short: a1b2c3d
com.biosstel.workflow.run: 22079802216
com.biosstel.workflow.run.url: https://github.com/angelnietos/biosstel/actions/runs/22079802216
```

### Build #45 en rama `release/v1.2.3`:

**Tags generados:**

```
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3-build-45
ghcr.io/angelnietos/biosstel/frontend:release-v1.2.3-a1b2c3d
ghcr.io/angelnietos/biosstel/frontend:a1b2c3d4e5f6789012345678901234567890abcdef
ghcr.io/angelnietos/biosstel/frontend:v1.2.3
```

**Labels:**

```yaml
com.biosstel.branch: release-v1.2.3
com.biosstel.build.number: 45
com.biosstel.build.sha: a1b2c3d4e5f6789012345678901234567890abcdef
com.biosstel.build.sha.short: a1b2c3d
org.opencontainers.image.version: v1.2.3
```

---

## 🔗 Integración con GitHub Releases

Cuando se crea un release en `main`, se genera automáticamente:

1. **Git Tag**: `v2026.02.16-123` (fecha + build number)
2. **GitHub Release**: Con changelog y todos los tags de Docker
3. **Docker Tags**: Incluidos en el release notes

**Ejemplo de Release Notes:**

```markdown
## 📦 Docker Images

**Frontend:**

- `ghcr.io/angelnietos/biosstel/frontend:main`
- `ghcr.io/angelnietos/biosstel/frontend:main-build-123`
- `ghcr.io/angelnietos/biosstel/frontend:main-a1b2c3d`
- `ghcr.io/angelnietos/biosstel/frontend:a1b2c3d4e5f6...`
- `ghcr.io/angelnietos/biosstel/frontend:latest`
- `ghcr.io/angelnietos/biosstel/frontend:v2026.02.16-123`
```

---

## ✅ Ventajas de este Sistema

| Ventaja                         | Descripción                                         |
| ------------------------------- | --------------------------------------------------- |
| 🔍 **Trazabilidad Completa**    | Cada imagen tiene múltiples formas de identificarla |
| 🔄 **Rollback Fácil**           | Puedes volver a cualquier build anterior            |
| 📊 **Auditoría**                | Labels incluyen toda la información del build       |
| 🎯 **Deploy Específico**        | Puedes deployar un build exacto                     |
| 🔗 **Link a CI/CD**             | Labels incluyen URL al workflow run                 |
| 📝 **Documentación Automática** | GitHub Releases incluyen todos los tags             |

---

## 🚀 Mejores Prácticas

1. **Producción**: Usar `main-build-{number}` para deploys específicos
2. **Staging**: Usar `release-{version}-build-{number}` para testing
3. **Rollback**: Usar `main-{short-sha}` para volver a un commit específico
4. **Latest**: Solo para desarrollo local, no para producción
5. **Version Tags**: Usar `v{version}` solo para releases oficiales

---

**Última actualización:** Febrero 2026
