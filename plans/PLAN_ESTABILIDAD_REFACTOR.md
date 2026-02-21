# Plan: CI/CD estable, tests, Figma, backend y refactor

Este plan ordena el trabajo para dejar el monorepo Biosstel estable: CI/CD verde, tests fiables, features alineadas a Figma, backend consistente y mejoras de arquitectura/refactor. Cada paso sigue la estructura de [plan-mode.mdc](apps/api-biosstel/.cursor/rules/plan-mode.mdc).

**Referencias:** [README.md](../README.md), [HEXAGONAL_ARCHITECTURE.md](HEXAGONAL_ARCHITECTURE.md), [arquitectura-front.md](arquitectura-front.md), [FRONTEND_BOUNDARIES.md](FRONTEND_BOUNDARIES.md).

---

## Estado de ejecución del plan

| Paso | Implementado al 100% |
|------|----------------------|
| **1. CI/CD** | `continue-on-error` quitado de lint y typecheck; [docs/CI_CD.md](../docs/CI_CD.md) con secrets y comandos; todos los jobs usan `pnpm install --frozen-lockfile`. |
| **2. Tests** | Timeouts en Vitest; URL health en Playwright; [playwright-global-setup.ts](../playwright-global-setup.ts) espera `/api/health`; [docs/TESTING.md](../docs/TESTING.md) con cobertura informativa. |
| **3. Figma** | [docs/DESIGN_TOKENS_FIGMA.md](../docs/DESIGN_TOKENS_FIGMA.md) con fuente de verdad (`theme.css`), uso en componentes y **tabla pantallas ↔ Figma** (pendiente rellenar enlaces y marcar revisado). |
| **4. Backend** | `GlobalHttpExceptionFilter` global; [docs/API_RESPONSES.md](../docs/API_RESPONSES.md); health y Swagger; libs `api-*` con estructura application/infrastructure. |
| **5. Refactor** | `api-shared`: `paginate()` y `PaginatedResult`; excepciones feature→feature documentadas en [FRONTEND_BOUNDARIES.md](FRONTEND_BOUNDARIES.md). |
| **6. Documentación** | README "Validar antes de push" y enlaces a docs; checklist en este plan; CI_CD, TESTING, API_RESPONSES, DESIGN_TOKENS_FIGMA creados. |

Solo quedan como tareas manuales: configurar secrets en GitHub, y (opcional) rellenar la tabla pantallas↔Figma y revisar pantallas.

---

## Checklist de cierre (comprobar al terminar)

- [ ] **CI:** Pasa en main/develop con secrets `SONAR_TOKEN` y `SNYK_TOKEN` configurados en GitHub (Settings → Secrets and variables → Actions).
- [x] **Validación local:** Los comandos `pnpm run lint && typecheck:api && typecheck:front && test:coverage && build` están documentados y deben pasar en local; ver [docs/CI_CD.md](../docs/CI_CD.md) y README "Validar antes de push".
- [ ] **Figma:** Design tokens en `theme.css`; tabla pantallas ↔ Figma en [docs/DESIGN_TOKENS_FIGMA.md](../docs/DESIGN_TOKENS_FIGMA.md); revisar pantallas principales y marcar "Revisado" en la tabla.
- [x] **Backend:** Endpoints documentados en Swagger; health en `/api/health` estable; formato de errores unificado con `GlobalHttpExceptionFilter`; ver [docs/API_RESPONSES.md](../docs/API_RESPONSES.md).
- [x] **Feature→feature:** Excepciones documentadas en [FRONTEND_BOUNDARIES.md](FRONTEND_BOUNDARIES.md) (objetivos→alertas/fichajes, usuarios→empresa). Refactor para eliminarlas queda como tarea futura; `@biosstel/shared-types` es la fuente de tipos compartidos.
- [x] **Documentación:** [docs/CI_CD.md](../docs/CI_CD.md), [docs/TESTING.md](../docs/TESTING.md), [docs/API_RESPONSES.md](../docs/API_RESPONSES.md), [docs/DESIGN_TOKENS_FIGMA.md](../docs/DESIGN_TOKENS_FIGMA.md) creados y enlazados desde README.

---

## Paso 1: CI/CD estable

### 1. Objetivo

