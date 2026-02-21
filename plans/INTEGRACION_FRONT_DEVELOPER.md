# Plan: Integración del front del compañero en la arquitectura features/boundaries

**Objetivo global:** Integrar todos los componentes y pantallas de la app del compañero (`C:\Users\amuni\Desktop\front-biosstel-developer`) en el monorepo actual, manteniendo **exactamente** la misma apariencia (Figma) pero usando **nuestra** arquitectura: features con boundaries, shell, data-access, api y componentes en `@biosstel/ui` / `@biosstel/ui-layout` / `@biosstel/shared`.

**Convención de nombres:** Él usa átomos / moléculas / organismos / templates. Nosotros usamos:
- **UI atómica** → `libs/frontend/ui` (primitivos sin negocio)
- **Layouts genéricos** → `libs/frontend/ui-layout` y `libs/frontend/shared`
- **Dominio** → `libs/frontend/features/{auth|usuarios|objetivos|...}/src/pages/components` y `shell/`

---

## Paso 1: Design tokens y estilos globales (Figma)

### 1. Objetivo
- Asegurar que la app tenga los mismos design tokens que la app del compañero (y por tanto Figma).
- Evitar que al integrar componentes se pierdan colores, tipografía, sombras o radios.

### 2. Qué se va a construir o decidir
- Copiar o fusionar `theme.css` del compañero en `apps/front-biosstel/src/app/[locale]/theme.css`.
- Ajustar `globals.css` si hace falta (scrollbar, body) para que coincida con la app del compañero.
- Decisión: los tokens son la **fuente de verdad** en la app; las libs (`ui`, `ui-layout`, features) usan clases Tailwind que referencian esas variables (p. ej. `text-datos`, `bg-button-primary`, `rounded-20`).

### 3. Código de ejemplo
- En `theme.css` del compañero hay variables que en nuestro `theme.css` pueden faltar, por ejemplo:
  - `--color-button-disabled`, `--text-datos`, `--text-h1`…`--text-micro`, `--radius-20`, `--radius-input`, `--shadow-*`, `--color-border-input`, etc.
- Añadir en nuestro `theme.css` todas las variables que tenga el compañero y no estén en el nuestro. Ejemplo de bloque a asegurar:

```css
@theme {
  /* ... existentes ... */
  --color-button-disabled: #d9d9d9;
  --text-datos: clamp(32px, 2.5vw, 35px);
  --text-h1: clamp(24px, 1.875vw, 26px);
  --text-h2: clamp(20px, 1.5625vw, 22px);
  --text-h3: clamp(18px, 1.406vw, 20px);
  --text-body: clamp(16px, 1.25vw, 18px);
  --text-sm: clamp(14px, 1.094vw, 15px);
  --text-mid: clamp(12px, 0.9375vw, 13px);
  --text-mini: clamp(10px, 0.781vw, 11px);
  --text-micro: clamp(6px, 0.469vw, 9px);
  --radius-20: 20px;
  --radius-input: 8px;
  --shadow-button: 0 4px 7px 0 rgba(221, 221, 221, 0.5);
  --color-border-input: #d7d7d7;
  /* ... resto del theme del compañero ... */
}
```

- En `tailwind.config` (o donde se definan las fuentes), asegurar que `--font-inter` esté cargada igual que en la app del compañero.

### 4. Resolución de ambigüedades
- **¿Dónde vive `theme.css`?** Solo en la app: `apps/front-biosstel/src/app/[locale]/theme.css`. Las libs no importan CSS; usan clases que la app ya ha definido vía Tailwind + theme.
- **¿Duplicamos o enlazamos?** Se copia/fusiona el contenido en nuestro repo para no depender de una ruta externa.

### 5. Resultado esperado
- `theme.css` y `globals.css` de la app tienen paridad con la app del compañero.
- Cualquier componente que use clases como `text-h1`, `bg-button-primary`, `shadow-button`, `rounded-20` se ve igual que en Figma.

---

## Paso 2: Mapeo Átomos (compañero) → @biosstel/ui

### 1. Objetivo
- Que todos los “átomos” del compañero existan en nuestra librería `@biosstel/ui` con la misma apariencia (Figma), manteniendo nuestra API de componentes (props estables, accesibilidad, sin lógica de negocio).

