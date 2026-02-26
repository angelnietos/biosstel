# Checklist: paridad con la app del compañero (front-biosstel-developer)

Objetivo: **que nuestra app se vea y funcione igual que la del compañero; que no falte nada.**

Usar este checklist para revisar pantallas y componentes. Marcar con ✅ cuando esté igual, ⚠️ cuando sea parcial, ❌ cuando falte.

---

## 1. Layout y navegación

| Elemento | Estado | Notas |
|----------|--------|--------|
| Sidebar: logo "biosstel comunicaciones" | ✅ | `@biosstel/shared` Sidebar |
| Sidebar: items con icono + texto, activo = fondo azul | ✅ | navItems, path active |
| Sidebar: avatar "N" abajo | ✅ | |
| Header: "Servicio técnico" + icono | ✅ | Header.tsx |
| Header: "Usuario" + icono/avatar | ✅ | |
| MobileBar: iconos abajo en móvil | ✅ | MainAppLayout |
| Mismo orden nav: Inicio, Fichajes, Usuarios, Objetivos, Productos, Resultados | ✅ | navItems.ts |
| Icono Objetivos distinto de Productos | ⚠️ | Ahora ambos usan products.svg; si el compañero tiene target/diana, añadir icono |

---

## 2. Rutas y páginas (pantallas)

| Ruta compañero | Nuestra ruta | Estado | Notas |
|----------------|--------------|--------|--------|
| `/` (login) | `/[locale]/login` | ✅ | LoginForm @biosstel/auth |
| `/forgot-password` | `/[locale]/forgot-password` | ✅ | |
| `/email-send` | `/[locale]/email-send` | ✅ | EmailSendMessage |
| `/verify-account` | `/[locale]/verify-account` | ✅ | VerifyAccountMessage |
| `/home` | `/[locale]/home` | ✅ | DashboardHomePage (objetivos + alertas + accesos) |
| `/home/objectives` | redirect → `/objetivos` | ✅ | |
| `/home/objectives/[id]` | `/[locale]/home/objectives/[id]` | ✅ | TerminalObjectivesPage |
| `/home/pending-tasks` | `/[locale]/home/pending-tasks` | ✅ | Lista tareas + link registrar |
| `/home/pending-tasks/[id]` | `/[locale]/home/pending-tasks/[id]` | ✅ | Detalle tarea |
| `/home/register-tasks` | `/[locale]/home/register-tasks` | ✅ | Formulario registrar tarea |
| `/users` | `/[locale]/users` | ✅ | UsersDashboard |
| `/addUser` (modal) | `/[locale]/add-user` (+ redirect) | ✅ | WorkspaceModalShell + AddUserForm |
| `/addClient` (modal) | `/[locale]/add-client` (+ redirect) | ✅ | WorkspaceModalShell + AddClientForm |
| `/design-system` | `/[locale]/design-system` | ✅ | Botones, inputs, card, modal, tipografía |
| `/backOffice` | `/[locale]/backOffice` | ✅ | Card + enlaces |

---

## 3. Contenido por pantalla (que no falte nada)