- Que el pipeline de GitHub Actions sea determinista: mismo código → mismo resultado (verde o rojo según reglas claras).
- Evitar que el CI pase con lint/typecheck/test rotos por uso de `continue-on-error: true` donde no debe.
- Garantizar que los secrets necesarios (SONAR_TOKEN, SNYK_TOKEN) estén documentados y que la configuración sea única y mantenible.

### 2. Qué se va a construir o decidir

- **Decisión:** Qué jobs deben hacer fallar el pipeline y cuáles pueden ser informativos.
- **Cambios en** `.github/workflows/ci.yml`:
  - Quitar `continue-on-error: true` de **lint** y **typecheck** (o limitarlo solo a pasos opcionales y dejar un paso “strict” que falle).
  - Mantener `continue-on-error: true` en Snyk/Sonar solo si se decide que no bloquean el merge; si deben bloquear, quitarlo.
  - Unificar versiones (Node, pnpm) en `env` y asegurar que `pnpm install --frozen-lockfile` se use en todos los jobs que instalan deps.
- **Documentación:** Lista de secrets requeridos (SONAR_TOKEN, SNYK_TOKEN) en README o en `docs/CI_CD.md` con instrucciones para configurarlos.

### 3. Código de ejemplo o de implementación

**Ejemplo: paso de lint que debe fallar el pipeline si hay errores**

```yaml
# En .github/workflows/ci.yml, job lint
- name: 🔍 Run ESLint
  run: pnpm nx run-many -t lint --projects=front-biosstel,api-biosstel --skip-nx-cache
  # Sin continue-on-error: true para que el pipeline falle si hay errores de lint

- name: 🔍 TypeCheck Frontend
  run: pnpm run typecheck:front
  # Sin continue-on-error para que typecheck bloquee

- name: 🔍 TypeCheck Backend
  run: pnpm run typecheck:api
  # Sin continue-on-error
```

**Ejemplo: documento de secrets**

```markdown
## Secrets necesarios para CI

| Secret         | Uso                    | Dónde obtenerlo |
|----------------|------------------------|------------------|
| SONAR_TOKEN   | Análisis SonarCloud    | SonarCloud → Account → Security |
| SNYK_TOKEN    | Análisis Snyk          | Snyk → Account settings → API token |
```

### 4. Resolución de ambigüedades

- **“Estable”** = el pipeline no pasa cuando hay errores de lint, typecheck o tests unitarios; Snyk/Sonar se tratan como bloqueantes o informativos según decisión explícita.
- **Snyk/Sonar:** Si se quiere que el merge esté bloqueado por vulnerabilidades o quality gate, quitar `continue-on-error: true` en esos pasos; si solo se quiere visibilidad, dejarlo y documentarlo.

### 5. Resultado esperado

- Pipeline que falle de forma clara cuando lint, typecheck o tests unitarios fallen.
- Documentación de secrets y pasos para reproducir CI en local (lint, typecheck, test).
- Un único archivo de workflow (o conjunto mínimo) sin duplicación de versión de Node/pnpm.

---

## Paso 2: Tests estables

### 1. Objetivo

- Tests unitarios y E2E reproducibles: mismos resultados en local y en CI.
- Reducir o eliminar tests “flaky” (que a veces pasan y a veces fallan).
- Cobertura y timeouts definidos para no bloquear el CI por tiempos indefinidos.

### 2. Qué se va a construir o decidir

- **Unit tests (Vitest):** Revisar tests que dependan de orden de ejecución, timers o estado global; usar `vi.useFakeTimers()` o `vi.setSystemTime()` donde haga falta; evitar dependencias entre `describe`/`it`.
- **E2E (Playwright):** Asegurar que la BD y los servicios estén listos antes de correr tests (health checks, seeds); timeouts por test y por global coherentes con el job de CI (p. ej. 20 min para el job).
- **Coverage:** Definir umbral mínimo (opcional) en `vitest.config` o en CI (p. ej. fallar si coverage baja de X%); o dejar solo reporte sin umbral y documentar la decisión.
- **CI:** El job `test-unit` ya usa `pnpm run test:coverage`; verificar que no haya `--no-file-parallelism` u otras flags que oculten fallos; que el artefacto de coverage se suba correctamente para Sonar.