### 2. Qué se va a construir o decidir
- Inventario: el compañero tiene en `components/atoms`: Button, Input, Modal, Select, BasicSelect, NumberInput, IconButton, Card, Loading, ErrorFormMsg, FloatingLabel, PaginationDots, DepartmentBadge, ClockArc, y animaciones (DivAnimSlideUp, etc.).
- Cada uno se mapea así:
  - **Si ya existe en `@biosstel/ui`**: extender props o variantes para que, con `className` (o una prop de “variant” que aplique clases del theme), se vea como en Figma. No cambiar la API pública más de lo necesario.
  - **Si no existe**: crear el componente en `libs/frontend/ui/src/components/<Nombre>/` siguiendo el estilo visual del compañero (clases Tailwind + variables de `theme.css`).

### 3. Código de ejemplo
- **Button:** Nosotros tenemos `Button` con `variant`, `isLoading`, `fullWidth`. El compañero tiene `Button` base + moléculas como `ButtonPrimaryLg` que aplican `bg-black`, `shadow-button`, `rounded-lg`, etc. Solución: añadir una variante que use las clases Figma, por ejemplo `variant="primaryLg"` que aplique las mismas clases que `ButtonPrimaryLg`, o permitir `className` override y documentar las clases recomendadas para Figma.

```tsx
// Ejemplo: en Button.tsx de @biosstel/ui, variante que coincida con Figma
primaryLg: 'flex w-full items-center justify-center gap-2.5 rounded-lg py-3 px-4 text-sm leading-normal text-white shadow-button bg-black disabled:bg-button-disabled',
```

- **Input:** El compañero tiene label flotante y `errorInput`. Nuestro `Input` debe aceptar `label` (opcional), `error` (boolean) y aplicar las mismas clases (borde error, label flotante con `text-mid`, `bg-white`, `border-border-input`). Si hace falta, crear `FloatingLabel` en `ui` y usarlo dentro de `Input`.

- **Nuevos átomos que no tenemos:** Por ejemplo `Modal`, `Card` (si el nuestro no cumple Figma), `ErrorFormMsg` (ya lo tenemos), `NumberInput`, `IconButton`, etc. Crearlos en `ui` con la misma estructura de archivos (ComponentName.tsx + index.ts) y exportarlos en `ui/src/index.ts`.

### 4. Resolución de ambigüedades
- **Props `cssProps` vs `className`:** En nuestra arquitectura usamos `className`; los componentes migrados deben aceptar `className` y no depender de `cssProps`. Al traer código del compañero, reemplazar `cssProps` por `className`.
- **Animaciones:** Los átomos de animación (DivAnimSlideUp, etc.) pueden vivir en `@biosstel/ui` como componentes de presentación (sin negocio), o en una carpeta `ui/src/components/animations/`.

### 5. Resultado esperado
- Cualquier pantalla que en la app del compañero use átomos puede construirse en nuestra app usando solo `@biosstel/ui`.
- No se importan componentes desde la carpeta del compañero; todo está en el monorepo bajo `ui` o features.

---

## Paso 3: Mapeo Moléculas (compañero) → @biosstel/ui o features

### 1. Objetivo
- Integrar las “moléculas” del compañero: o bien como componentes reutilizables en `@biosstel/ui` (si son genéricos) o como partes de las features (si son de dominio).

### 2. Qué se va a construir o decidir
- **Moléculas genéricas (sin dominio):** InputPassword, SearchInput, DateInput, Dropdown (genérico), TabButton, Pagination (si es solo UI). → Vivir en `@biosstel/ui`. Implementación: copiar la estructura y estilos del compañero, pero usar nuestros átomos (`Input`, `Button`) y `className`.
- **Moléculas de dominio:** ObjectiveProgress, FamilyObjectiveCard, AssignmentCard, LegendDot, ObjectiveCircle, botones “Add” con icono (ButtonAddPrimary, etc.). → Vivir en la feature correspondiente. Por ejemplo: ObjectiveProgress, FamilyObjectiveCard, AssignmentCard → `libs/frontend/features/objetivos/src/pages/components/` (o subcarpetas como `ObjectiveProgress/`, `AssignmentCard/`). Esos componentes pueden usar `@biosstel/ui` y datos inyectados por el shell/página (no hacen fetch ellos mismos).

