# Frontend: boundaries y responsabilidades

Reglas de dependencias entre libs del frontend. **Ninguna lib puede importar “hacia arriba”** (p. ej. `ui` no importa de `shared` ni de `ui-layout`).

---

## Capas y dependencias permitidas

```
                    ┌─────────────────┐
                    │  app (Next.js)  │
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │   features   │   │   shared     │   │   platform   │
  └──────┬───────┘   └──────┬───────┘   └──────────────┘
         │                  │
         │    ┌──────────────┼──────────────┐
         │    │              │              │
         ▼    ▼              ▼              ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │  ui-layout   │   │  ui-layout   │   │  shared-types│
  └──────┬───────┘   └──────┬───────┘   └──────────────┘
         │                  │
         └────────┬─────────┘
                  ▼
           ┌──────────────┐
           │      ui      │  ← sin dependencias de otras libs frontend
           └──────────────┘
```

---

## 1. `@biosstel/ui` — Componentes atómicos

**Responsabilidad:** Primitivos de interfaz (botones, inputs, iconos, modales, animaciones). Cero lógica de negocio, cero fetch, cero conocimiento de rutas o dominio.

**Puede importar:**
- `react`, `react-dom`
- Librerías de estilo/animación (p. ej. `motion`, Tailwind vía clases)
- **Nada** de `@biosstel/shared`, `@biosstel/ui-layout`, `@biosstel/platform`, ni de ninguna feature.

**Puede exportar:** Atoms, molecules, iconos, constantes de animación. Lo que usen el resto de libs para construir pantallas.

**Tags Nx:** `type:ui`, `scope:ui`

---

## 2. `@biosstel/ui-layout` — Estructura de vista / páginas

**Responsabilidad:** Solo **tipos de vista** y estructura visual: contenedores, layout con sidebar, página centrada, etc. Sin negocio (sin “usuarios”, “objetivos”, etc.).

**Puede importar:**
- `react`
- Opcionalmente `@biosstel/ui` si necesita componentes atómicos dentro del layout (p. ej. un wrapper que use `Card`).
- **No** puede importar de `shared`, `platform`, ni features.

**Puede exportar:** `PageContainer`, `SidebarLayout`, `CenteredLayout`, `MainContainer`, etc.

**Tags Nx:** `type:layout`, `scope:layout`

---

## 3. `@biosstel/shared` — Compartido en toda la app

**Responsabilidad:** Componentes y composiciones que **varias features** reutilizan (layouts de app, sidebar, header, barra móvil, contenido de página). Pueden estar formados por componentes de `ui` y/o `ui-layout`.

**Puede importar:**
- `@biosstel/ui`
- `@biosstel/ui-layout`
- `@biosstel/platform` (Link, usePathname, etc.)
- `@biosstel/shared-types` si necesita tipos compartidos
- **No** puede importar de ninguna feature.

**Puede exportar:** `AuthLayout`, `MainAppLayout`, `Sidebar`, `Header`, `MobileBar`, `PageContent`, tipos de navegación, etc.

**Tags Nx:** `type:ui`, `scope:shared`

---

## 4. `@biosstel/platform` — Infraestructura (routing, etc.)

**Responsabilidad:** Adaptadores de infraestructura (p. ej. `Link`, `useRouter`, `usePathname`) para que la app y las features no dependan directamente de Next.js.

**Puede importar:** Next.js, next-intl, etc. No otras libs frontend de negocio.

---

## 5. Features (`@biosstel/auth`, `usuarios`, etc.)

**Pueden importar:**
- `@biosstel/ui`
- `@biosstel/ui-layout`
- `@biosstel/shared`
- `@biosstel/platform`
- `@biosstel/shared-types`
- **No** pueden importar de otras features (salvo casos documentados).

**Regla de implementación:** Las features no deben contener CSS ni HTML propio; solo componen pantallas con componentes de ui, shared y ui-layout (ver `libs/frontend/features/README.md`).

### Excepciones conocidas (feature → feature)

Actualmente existen dependencias entre features que **no cumplen** la regla "ninguna feature importa de otra". Quedan documentadas como pendiente de refactor:

| Feature que importa | Feature importada | Uso | Refactor sugerido |
|--------------------|-------------------|-----|--------------------|
| `objetivos` | `alertas` | `AlertsTable` en dashboard | Mover `AlertsTable` a `shared` o inyectar vía app/shell |
| `objetivos` | `fichajes` | `fetchCurrentFichaje`, tipos de estado | Extraer a `shared` o API compartida vía platform |
| `usuarios` | `empresa` | `AddDepartmentModal` en pantalla usuarios | Mover modal a `shared` o componer en app |

Objetivo: eliminar estas dependencias en futuros refactors (mover componentes compartidos a `shared` o ensamblar en la app).

---

## Resumen de reglas

| Lib         | No puede importar                          |
|------------|---------------------------------------------|
| **ui**     | shared, ui-layout, platform, features       |
| **ui-layout** | shared, platform, features             |
| **shared** | features                                   |
| **features** | otras features                           |

---

## Cómo mantener los boundaries

1. **Code review:** Revisar que los `import` de cada lib respeten la tabla.
2. **ESLint (opcional):** Regla `no-restricted-imports` o plugin Nx `@nx/enforce-module-boundaries` con `depConstraints` por tag (p. ej. `scope:ui` solo puede depender de paquetes sin tag de frontend o con `scope:ui` interno).
3. **Documentación:** Este documento y [arquitectura-front.md](./arquitectura-front.md) como referencia.

---

## Referencia

- [arquitectura-front.md](./arquitectura-front.md) — Estructura de la app, features y capas.
- [README.md](./README.md) — Índice de documentación de arquitectura.