### 3. Código de ejemplo o de implementación

**Vitest: test aislado con timer falso**

```typescript
// Ejemplo en libs/backend/api-usuarios o libs/frontend/features/auth
import { vi } from 'vitest';

beforeEach(() => {
  vi.useFakeTimers();
});
afterEach(() => {
  vi.useRealTimers();
});

it('expira token en 7d', () => {
  const token = createToken({ expiresIn: '7d' });
  vi.advanceTimersByTime(8 * 24 * 60 * 60 * 1000);
  expect(validateToken(token)).toBeFalse();
});
```

**Playwright: esperar a que la API esté lista antes de E2E**

```typescript
// playwright.config.ts o global setup
async function globalSetup() {
  const base = process.env.API_URL || 'http://localhost:4000';
  for (let i = 0; i < 30; i++) {
    try {
      const r = await fetch(`${base}/api/health`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error('API not ready for E2E');
}
```

### 4. Resolución de ambigüedades

- **“Estables”** = sin flakiness por tiempo, orden o estado compartido; si un test falla, debe ser por un cambio de código o datos, no por azar.
- **Coverage:** Si no se fija umbral, dejarlo explícito en el plan y en README (“coverage solo informativo”).

### 5. Resultado esperado

- `pnpm test:coverage` y `pnpm test:e2e` reproducibles en local y en CI con los mismos criterios.
- Sin `continue-on-error` en los pasos de test del workflow (salvo decisión explícita para E2E en ramas no main/develop).
- Documentación breve de cómo ejecutar tests y qué esperar (README o docs/TESTING.md).

---

## Paso 3: Features alineadas a Figma

### 1. Objetivo

- Que las pantallas y componentes del frontend coincidan con el diseño en Figma (espaciados, tipografía, colores, estados, breakpoints).
- Tener una única fuente de verdad para tokens de diseño (colores, espacios, fuentes) y usarla en Tailwind y en componentes.

### 2. Qué se va a construir o decidir

- **Design tokens:** Definir variables CSS o tema (Tailwind) con colores, tamaños de fuente, espaciado y sombras que reflejen Figma; ubicación recomendada: `libs/frontend/ui` o `apps/front-biosstel` (theme) y reutilización en todas las features.
- **Componentes en `@biosstel/ui`:** Revisar Button, Input, Card, etc. y ajustar variantes (primary, secondary, danger), tamaños y estados (hover, disabled) según Figma.
- **Layouts y páginas:** Ajustar `ui-layout` (PageContainer, SidebarLayout) y las páginas de cada feature para usar los mismos tokens (márgenes, paddings, tipografía).
- **Checklist por feature:** Lista de pantallas/rutas y su correspondiente diseño en Figma (link o nombre de frame) para validar uno a uno.

### 3. Código de ejemplo o de implementación

**Tokens en Tailwind (ejemplo)**

```js
// tailwind.config o tema compartido
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A',   // según Figma
          hover: '#1E293B',
          muted: '#64748B',
        },
        success: '#22C55E',
        danger: '#EF4444',
      },
      spacing: {
        'page-x': '1.5rem',    // padding horizontal de página (Figma)
        'section': '2rem',
      },
      fontSize: {
        'page-title': ['1.5rem', { lineHeight: '1.75rem' }],
      },
    },
  },
};
```

**Uso en componente de UI**

```tsx
// libs/frontend/ui/src/lib/Button.tsx
<button
  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50"
  ...
/>
```

### 4. Resolución de ambigüedades

- **“Igual a Figma”** = mismo aspecto visual y comportamiento (hover, focus, disabled); no implica pixel-perfect si no se especifica, pero sí consistencia de sistema de diseño.
- Si hay discrepancias entre Figma y requisitos de accesibilidad (contraste, focus visible), priorizar accesibilidad y documentar la diferencia.

### 5. Resultado esperado

- Fichero (o conjunto) de design tokens usado en toda la app y en Storybook.
- Componentes en `ui` y páginas de features que usen esos tokens y reflejen los diseños de Figma.
- Lista o tabla de pantallas vs Figma para revisión (en docs o en el plan).

---

## Paso 4: Backend consistente y “todo ok”