### 3. Código de ejemplo
- **InputPassword:** En el compañero usa `Input` + toggle de visibilidad. En `@biosstel/ui` crear o ajustar `InputPassword` para que tenga el mismo aspecto (mismas clases que el compañero) y API con `className`, `error`, `label`.
- **ObjectiveProgress (dominio):** En `libs/frontend/features/objetivos/src/pages/components/ObjectiveProgress/ObjectiveProgress.tsx`. Recibe `achieved`, `target`, `color`, `centered`, `isEditing` y renderiza igual que la molécula del compañero; la página o el shell obtienen los datos con `useObjectiveDetail` (o el hook que corresponda) y se los pasan.

```tsx
// Ejemplo: uso en una página de objetivos
import { ObjectiveProgress } from '../components/ObjectiveProgress';
// ...
<ObjectiveProgress
  achieved={currentObjective.achieved}
  target={currentObjective.target}
  color={objective.color}
  centered
  isEditing={isEditing}
/>
```

### 4. Resolución de ambigüedades
- **Botones “Add” (ButtonAddPrimary, ButtonAddSecondary, etc.):** Si son solo estilo (icono + texto), pueden ser variantes de `Button` en `ui` (p. ej. `variant="addPrimary"`). Si llevan lógica de negocio (p. ej. abrir modal de “añadir departamento”), la lógica va en la feature y el botón en `ui` solo recibe `onClick` y `children`.
- **Dropdown/DropdownAction:** Si el dropdown es genérico (lista de opciones, onSelect), puede estar en `ui`. Si “DropdownAction” es específico de objetivos (añadir departamentos, etc.), queda en la feature objetivos como componente de página.

### 5. Resultado esperado
- Moléculas genéricas disponibles en `@biosstel/ui`.
- Moléculas de dominio ubicadas en la feature correcta y usadas por las páginas/shells sin duplicar código del compañero (solo estructura y estilos alineados con Figma).

---

## Paso 4: Layout principal (Sidebar + Header + MobileBar) y shells

### 1. Objetivo
- Tener el mismo layout principal que la app del compañero (Sidebar, Header, barra móvil) dentro de nuestra arquitectura, sin depender de rutas ni de Next directamente en la feature.

### 2. Qué se va a construir o decidir
- El compañero tiene `(main)/layout.tsx` con `<Sidebar />`, `<Header />`, `<main>{children}</main>`, `<MobileBar />`.
- En nuestra arquitectura:
  - **Opción A:** Crear un layout compartido en `libs/frontend/shared` (p. ej. `MainAppLayout`) que reciba `sidebar`, `header`, `children` y opcionalmente `mobileBar`. La app en `apps/front-biosstel` usa ese layout en el grupo de rutas correspondiente (admin, home, objetivos, etc.) y pasa los componentes de Sidebar/Header que quiera.
  - **Opción B:** Sidebar y Header son componentes que viven en `shared` (porque los usa más de una feature) o en una feature “layout” si se prefiere. Las rutas bajo `(admin)`, `home`, `objetivos`, etc. usan un único layout que renderiza Sidebar + Header + MobileBar + children.

Recomendación: **Sidebar, Header, MobileBar** como componentes en `libs/frontend/shared` (o `ui-layout` si son solo estructura visual). Copiar el JSX y estilos del compañero; reemplazar `Link`/rutas por `Link` de `@biosstel/platform` y paths desde `constants/paths` de la app (o inyectados). El layout que los compone puede ser un componente `MainAppLayout` en `shared` que reciba `children` y opcionalmente custom sidebar/header, por defecto los del diseño Figma.

### 3. Código de ejemplo
- En `libs/frontend/shared/src/components/MainAppLayout/MainAppLayout.tsx`:

```tsx
'use client';
import { ReactNode } from 'react';
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { MobileBar } from '../MobileBar';

export const MainAppLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex h-screen bg-gray-100">
    <div className="hidden md:block">
      <Sidebar />
    </div>
    <div className="flex flex-1 flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-y-auto px-2 pb-20 pt-2 sm:px-6 md:pb-6">
        {children}
      </main>
    </div>
    <div className="fixed bottom-0 left-0 z-50 w-full md:hidden">
      <MobileBar />
    </div>
  </div>
);
```

- Sidebar/Header/MobileBar: copiar de `front-biosstel-developer/src/components/organisms/`, sustituir `Link` por `import { Link } from '@biosstel/platform'` y `href` con rutas que coincidan con nuestra app (p. ej. `/home`, `/users`, etc.). Navegación y paths deben definirse en la app o en `platform`/constants compartidos.

