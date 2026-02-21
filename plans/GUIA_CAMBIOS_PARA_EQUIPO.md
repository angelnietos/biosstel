# Guía de cambios: tu trabajo integrado en el monorepo

Esta guía está pensada para que veas **qué se ha hecho con tu código**, **dónde está cada cosa** y **cómo seguir trabajando** sin que nada se pierda. Tu diseño (Figma) y tus pantallas se han mantenido; lo que hemos hecho es colocarlos en la estructura del monorepo (features, libs) para que todo el equipo use la misma base.

---

## 1. Rutas: las tuyas siguen existiendo

En tu app tenías rutas como estas. **Siguen disponibles** en este proyecto:

| Tu ruta (front-biosstel-developer) | Ruta en el monorepo | Nota |
|------------------------------------|----------------------|------|
| `/` (login)                        | `/` o `/login`       | Igual |
| `/forgot-password`                 | `/forgot-password`   | Igual |
| `/home`                            | `/home`              | Igual. Dashboard / inicio |
| `/home/objectives/[id]`            | `/home/objectives/[id]` | Detalle de objetivo |
| `/home/register-tasks`             | `/home/register-tasks`  | Registrar tareas / resultado visita |
| `/home/pending-tasks`              | `/home/pending-tasks`   | Lista tareas pendientes |
| `/home/pending-tasks/[id]`         | `/home/pending-tasks/[id]` | Detalle tarea pendiente |
| `/users`                           | `/users`             | Igual. Lista usuarios |
| `/addUser` (modal)                 | `/add-user`          | Misma pantalla, como página |
| `/addClient`                       | `/add-client`        | Igual (slug con guión) |
| `/design-system`                   | `/design-system`     | Página de diseño / componentes |

**Constante de rutas:** En el monorepo está `apps/front-biosstel/src/constants/paths.ts`. Ahí están definidas **todas** (incluidas las que tenías), por ejemplo:

- `PATHS.HOME` → `/home`
- `PATHS.OBJECTIVES` → `/home/objectives`
- `PATHS.PENDING_TASKS` → `/home/pending-tasks`
- `PATHS.REGISTER_TASKS` → `/home/register-tasks`
- `PATHS.USERS` → `/users`
- `PATHS.ADD_USER` → `/add-user`
- `PATHS.ADD_CLIENT` → `/add-client`
- `PATHS.DESIGN_SYSTEM` → `/design-system`

Puedes seguir usando `PATHS.XXX` en tus enlaces igual que en tu rama.

---

## 2. Dónde está cada cosa: tu estructura vs la del monorepo

Tú trabajabas con **átomos, moléculas, organismos y templates**. En el monorepo se usa **features + libs**. Aquí está el mapeo para que encuentres todo rápido.

### Átomos (tuyos) → `@biosstel/ui`

Todo lo que era un “átomo” está ahora en la librería **`libs/frontend/ui`** y se importa desde **`@biosstel/ui`**:

| Tu componente        | Dónde está ahora        | Cómo usar |
|----------------------|-------------------------|-----------|
| `Button`             | `@biosstel/ui` → Button | `<Button variant="primaryLg">` (variantes: primary, primaryLg, secondary, outline, cancelLg) |
| `Input`              | `@biosstel/ui` → Input  | Incluye `label` opcional (flotante). Props: `className`, `error`, `label` |
| `InputPassword`      | `@biosstel/ui` → InputPassword | Igual, con `label` si quieres |
| `Card`               | `@biosstel/ui` → Card   | `<Card className="...">` |
| `Modal`              | `@biosstel/ui` → Modal  | `open`, `onClose`, `size`, `children` |
| `ErrorFormMsg`       | `@biosstel/ui` → ErrorFormMsg | `errorMsg="..."` |
| `Select`             | `@biosstel/ui` → Select | Opciones por array |
| `IconButton`         | `@biosstel/ui` → IconButton | Botón solo icono |
| `Loading`            | `@biosstel/ui` → Loading | Spinner |
| `NumberInput`        | `@biosstel/ui` → NumberInput | `value`, `onChange(value)` |

**Import:** `import { Button, Card, Modal, Input } from '@biosstel/ui';`

### Moléculas (tuyas) → `@biosstel/ui` o features

| Tu componente        | Dónde está ahora        | Nota |
|----------------------|-------------------------|------|
| `ButtonPrimaryLg`, `ButtonCancelLg`, etc. | `@biosstel/ui` → Button | Usar `<Button variant="primaryLg">` o `variant="cancelLg"` |
| `InputPassword`      | `@biosstel/ui` → InputPassword | Ya estaba / se mantiene |
| `SearchInput`        | `@biosstel/ui` → SearchInput | Mismo uso |
| `ConfirmModal`       | `@biosstel/ui` → ConfirmModal | Modal con título, descripción, confirmar/cancelar |
| `FloatingLabel`      | `@biosstel/ui` → FloatingLabel | O usar `label` en Input |
| `ObjectiveProgress`, `AssignmentCard`, etc. | En feature **objetivos** | Se irán poniendo en `libs/frontend/features/objetivos` cuando migremos esas pantallas al 100 % |