| Pantalla | Qué debe tener (compañero) | Estado | Notas |
|----------|----------------------------|--------|--------|
| **Home** | Título "Inicio", FilterBar, grid objetivos (cards), placeholder si no filtros, tabla Alertas | ✅ | DashboardHomePage + DashboardFilters + ObjectiveCard + AlertsTable |
| **Home** | Accesos directos (tareas, registrar, objetivos, fichajes) | ✅ | Card con links |
| **Objetivos (listado)** | "Niveles de objetivos", filtros, grid de tarjetas objetivo | ✅ | Niveles.tsx con useDashboardHome + ObjectiveCard |
| **Objetivos detalle** | Volver, mes, Editar, Activar/Desactivar, Guardar, progreso, departamentos/personas, histórico | ✅ | TerminalObjectivesPage |
| **Usuarios** | Filtros, tabla, botón añadir usuario → add-user | ✅ | UsersDashboard |
| **Add user (modal)** | Formulario completo (nombre, apellidos, email, teléfono, rol, etc.), Cancelar, Crear | ✅ | AddUserForm + cancelHref |
| **Add client (modal)** | Nombre, email, teléfono, Cancelar, Crear | ✅ | AddClientForm con cancelHref + botón Cancelar |
| **Tareas pendientes** | Lista con horario/título/descripción, link a registrar | ✅ | |
| **Registrar tarea** | Formulario título, descripción, etc. | ✅ | |
| **Detalle tarea** | Marcar hecha, eliminar | ✅ | |
| **Fichajes** | FichajeCard (arco), mensaje estado, Pausar/Fichar salida, agenda tareas | ✅ | ControlJornada |
| **Design system** | Botones, inputs, card, modal, confirm, tipografía | ✅ | |

---

## 4. Componentes UI (apariencia Figma)

| Componente compañero | Nuestro | Estado |
|----------------------|---------|--------|
| Button (primaryLg, cancelLg, etc.) | Button variant | ✅ |
| Input + label flotante | Input label | ✅ |
| InputPassword | InputPassword | ✅ |
| Card | Card | ✅ |
| Modal | Modal | ✅ |
| ConfirmModal | ConfirmModal | ✅ |
| TableView (tabla con paginación) | En usuarios/alertas | ✅ |
| FilterBar / DashboardFilters | DashboardFilters | ✅ |
| ObjectiveProgress | ObjectiveProgress | ✅ |
| ObjectiveCard / FamilyObjectiveCard | ObjectiveCard | ✅ |
| ClockArc (arco fichaje) | ClockArc @biosstel/ui | ✅ |
| SearchInput | SearchInput | ✅ |
| ErrorFormMsg | ErrorFormMsg | ✅ |

---

## 5. Comportamiento y datos

| Aspecto | Estado | Notas |
|---------|--------|--------|
| getReturnPath(ADD_USER) → users, ADD_CLIENT → home | ✅ | paths.ts |
| Redirect /addUser → /add-user, /addClient → /add-client | ✅ | next.config redirects |
| Login → token, navegación a home | ✅ | |
| Add user submit → crear usuario API, volver a users | ✅ | |
| Add client submit → (TODO API cuando exista) | ⚠️ | Formulario listo, API pendiente |
| Dashboard home: datos API dashboard/home | ✅ | useDashboardHome |
| Objetivos terminales: API terminal-objectives | ✅ | (o respuesta vacía si no hay datos) |
| Tareas: API tasks | ✅ | |

---

## 6. Cosas que suelen faltar (revisar a mano)

- [ ] **Sidebar:** ¿El ancho y los paddings son iguales que en Figma?
- [ ] **Header:** ¿"Servicio técnico" e "Usuario" tienen el mismo estilo (tamaño, peso)?
- [ ] **Modal workspace:** ¿El panel add-user/add-client tiene el mismo ancho y sombra que el del compañero?
- [ ] **Home por rol:** El compañero tenía AdminHome, TiendaHome, etc. Nosotros tenemos un solo DashboardHomePage. ¿Hace falta mostrar contenido distinto por rol?
- [ ] **Traducciones:** ¿Todos los textos (form.cancel, form.isRequired, homePage.title, etc.) existen en los JSON de idiomas?
- [ ] **Design system:** ¿El compañero tiene más secciones (p. ej. tablas, chips, badges)? Añadir si hace falta.

---

## Cómo usar este checklist

1. Abre la app del compañero y nuestra app en paralelo.
2. Recorre cada ruta y compara: mismo título, mismos bloques, mismos botones.
3. Marca ✅/⚠️/❌ y anota en Notas lo que falte.
4. Corrige en código lo marcado como ⚠️ o ❌.

Si algo no se ve igual, es la referencia para no dejarse nada.