### 4. Resolución de ambigüedades
- **Dónde viven Sidebar/Header:** En `shared` si los usan varias features; si solo un grupo de rutas los usa, podría ser un shell específico. Lo más simple es `shared` para un único layout principal.
- **Items de menú:** Pueden venir de una constante (navItems) en la app o en shared; si el compañero tiene `constants/navItems.ts`, migrarlo y usar `Link` de platform con `locale` si aplica.

### 5. Resultado esperado
- Todas las pantallas “internas” (home, usuarios, objetivos, etc.) se ven con el mismo Sidebar, Header y MobileBar que en la app del compañero.
- No hay imports desde la carpeta del compañero; todo está en `shared` (o `ui-layout`) y la app solo importa el layout y lo usa en el layout de rutas.

---

## Paso 5: Auth (login, forgot-password) con aspecto Figma

### 1. Objetivo
- Las pantallas de login y forgot-password se vean igual que en la app del compañero, usando nuestra feature `auth`: AuthShell, useLogin, api auth.

### 2. Qué se va a construir o decidir
- **AuthLayout:** Ya tenemos `AuthLayout` en `shared`; es muy similar al del compañero (logo, sección + aside con imagen). Ajustar si falta algo (clases `rounded-20`, tamaños) para coincidir al 100% con Figma.
- **LoginForm:** Sustituir el contenido actual de `libs/frontend/features/auth/src/pages/components/LoginForm/LoginForm.tsx` por la estructura y estilos del `LoginForm` del compañero (incl. Input con label flotante, InputPassword, enlace “forgot password”, botón primario grande). Cambios obligatorios:
  - Usar **nuestro** `useLogin` (data-access) en lugar de `usePostLogin`.
  - Usar **nuestro** `Link` de `@biosstel/platform` y rutas de la app (p. ej. `/forgot-password`).
  - Mantener Formik + validación pero con nuestros tipos (email/username según lo que espere la API actual).
  - Inputs y botón usar componentes de `@biosstel/ui` con las clases/variantes definidas en Pasos 2 y 3 para que se vean como Figma.
- **AuthPageLayout:** Ya usa `MainContainer`; el compañero tiene un bloque con título `text-h1`/`text-datos` y `max-w-80`. Verificar que nuestro `AuthPageLayout` y `MainContainer` apliquen las mismas clases (`w-full max-w-80 px-4 md:max-w-86 md:px-0`, `mb-8 text-h1 font-semibold text-black md:text-datos`).
- **Forgot-password:** ForgotPasswordForm y ForgotPasswordContainer del compañero: misma lógica — estructura y estilos en nuestra feature auth (ForgotPasswordForm, etc.), datos con nuestro data-access si existe, o crearlo; UI idéntica a Figma.

### 3. Código de ejemplo
- En `LoginForm.tsx` (auth feature), después de integrar el aspecto del compañero:

```tsx
import { Input, InputPassword, ErrorFormMsg, Button } from '@biosstel/ui';
import { Link } from '@biosstel/platform';
import { AuthPageLayout } from '../../layouts';
import { useLogin } from '../../../data-access';
// ...
<AuthPageLayout title={t('loginPage.title')}>
  <form ...>
    <Input ... className={inputStyles} error={Boolean(errors.email)} />
    <InputPassword ... className={inputStyles} containerClassName="w-full" error={Boolean(errors.password)} />
    <Link href="/forgot-password" className="self-end text-mid font-semibold text-black underline">...</Link>
    <Button type="submit" variant="primaryLg" fullWidth className="mt-4" disabled={...} isLoading={isSubmitting}>
      {t('loginPage.BtnSend')}
    </Button>
  </form>
</AuthPageLayout>
```

- `inputStyles` debe ser el mismo que el compañero: `h-[43px] w-full rounded-lg border border-border-input bg-white px-3 text-body` (y las variables de theme ya disponibles en la app).

### 4. Resolución de ambigüedades
- **Username vs email:** Si nuestra API usa `email`, el formulario debe enviar `email`; si el compañero usa `username`, ajustar etiquetas/traducciones y el campo a lo que espere el backend actual.
- **Forgot password:** Si no tenemos aún flujo de forgot-password en data-access, crear el hook y la llamada API en la feature auth y conectar el formulario del compañero a ese hook.

