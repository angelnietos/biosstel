# CI/CD — Pipeline y configuración

## Workflow principal: `ci.yml`

El pipeline se ejecuta en **push** y **pull_request** a las ramas `main`, `develop` y `release/**`.

| Job | Descripción | ¿Bloquea el merge? |
|-----|-------------|---------------------|
| 🔍 Lint & Typecheck | ESLint (front + api), Prettier, TypeCheck front y api | **Sí** |
| 🧪 Unit Tests & Coverage | Vitest con cobertura; artefacto para SonarCloud | **Sí** |
| 🧪 E2E Tests | Playwright (solo en main/develop/release/**) | **Sí** (si se ejecuta) |
| 🛡️ Snyk Security | Vulnerabilidades y SAST | No (informativo) |
| 📡 SonarCloud | Análisis de código y quality gate | No (informativo) |
| 🏗️ Build | Build de frontend y backend | **Sí** |

El job **✅ CI Success** falla si **Lint**, **Unit Tests** o **Build** fallan. Snyk y SonarCloud no bloquean por defecto.

---

## Secrets necesarios

Configurar en **GitHub → Repositorio → Settings → Secrets and variables → Actions**.

| Secret | Uso | Dónde obtenerlo |
|--------|-----|------------------|
| `SONAR_TOKEN` | Análisis SonarCloud (job 📡 SonarCloud) | [SonarCloud](https://sonarcloud.io) → Account → Security (o Organization tokens) |
| `SNYK_TOKEN` | Análisis Snyk (job 🛡️ Snyk) | [Snyk](https://app.snyk.io) → Account settings → General → API token |

Sin estos secrets, los jobs de Snyk y SonarCloud fallarán; el resto del pipeline puede pasar. Para que el CI esté completamente verde, crea ambos secrets.

---

## Reproducir el CI en local

Antes de hacer push, puedes ejecutar los mismos checks que bloquean el pipeline:

```bash
pnpm install --frozen-lockfile
pnpm run lint
pnpm run format:check
pnpm run typecheck:api
pnpm run typecheck:front
pnpm run test:coverage
pnpm run build
```

O usar el script de validación (si existe):

```bash
pnpm run validate   # lint + typecheck + test
pnpm run build       # además del build
```

---

## Versiones

- **Node:** 20 (definido en `env.NODE_VERSION` en `ci.yml`)
- **pnpm:** 10 (definido en `env.PNPM_VERSION`)
- **Instalación:** siempre `pnpm install --frozen-lockfile` para reproducibilidad.

---

## Hacer que Snyk o SonarCloud bloqueen el merge

Por defecto ambos jobs tienen `continue-on-error: true`. Para que un fallo en Snyk o SonarCloud haga fallar el pipeline:

1. Abre `.github/workflows/ci.yml`.
2. En el job `snyk` o `sonar`, quita la línea `continue-on-error: true` de los pasos que quieras que bloqueen.
3. Opcionalmente, ajusta el job **ci-success** para que exija `needs.snyk.result == 'success'` o `needs.sonar.result == 'success'` antes de marcar el pipeline como pasado.