### Organisms y templates (tuyos) → shared o features

| Tu componente        | Dónde está ahora        | Nota |
|----------------------|-------------------------|------|
| **Sidebar**          | `@biosstel/shared` → Sidebar | Parte del layout principal |
| **Header**          | `@biosstel/shared` → Header   | Idem |
| **MobileBar**        | `@biosstel/shared` → MobileBar | Barra inferior móvil |
| **MainContainer** (auth) | `@biosstel/ui-layout` → MainContainer | Para login/forgot-password |
| **LoginForm**        | Feature **auth**        | `@biosstel/auth` → LoginForm. Mismo aspecto (label flotante, primaryLg), datos con nuestro `useLogin` |
| **TableView**        | Por migrar              | Cuando se unifique la tabla, irá en `ui` o en la feature que toque |
| **UsersFilterBar**   | Feature **usuarios**    | Cuando se migre la pantalla de usuarios al detalle |

El **layout principal** (Sidebar + Header + MobileBar) lo aplica la app en **todas las rutas que no son de login**. No hace falta que cada página use un “DashboardLayout” propio: ya está envuelto en `MainAppLayout` con tus mismos elementos.

---

## 3. Design tokens (Figma)

Los colores, tipografías y sombras que tenías en **`theme.css`** están en el monorepo en:

- **`apps/front-biosstel/src/app/[locale]/theme.css`**

Ahí siguen definidos, entre otros:

- `--color-primary`, `--color-button-disabled`, `--text-datos`, `--text-h1`, `--text-h2`, etc.
- `--radius-20`, `--shadow-button`, `--color-border-input`, etc.

Las clases de Tailwind que usabas (`text-h1`, `bg-button-primary`, `rounded-20`, etc.) siguen funcionando porque la app importa ese `theme.css`.

---

## 4. Assets (imágenes e iconos)

Todo lo que tenías en **`public/`** se ha copiado al monorepo en:

- **`apps/front-biosstel/public/images/`** (logo, background)
- **`apps/front-biosstel/public/icons/`** (navbar, question, avatar, arrow-left-gray, etc.)

Las rutas en el código siguen siendo las mismas (por ejemplo `/images/logo.png`, `/icons/navbar/home.svg`).

---

## 5. Cómo seguir trabajando sin “pelear” con el código

1. **Rutas:** Usa `PATHS` de `apps/front-biosstel/src/constants/paths.ts` en los enlaces. Tus rutas (`/home/objectives/[id]`, `/home/register-tasks`, etc.) ya existen.
2. **Componentes de UI:** Importa desde `@biosstel/ui` (Button, Card, Input, Modal, SearchInput, ConfirmModal, etc.). Si echas en falta una variante (por ejemplo un botón que tenías), se puede añadir como nueva `variant` en `Button` sin tocar tu lógica.
3. **Layout:** No vuelvas a meter un layout con sidebar en cada página. La app ya envuelve todo (menos login/forgot-password) con Sidebar + Header + MobileBar. Tu página solo exporta el contenido de la pantalla.
4. **Datos (hooks, API):** En el monorepo cada “dominio” (auth, usuarios, objetivos, etc.) tiene su **feature** con `data-access` (hooks) y `api`. Si una pantalla tuya usaba un hook o un mock, al migrarla se conecta a los hooks de esa feature. Así no se duplica lógica.
5. **Design system:** La ruta **`/design-system`** existe y muestra los componentes de `@biosstel/ui` y los tokens. Úsala para comprobar que todo se ve como en Figma.

Si en tu rama tenías una pantalla que aquí aún no está al 100 % (por ejemplo register-tasks o pending-tasks con todo el detalle), la ruta ya está creada; solo hay que ir sustituyendo el contenido por el tuyo usando los componentes de `@biosstel/ui` y los hooks de la feature que corresponda.

---

## 6. Resumen rápido

- **Tus rutas** → Siguen en el monorepo; muchas iguales, otras con slug unificado (`add-user`, `add-client`). Todas en `paths.ts`.
- **Tus átomos/moléculas** → Están en **`@biosstel/ui`** (Button, Input, Card, Modal, SearchInput, ConfirmModal, etc.). Mismo aspecto, misma idea.
- **Sidebar, Header, MobileBar** → En **`@biosstel/shared`**; la app los usa en el layout principal.
- **Figma / theme** → En **`theme.css`** de la app; los tokens y clases se mantienen.
- **Imágenes e iconos** → En **`public/images`** y **`public/icons`** de la app.

Con esto puedes localizar todo lo que habías hecho y seguir desarrollando sobre la misma base, sin que tu trabajo se pierda ni se “rechace”: está integrado y documentado aquí.