### 5. Resultado esperado
- Login y forgot-password visualmente iguales a la app del compañero, con datos y navegación usando solo la feature auth y platform.

---

## Paso 6: Home y vistas por rol (Admin, Comercial, Backoffice, etc.)

### 1. Objetivo
- La pantalla “Home” y las vistas por rol (AdminHome, ComercialHome, BackofficeHome, etc.) del compañero queden integradas en nuestra feature de objetivos (o la que corresponda al “dashboard home”) con nuestro data-access y misma apariencia.

### 2. Qué se va a construir o decidir
- El compañero tiene `(main)/home/page.tsx` que seguramente renderiza una vista según rol (AdminHome, ComercialHome, …). Nosotros tenemos `DashboardHomePage` en la feature objetivos.
- Decisión: el contenido de cada `XxxHome` del compañero (AdminHome, ComercialHome, etc.) se convierte en componentes dentro de la feature que corresponda. Si “home” es sobre todo objetivos y tareas, puede vivir en `libs/frontend/features/objetivos/src/pages/components/DashboardHomePage/` con subcomponentes o variantes por rol (AdminHome, ComercialHome, …). Los datos deben venir de hooks existentes (useDashboardHome, etc.) o de nuevos hooks en data-access que consuman nuestra API.
- Copiar el JSX y estilos de cada `HomeViews/XxxHome` del compañero; reemplazar datos mock o sus hooks por nuestros hooks; usar componentes de `@biosstel/ui` y componentes de dominio ya mapeados (PendingTasks, ObjetivosReducedSection, AgendaSection, AlertasSection, etc.).

### 3. Código de ejemplo
- En la feature objetivos, por ejemplo `DashboardHomePage.tsx` puede determinar el rol (o recibirlo por contexto/prop) y renderizar:
  - `AdminHome` → mismo diseño que el compañero, datos con useDashboardHome o similar.
  - `ComercialHome`, `BackofficeHome`, etc. de la misma forma.
- Cada `XxxHome` es un componente de la feature que usa organismos del compañero ya migrados (PendingTasks, FilterBar, ObjetivosReducedSection, AgendaSection, AlertasSection, FamilyObjectivesGrid, etc.) como componentes de la feature (en `pages/components`).

### 4. Resolución de ambigüedades
- **Detección de rol:** Si la app del compañero usa Redux o contexto para el rol, nosotros debemos usar nuestro mecanismo (contexto, store, o dato del usuario desde auth). El shell o la página principal de home obtiene el rol y pasa el componente correcto (AdminHome, ComercialHome, …).
- **Organismos compartidos (PendingTasks, AlertasSection, etc.):** Si pertenecen a una sola feature, viven en esa feature. Si PendingTasks es de “tareas” y tenemos feature de objetivos que las muestra, pueden vivir en objetivos o en una feature “tareas” si existe. Por consistencia con la arquitectura actual, si solo se usan en el home de objetivos, quedan en objetivos.

### 5. Resultado esperado
- Home con la misma disposición y contenido que en la app del compañero, con datos reales (o los mismos mocks temporalmente) y rutas/layout de nuestra app.

---

## Paso 7: Usuarios (lista, filtros, tabla, add user)

### 1. Objetivo
- Pantallas de usuarios (lista con filtros, tabla, modal o página “add user”) con el aspecto del compañero y nuestra feature usuarios (data-access, api).

### 2. Qué se va a construir o decidir
- Migrar organismos/templates: UsersFilterBar, TableView (Header, Row, PagesController, HandleRow), AddUserForm (UserFields, PlatformUsersSection), ConfirmModal.
- **TableView:** Es un template genérico (tabla con cabecera, filas, paginación). Puede vivir en `@biosstel/ui` como componente de presentación (recibe columnas, filas, paginación) o en `shared`. La decisión: si solo se usa en usuarios y objetivos, se puede poner en cada feature; si se reutiliza en muchas features, mejor en `ui` o `shared`. Recomendación: componente `TableView` en `ui` o `shared` que reciba configuración de columnas y datos; las páginas de usuarios y objetivos lo usan con sus propios hooks de datos.
- **UsersFilterBar:** Feature usuarios, `pages/components/UsersFilterBar` (o dentro de la página de lista). Usa nuestros hooks de filtros y datos.
- **AddUserForm:** Feature usuarios, `pages/components/AddUserForm`. Misma estructura y campos que el compañero; validación y submit con nuestro data-access (createUser o similar).
- **ConfirmModal:** Genérico → `@biosstel/ui` (Modal con título, descripción, botones confirm/cancel).

