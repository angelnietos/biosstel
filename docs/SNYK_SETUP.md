# Configuración de Snyk

El CI ya ejecuta Snyk (dependencias + código). Para que el análisis funcione necesitas el token de API.

## 1. Obtener el token de Snyk

1. Entra en [Snyk](https://app.snyk.io).
2. **Account settings** (icono de tu org/perfil) → **General** → **Auth token** (o **API token**).
3. Copia el token o genera uno nuevo si hace falta.

## 2. GitHub Actions (CI)

Para que el job "🛡️ Snyk Security Scan" use tu cuenta:

1. Repo en GitHub → **Settings** → **Secrets and variables** → **Actions**.
2. **New repository secret**.
3. **Name:** `SNYK_TOKEN`
4. **Secret:** pega el token de Snyk.
5. Guarda.

En cada push/PR el workflow usará ese secret y el análisis aparecerá en el resumen de la acción y en tu [dashboard de Snyk](https://app.snyk.io).

## 3. Ejecución en local

En la raíz del repo, en tu `.env` (no se sube a git), añade:

```env
SNYK_TOKEN=tu_token_de_snyk
```

Luego ejecuta en local (mismo tipo de análisis que en CI):

- **Análisis completo (dependencias + código):** `pnpm snyk:scan`
- Solo dependencias: `pnpm snyk:test`
- Solo código (SAST): `pnpm snyk:code`
- Subir estado al dashboard: `pnpm snyk:monitor`

## Nota sobre “pasar” el análisis

El job de Snyk en CI tiene `continue-on-error: true`, así que el pipeline no falla aunque Snyk reporte vulnerabilidades. Para que el CI falle cuando haya High/Critical, habría que quitar ese flag en `.github/workflows/ci.yml` (pasos de Snyk).