### 1. Objetivo

- API REST estable: contratos claros, respuestas coherentes, códigos HTTP correctos y manejo de errores unificado.
- Respetar la arquitectura hexagonal en todas las libs `api-*`: controllers → use cases → ports → repositories/entities.
- Validación de entrada (DTOs) y documentación (Swagger) al día.

### 2. Qué se va a construir o decidir

- **Estructura por lib backend:** Cada `api-*` debe seguir la misma plantilla: `application/ports` (input/output), `application/use-cases`, `infrastructure/api` (controllers), `infrastructure/persistence` (TypeORM). Ver [HEXAGONAL_ARCHITECTURE.md](HEXAGONAL_ARCHITECTURE.md).
- **Respuestas y errores:** Formato común para éxito (p. ej. `{ data, message? }`) y error (código HTTP, mensaje, opcionalmente `code` o `details`); usar filtros de excepción de NestJS (ExceptionFilter) para no devolver 500 genéricos sin formato.
- **Validación:** DTOs con class-validator en todos los endpoints que reciben body/query; no confiar en datos sin validar.
- **Swagger:** Tags y descripciones por controlador; DTOs documentados con ApiProperty donde aporte valor.
- **Health:** Endpoint `/api/health` estable y usado por CI/E2E para esperar a que la API esté lista.

### 3. Código de ejemplo o de implementación

**Controller que delega en use case y devuelve formato estándar**

```typescript
// libs/backend/api-usuarios/src/infrastructure/api/users.controller.ts
@Post()
@UsePipes(new ValidationPipe({ whitelist: true }))
async create(@Body() dto: CreateUserDto) {
  const user = await this.userManagement.createUser(dto);
  return { data: user, message: 'Usuario creado' };
}
```

**ExceptionFilter global (ejemplo)**

```typescript
// apps/api-biosstel/src/filters/http-exception.filter.ts
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();
    const body = exception.getResponse();
    res.status(status).json({
      statusCode: status,
      message: typeof body === 'object' && 'message' in body ? body.message : exception.message,
      error: exception.name,
    });
  }
}
```

### 4. Resolución de ambigüedades

- **“Todo ok”** = endpoints documentados, validados, con respuestas y errores coherentes; no implica implementar toda la lógica de negocio de cada feature en este paso, sino que la estructura y contratos estén bien puestos.
- Las reglas en `apps/api-biosstel/.cursor/rules/agents.mdc` hablan de microservicios y Gateway; el monorepo actual es una sola API NestJS con libs hexagonales. Seguir la estructura de [HEXAGONAL_ARCHITECTURE.md](HEXAGONAL_ARCHITECTURE.md) y del README como referencia de arquitectura real.

### 5. Resultado esperado

- Todas las libs `api-*` con la misma estructura de carpetas (application + infrastructure).
- ExceptionFilter global y DTOs con validación en endpoints públicos.
- Swagger actualizado y health estable; CI/E2E pueden depender de `/api/health`.

---

## Paso 5: Refactor y mejora de arquitectura

### 1. Objetivo

- Reducir duplicación de código entre features (front y back).
- Mantener boundaries claros (front: [FRONTEND_BOUNDARIES.md](FRONTEND_BOUNDARIES.md); back: hexagonal).
- Mejorar tipado compartido (`@biosstel/shared-types`) y reutilización de utilidades.

### 2. Qué se va a construir o decidir

- **Shared-types:** Revisar que DTOs, enums y tipos de dominio usados por API y front estén en `shared-types`; evitar definir los mismos tipos en cada feature.
- **Código duplicado en frontend:** Identificar lógica repetida (formateo de fechas, validaciones de formulario, llamadas API similares) y extraer a `shared` o a hooks/data-access reutilizables dentro de la misma feature o en `platform` si es infraestructura.
- **Código duplicado en backend:** Servicios o repositorios repetidos entre `api-*`; extraer a `api-shared` (utilidades, guards, mappers) manteniendo que cada feature tenga sus use cases y puertos propios.
- **Dependencias entre features:** Respetar “ninguna feature depende de otra feature” en el front; en el back, que las dependencias entre libs estén explícitas en `project.json` y que no haya imports circulares.
- **Nx:** Revisar tags y boundaries; que `nx graph` refleje la arquitectura deseada (app → features → ui/platform/shared → shared-types).