### 3. Código de ejemplo
- Página de usuarios en la app: sigue importando desde `@biosstel/usuarios` el componente de lista (p. ej. `UserList` o la página que use TableView + UsersFilterBar). Ese componente internamente usa:
  - `useUsersTableConfig` (o equivalente en nuestra feature) para columnas y datos.
  - `TableView` de ui/shared con esa config.
  - `UsersFilterBar` con filtros que actualicen el estado que consume la tabla.
- Add user: si el compañero lo tiene como modal, nuestra app puede tener una ruta `(admin)/add-user/page.tsx` que renderice el shell de usuarios con `AddUserForm` a pantalla completa, o un modal; lo importante es que el formulario sea el mismo visualmente y use nuestro API de creación de usuario.

### 4. Resolución de ambigüedades
- **Modal add user vs página:** Si en Figma es modal, podemos implementar modal en la app que renderice `AddUserForm`; la feature exporta `AddUserForm` y la app decide si se muestra en modal o en página.
- **Tabla:** La configuración de columnas (useUsersTableConfig, useHomeTableConfig) es específica de cada feature; el componente TableView es reutilizable y solo recibe props (columnas, filas, onPageChange, etc.).

### 5. Resultado esperado
- Lista de usuarios y formulario de alta con el mismo aspecto que en la app del compañero y datos gestionados por la feature usuarios.

---

## Paso 8: Objetivos (detalle, asignaciones, histórico, plantillas, niveles)

### 1. Objetivo
- Pantallas de objetivos (detalle de objetivo, asignación departamentos/personas, histórico, plantillas, niveles) con el diseño del compañero y nuestra feature objetivos.

### 2. Qué se va a construir o decidir
- El compañero tiene una página tipo `home/objectives/[id]/page.tsx` con ObjectiveProgress, AssignmentCard, AssignmentSection, histórico con meses, ConfirmModal para desactivar, etc. Ya vimos el contenido en el Paso 3 (moléculas de dominio).
- Migrar: AssignmentSection, FamilyObjectivesGrid, ObjetivosReducedSection, FichajeCard (si aplica), y las páginas de objetivos (plantillas, niveles, histórico, asignación). Cada pantalla debe usar nuestros hooks (useObjectiveDetail, useActivateToggle, etc.) y tipos de `shared-types` o de la feature.
- Los componentes de dominio (ObjectiveProgress, AssignmentCard, etc.) ya ubicados en la feature objetivos en el Paso 3; aquí se integran en las páginas concretas (objetivos/[id], asignacion-departamentos, etc.) y se asegura que las rutas de la app apunten a esos componentes.

### 3. Código de ejemplo
- La ruta `apps/front-biosstel/src/app/[locale]/objetivos/...` ya existe. Cada `page.tsx` importa el componente de la feature objetivos (p. ej. para detalle de objetivo, un componente `ObjectiveDetailPage` que sea el equivalente al `ObjectivesPage` del compañero). Ese componente usa:
  - useObjectiveDetail, useActivateToggle (nuestros o a crear si no existen).
  - ObjectiveProgress, AssignmentCard, AssignmentSection, Card, ConfirmModal, etc., ya en la feature con el estilo Figma.

### 4. Resolución de ambigüedades
- **Hooks del compañero (useObjectiveDetail, useActivateToggle):** Si nosotros no los tenemos, crearlos en la feature objetivos (data-access) siguiendo la misma lógica que el compañero pero llamando a nuestra API. Si ya tenemos hooks similares, adaptar los componentes a nuestra API de hooks.
- **Rutas anidadas:** Mantener la misma estructura de rutas que tenemos (objetivos/asignacion-departamentos, objetivos/plantillas, etc.) y solo cambiar el contenido visual de cada página para que coincida con el compañero.

### 5. Resultado esperado
- Todas las pantallas de objetivos (detalle, asignaciones, histórico, plantillas, niveles) se ven como en la app del compañero y usan la feature objetivos con sus boundaries.

---

## Paso 9: Fichajes, operaciones, empresa, alertas

