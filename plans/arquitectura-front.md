# Arquitectura Frontend - Modular y portable

## Principios

- Cada **feature** es una librería en `libs/frontend/features/*` y puede considerarse publicable como paquete.
- **Ninguna feature depende de otra feature** (solo de `ui`, `ui-layout`, `platform`, `shared`, `shared-types`).
- **Ninguna feature depende de Next.js** directamente; el enrutado y el ensamblado viven en la app y en `platform`.
- La **app** (`apps/front-biosstel`) solo importa features y las ensambla en rutas y layouts.
- **Infraestructura ≠ Dominio:** la capa de datos (api, data-access) es swappable; la UI no conoce detalles de red.
- **UI atómica** (`ui`) no conoce negocio; las features usan `ui` y `ui-layout` para componer.

---

## Estructura global

```
apps/
  front-biosstel/
    src/app/[locale]/
      (auth)/           # Login, forgot-password, registro-salida, etc.
      (admin)/          # Usuarios, add-user, add-client, configuracion-perfil, users/[id], etc.
      home/             # Dashboard objetivos (inicio)
      objetivos/        # Asignación, plantillas, histórico, niveles
      objetivos-terminales/
      fichajes/         # Control jornada, calendario, horarios, permisos, etc.
      operaciones/      # Comercial, telemarketing, tienda, backoffice
      empresa/          # Departamentos, centros trabajo, cuentas contables
      alertas/          # Recordatorios, alertas ventas, tracking
      backOffice/

libs/frontend/
  platform/             # Infraestructura adaptable: routing (Link), etc.
  ui/                   # Componentes atómicos (Button, Input, etc.)
  ui-layout/            # Layout visual sin negocio (PageContainer, SidebarLayout, etc.)
  shared/               # Utilidades y componentes compartidos del frontend
  features/
    auth/
    usuarios/
    objetivos/
    fichajes/
    operaciones/
    empresa/
    alertas/
```

---

## Capas por feature (libs/frontend/features/\*)

Cada feature tiene esta estructura (sin carpeta `domain/` ni `application/` explícitas; la orquestación está en hooks y shells):

```
libs/frontend/features/{feature}/src/
├── types/              # Tipos del dominio (re-export de shared-types o específicos)
├── api/                # Clientes HTTP / endpoints (consumidos solo por data-access)
├── data-access/        # Hooks que orquestan datos (useXxx, useYyy)
├── pages/
│   ├── components/     # Componentes de página (formularios, listas, dashboards)
│   └── layouts/       # Layouts de la feature (AuthPageLayout, DashboardLayout, etc.)
├── shell/              # Composición de alto nivel (AuthShell, UsersLayout, etc.)
└── index.ts            # Exporta types, data-access, shell, pages
```

### Qué hace cada capa

- **types:** Tipos e interfaces del dominio; suelen re-exportar desde `@biosstel/shared-types` o extenderlos.
- **api:** Llamadas a la API (fetch, axios). No se exporta al público; solo lo usa `data-access`.
- **data-access:** Hooks (p. ej. `useLogin`, `useDashboardHome`) que usan `api` y exponen estado y acciones a la UI.
- **pages/components:** Componentes React del dominio (LoginForm, UserList, AlertsTable, etc.). Usan hooks de data-access y componentes de `ui` / `ui-layout`.
- **pages/layouts:** Layouts específicos de la feature (título, contenedor, sidebar si aplica).
- **shell:** Componente que compone layout + contenido y puede usar `ui-layout`; no conoce rutas concretas de Next.

Las **rutas** y el **ensamblado** viven en la app: cada ruta importa el shell o el componente de página de la feature correspondiente.

---

## UI, ui-layout y shared (regla de composición y boundaries)

- **libs/frontend/ui:** Componentes **atómicos** (Button, Input, Card, iconos, animaciones, etc.). **No importa** de ninguna otra lib del frontend (shared, ui-layout, platform, features). Sin lógica de negocio ni fetch. Ver [FRONTEND_BOUNDARIES.md](./FRONTEND_BOUNDARIES.md).
- **libs/frontend/ui-layout:** Solo **tipos de vista** (PageContainer, SidebarLayout, CenteredLayout, MainContainer). Puede usar `ui`. Sin negocio.
- **libs/frontend/shared:** Componentes **compartidos entre varias features** (AuthLayout, MainAppLayout, Sidebar, Header, MobileBar, PageContent). Puede usar **solo** `ui`, `ui-layout` y `platform`. No importa de features.

---

## Platform

- **libs/frontend/platform:** Adaptadores de infraestructura (p. ej. `Link` para routing). La app y las features usan `Link` de platform para no depender directamente de Next en la feature.

---

## Cómo ensambla la app

Cada página bajo `app/[locale]/...` importa de la feature correspondiente y opcionalmente un layout:

```tsx
// Ejemplo: app/[locale]/(auth)/login/page.tsx
import { LoginForm, AuthShell } from '@biosstel/auth';
export default function LoginPage() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
```

La app no contiene lógica de negocio; solo decide qué shell o página renderizar en cada ruta.

---

## Features actuales (7)

| Feature     | Alcance              | Componentes / páginas principales                                                                            |
| ----------- | -------------------- | ------------------------------------------------------------------------------------------------------------ |
| auth        | Acceso               | Login, ForgotPassword, EmailSend, VerifyAccount, RegistroSalida                                              |
| usuarios    | Gestión personal     | UserList, AddUserForm, AddClientForm, DetalleUsuario, Documentacion, ConfiguracionPerfil                     |
| objetivos   | Ventas y rendimiento | DashboardHomePage, TerminalObjectivesPage, Asignación departamentos/personas, Plantillas, Histórico, Niveles |
| fichajes    | Time tracking        | ControlJornada, CalendarioLaboral, Horarios, Permisos, FichajeManual, Geolocalizacion                        |
| operaciones | Por rol              | ComercialVisitas, TelemarketingAgenda, TiendaVentas, BackofficeRevision                                      |
| empresa     | Estructura           | Departamentos, CentrosTrabajo, CuentasContables                                                              |
| alertas     | Notificaciones       | AlertsTable, AlertsDashboard, Recordatorios, AlertasVentas, TrackingAlerts                                   |

---

## Boundaries y tags (Nx)

En los `project.json` de las features se usan tags como:

- `type:feature`
- `scope:auth`, `scope:usuarios`, `scope:objetivos`, etc.

Las features solo dependen de `ui`, `ui-layout`, `platform`, `shared`, `shared-types`. No hay dependencias entre features (salvo casos explícitos y documentados, p. ej. objetivos puede usar el componente AlertsTable de alertas).

---

## Extracción

Para reutilizar una feature en otra app (p. ej. otra Next o Remix):

1. La feature ya está en `libs/frontend/features/{name}`.
2. En la nueva app se configuran los paths `@biosstel/{name}` (o el alias que se decida).
3. Se importan shell y páginas desde la feature; la app solo define rutas y layout raíz.

No se copia código; se reutiliza la misma librería.

---

## Referencia

- Backend y hexagonal: [HEXAGONAL_ARCHITECTURE.md](./HEXAGONAL_ARCHITECTURE.md) y [arquitectura-api.md](./arquitectura-api.md).
- Estructura de la app: `apps/front-biosstel/src/app/[locale]/` y `apps/front-biosstel/src/constants/paths.ts`.