### 3. Código de ejemplo o de implementación

**Tipo compartido en shared-types**

```typescript
// libs/shared-types/src/user.ts
export interface UserDto {
  id: string;
  email: string;
  role: string;
  nombre?: string;
}
export type CreateUserInput = Pick<UserDto, 'email' | 'nombre'> & { password: string; role: string };
```

**Utilidad en api-shared**

```typescript
// libs/backend/api-shared/src/utils/pagination.ts
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const start = (page - 1) * pageSize;
  return {
    data: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  };
}
```

### 4. Resolución de ambigüedades

- **“Refactor”** = mejorar estructura y reutilización sin cambiar el comportamiento observable de la aplicación; los tests deben seguir pasando.
- Si un cambio de arquitectura implica romper la API o el contrato con el front, debe tratarse como un paso aparte (versión de API o migración).

### 5. Resultado esperado

- Menos código duplicado entre libs; tipos de dominio y DTOs centralizados en `shared-types` donde corresponda.
- `api-shared` con utilidades y patrones comunes; features que los consumen sin duplicar lógica.
- Frontend sin dependencias feature→feature; dependencias solo hacia ui, ui-layout, platform, shared, shared-types.
- Grafo Nx coherente con la documentación de arquitectura.

---

## Paso 6: Documentación y criterios de “hecho”

### 1. Objetivo

- Dejar registrado qué se considera “estable” y “completo” para CI, tests, Figma, backend y refactor.
- Facilitar que cualquier desarrollador pueda seguir el plan y verificar los resultados.

### 2. Qué se va a construir o decidir

- **README:** Sección o enlace a “Estado del proyecto” / “Cómo validar”: comandos para lint, typecheck, test, build y opcionalmente sonar/snyk en local.
- **docs/CI_CD.md (o equivalente):** Secrets, ramas que disparan el pipeline, qué jobs bloquean el merge y cuáles son informativos.
- **docs/TESTING.md:** Cómo ejecutar unit y E2E; qué cubren; si hay umbral de coverage y dónde se configura.
- **Checklist final:** Lista de comprobaciones (p. ej. “CI verde en main”, “todas las rutas X,Y,Z revisadas contra Figma”, “Swagger actualizado”) para dar por cerrado el plan.

### 3. Código de ejemplo o de implementación

**Fragmento de README**

```markdown
## Validar antes de push

pnpm run lint
pnpm run typecheck:api && pnpm run typecheck:front
pnpm run test:coverage
pnpm run build
```

**Checklist (en este plan o en docs)**

```markdown
- [ ] CI pasa en main/develop sin secrets vacíos
- [ ] pnpm run lint && typecheck && test:coverage && build pasan en local
- [ ] Design tokens aplicados; pantallas principales revisadas vs Figma
- [ ] Endpoints documentados en Swagger; health estable
- [ ] Sin dependencias feature→feature en front; shared-types como fuente de tipos
```

### 4. Resolución de ambigüedades

- La documentación debe vivir en el repo (README, docs/, plans/) y actualizarse cuando se cambien criterios de CI o de arquitectura.

### 5. Resultado esperado

- Cualquier persona del equipo pueda seguir README y docs para ejecutar y validar el proyecto.
- Checklist comprobable para cerrar este plan de estabilidad y refactor.
- Cambios futuros en CI o arquitectura reflejados en la documentación.

---

## Orden sugerido de ejecución

1. **Paso 1 (CI/CD)** — Base para que el resto se valide en cada push.
2. **Paso 2 (Tests)** — Asegurar que los cambios de los siguientes pasos no rompan nada.
3. **Paso 4 (Backend)** — Contratos y estructura antes de tocar mucho el front.
4. **Paso 3 (Figma)** — Ajuste visual y tokens con tests ya estables.
5. **Paso 5 (Refactor)** — Con CI y tests verdes, refactorizar con seguridad.
6. **Paso 6 (Documentación)** — Actualizar y cerrar criterios al final.

Si se prefiere priorizar la experiencia visual, se puede hacer Paso 3 antes que Paso 4, manteniendo siempre Paso 1 y 2 al inicio.