### 1. Objetivo
- Aplicar el mismo criterio de los pasos anteriores al resto de features: fichajes, operaciones, empresa, alertas. Cada pantalla debe tener el aspecto del compañero y usar nuestra feature correspondiente (data-access, api, shell).

### 2. Qué se va a construir o decidir
- Por cada feature:
  - Listar las pantallas que tiene el compañero para ese dominio (si las tiene).
  - Listar organismos/templates que usa (p. ej. FichajeCard en fichajes, vistas de operaciones por rol, tablas en alertas).
  - Ubicar esos organismos en `libs/frontend/features/<feature>/src/pages/components/`.
  - Las páginas de la app (`apps/front-biosstel`) siguen importando desde la feature y mostrando el shell o el componente de página; el contenido visual se reemplaza por el del compañero usando nuestros datos.

### 3. Código de ejemplo
- Si el compañero no tiene una pantalla para “fichajes” o “alertas”, no hay nada que migrar para esa pantalla; solo asegurar que las que sí tenemos en nuestra app sigan usando la arquitectura y, si se desea, aplicar el mismo estilo visual (tokens, botones, cards) para coherencia.
- Si el compañero tiene una pantalla que nosotros no tenemos, añadir la ruta en la app y el componente en la feature correspondiente, copiando estructura y estilos.

### 4. Resolución de ambigüedades
- **Cobertura:** No es obligatorio que el compañero tenga todas las pantallas que nosotros; el plan es “integrar lo que él tiene” en nuestra estructura y dejar el resto como está o unificado visualmente con theme.css.

### 5. Resultado esperado
- Todas las pantallas que existen en la app del compañero están replicadas en nuestra app con nuestra arquitectura y mismo aspecto.

---

## Paso 10: Assets, i18n y dependencias

### 1. Objetivo
- Imágenes, iconos y traducciones que usa el compañero estén disponibles en nuestra app. Dependencias (Formik, react-toastify, etc.) alineadas.

### 2. Qué se va a construir o decidir
- **Assets:** Copiar `public/images` (logo, background) y `public/icons` del compañero a `apps/front-biosstel/public/`. Asegurar que las rutas en componentes (AuthLayout, Sidebar, etc.) apunten a `/images/logo.png`, `/images/background.png`, etc.
- **i18n:** Si el compañero usa las mismas claves que nosotros (p. ej. `loginPage.title`, `form.forgotPassword`), reutilizar. Si tiene claves distintas, fusionar en nuestros archivos de mensajes (p. ej. bajo `apps/front-biosstel/messages/` o donde estén) y usar las claves en los componentes migrados.
- **Dependencias:** Revisar `package.json` del compañero (Formik, yup, react-toastify, next-intl, etc.) y asegurar que nuestro monorepo las tenga donde haga falta (en la app o en la lib que las use). Evitar duplicar dependencias en varias libs; centralizar en la app si solo la app usa next-intl/Formik.

### 3. Código de ejemplo
- En AuthLayout (shared) las rutas de imagen deben ser las que use la app (p. ej. `/images/logo.png`). Si la app sirve desde `public/`, Next.js las resuelve. Verificar que en el proyecto actual existan `public/images/logo.png` y `public/images/background.png`; si no, copiarlos desde la carpeta del compañero.
- En componentes migrados, todas las cadenas visibles deben usar `useTranslations()` y claves existentes en nuestros mensajes.

### 4. Resolución de ambigüedades
- **Donde vive i18n:** En la app (next-intl); las features reciben las traducciones vía `useTranslations()` que next-intl inyecta. No mover archivos de mensajes a las libs si la app es la que configura next-intl.

### 5. Resultado esperado
- Logo, fondos e iconos visibles; textos traducidos; y dependencias coherentes sin errores de build.

---

## Resumen de mapeo rápido

| Origen (compañero)     | Destino (nuestra arquitectura) |
|------------------------|---------------------------------|
| theme.css / globals    | apps/front-biosstel/.../theme.css, globals.css |
| atoms/*                | @biosstel/ui (extender o crear) |
| molecules genéricas   | @biosstel/ui                    |
| molecules de dominio   | features/.../pages/components   |
| organisms (Sidebar, Header, etc.) | shared o ui-layout (MainAppLayout) |
| organisms de dominio   | features/.../pages/components   |
| templates (TableView, ConfirmModal) | ui o shared (genéricos) |
| templates (MainContainer auth)      | Ya tenemos MainContainer + AuthPageLayout |
| (auth) layout + login  | AuthShell + LoginForm (auth feature) |
| (main) layout          | MainAppLayout (shared) + Sidebar, Header, MobileBar |
| home, users, objectives pages | features correspondientes + app routes |

---

## Orden sugerido de implementación

1. Paso 1 (tokens y estilos).  
2. Paso 2 (átomos en ui).  
3. Paso 3 (moléculas en ui y en features).  
4. Paso 4 (MainAppLayout, Sidebar, Header, MobileBar).  
5. Paso 5 (auth).  
6. Paso 10 (assets e i18n) en paralelo o justo después de 4/5.  
7. Pasos 6, 7, 8, 9 (home, usuarios, objetivos, resto) según prioridad.

Así se minimizan los rework: primero base visual y componentes de bajo nivel, luego layout y auth, y por último cada dominio.

---

## Estado de implementación (actualizado)

- **Design tokens:** theme.css y globals.css unificados con Figma.
- **@biosstel/ui:** Card, Modal, IconButton, Loading, NumberInput, FloatingLabel, SearchInput, ConfirmModal; Button (primaryLg, cancelLg); Input (label flotante); ErrorFormMsg, InputPassword (label).
- **@biosstel/shared:** MainAppLayout, Sidebar, Header, MobileBar, NavItem; build con platform en dist.
- **App:** AppLayout con MainAppLayout en rutas no-auth; navItems en `src/constants/navItems.ts`; assets copiados de front-biosstel-developer (public/icons, public/images).
- **Auth:** LoginForm con aspecto Figma (primaryLg, label flotante); ForgotPasswordForm con onSubmit desde página.
- **Alertas:** Sin dependencia de objetivos; AlertsDashboard usa Card y tokens; layout vía MainAppLayout.
- **Objetivos:** DashboardShell sin DashboardLayout; páginas (DashboardHomePage, Niveles, Plantillas, etc.) sin DashboardLayout y con Card donde aplica; TerminalObjectivesPage sin layout duplicado.
- **Fichajes:** FichajeDashboard sin DashboardLayout de objetivos.
- **Usuarios:** add-user y add-client pasan onSubmit desde la app (client component).
- **Build:** front-biosstel build en verde.

### Rutas alineadas con la app del compañero

En `apps/front-biosstel/src/constants/paths.ts` están definidas las mismas rutas que en front-biosstel-developer:

- `HOME`, `OBJECTIVES` (/home/objectives), `PENDING_TASKS`, `REGISTER_TASKS`, `USERS`, `ADD_USER` (/add-user), `ADD_CLIENT` (/add-client), `DESIGN_SYSTEM` (/design-system).

Páginas creadas para equivalencia:

- `app/[locale]/home/register-tasks/page.tsx`
- `app/[locale]/home/pending-tasks/page.tsx`
- `app/[locale]/home/pending-tasks/[id]/page.tsx`
- `app/[locale]/home/objectives/[id]/page.tsx`
- `app/[locale]/design-system/page.tsx`

Ver **plans/GUIA_CAMBIOS_PARA_EQUIPO.md** para que el compañero vea el mapeo y cómo seguir trabajando.

### Flujos completos y datos

- **Seed (`pnpm db:seed`):** Usuarios (admin, coordinador, telemarketing, tienda, comercial, backoffice, usuario), tareas repartidas entre todos los usuarios (varias por usuario), objetivos dashboard, alertas, objetivos terminales con asignaciones, fichajes de ejemplo. Permite probar con cualquier usuario y ver tareas propias.
- **Inicio:** Carga datos de dashboard (objetivos + alertas) al entrar; card "Accesos directos" con enlaces a Tareas pendientes, Registrar tarea, Objetivos terminales, Objetivos, Fichajes.
- **Tareas:** `/home/pending-tasks` lista tareas pendientes (API); `/home/register-tasks` formulario para crear tarea (API); `/home/pending-tasks/[id]` detalle con marcar hecha/eliminar (API).
- **Placeholders (Inventario, Reportes, Back Office):** Sin doble layout; card con título, descripción y enlaces a Inicio, Tareas, Fichajes, Objetivos, etc., para que todas las rutas sean accesibles y útiles.
- **PATHS:** Añadidos `INVENTORY`, `REPORTS` en `paths.ts`.
