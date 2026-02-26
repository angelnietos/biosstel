# Vistas del compañero (front-biosstel-developer) → Nueva app

Todas las pantallas de la rama del compañero están disponibles en la nueva app. Esta es la correspondencia.

**Para que no falte nada:** usar **`CHECKLIST_PARIDAD_COMPANERO.md`** en esta misma carpeta: lista cada pantalla, componente y comportamiento con estado (✅/⚠️/❌). Revisar en paralelo con la app del compañero y corregir lo que marque como parcial o faltante.

## Rutas

| Vista compañero | Ruta compañero | En la nueva app | Página / componente |
|-----------------|----------------|-----------------|---------------------|
| Login | `/` (auth) | `/[locale]/login` | `(auth)/login/page.tsx` → LoginForm (@biosstel/auth) |
| Recuperar contraseña | `/forgot-password` | `/[locale]/forgot-password` | `(auth)/forgot-password/page.tsx` |
| Inicio / Home | `/home` | `/[locale]/home` | `home/page.tsx` → DashboardHomePage (objetivos + alertas + accesos) |
| Objetivos (detalle) | `/home/objectives/[id]` | `/[locale]/home/objectives/[id]` | TerminalObjectivesPage (@biosstel/objetivos) |
| Listado objetivos | `/home/objectives` | `/[locale]/home/objectives` → redirect | Redirige a `/objetivos` |
| Tareas pendientes | `/home/pending-tasks` | `/[locale]/home/pending-tasks` | Lista tareas + link a registrar |
| Detalle tarea | `/home/pending-tasks/[id]` | `/[locale]/home/pending-tasks/[id]` | Detalle, marcar hecha, eliminar |
| Registrar tareas | `/home/register-tasks` | `/[locale]/home/register-tasks` | Formulario registrar tarea |
| Usuarios | `/users` | `/[locale]/users` | UsersDashboard (@biosstel/usuarios) |
| Añadir usuario | `/addUser` (modal) | `/[locale]/add-user` (+ redirect `/addUser`) | AddUserForm; **se muestra como modal** (overlay + panel centrado, Volver/cerrar) |
| Añadir cliente | `/addClient` (modal) | `/[locale]/add-client` (+ redirect `/addClient`) | AddClientForm; **se muestra como modal** (overlay + panel centrado, Volver/cerrar) |
| Design system | `/design-system` | `/[locale]/design-system` | design-system/page.tsx |

## Rutas adicionales en la nueva app (monorepo)

- **Fichajes:** `/[locale]/fichajes` → Control de jornada (ClockArc, Pausar/Fichar salida, Agenda con horarios).
- **Objetivos:** `/[locale]/objetivos` y subrutas (niveles, plantillas, asignación, histórico).
- **Resultados:** `/[locale]/resultados` → redirige a objetivos-terminales; `/[locale]/objetivos-terminales`.
- **Productos:** `/[locale]/productos` → placeholder + link a inventario.
- **Empresa:** centros de trabajo, departamentos, cuentas contables.
- **Alertas:** `/[locale]/alertas` y subrutas.
- **Operaciones:** backoffice, telemarketing, tienda, comercial.
- **Configuración perfil:** `/[locale]/configuracion-perfil`.
- **Usuario detalle:** `/[locale]/users/[id]` y documentación.

## Componentes / bloques del compañero integrados

- **FichajeCard + ClockArc:** En `/fichajes` (ControlJornada): arco semicircular, mensaje "Ficho bien dentro de su horario", Pausar jornada / Fichar salida.
- **Agenda (tareas pendientes):** En `/fichajes` y en `/home/pending-tasks`: franja horaria, título, descripción.
- **getReturnPath:** En `paths.ts`; usado en add-user (cancelar/vuelta a users).
- **Nav:** Inicio, Fichajes, Usuarios, Objetivos, Productos, Resultados (sidebar único Figma).

## Páginas tipo modal (workspace)

Las rutas **Añadir usuario** y **Añadir cliente** se muestran como pantallas tipo modal (como en front-biosstel-developer con `(workSpace)/(modals)`):

- **Layout:** `(admin)/layout.tsx` detecta `/add-user` y `/add-client` y envuelve el contenido en `WorkspaceModalShell`.
- **Aspecto:** fondo oscuro (backdrop), panel centrado con el formulario, enlace «Volver a usuarios» / «Volver al inicio» y botón cerrar (X). Clic en el fondo cierra y vuelve.
- **Componente:** `_components/WorkspaceModalShell.tsx` (bloqueo de scroll del body mientras está abierto).

## Auth adicional (compañero + monorepo)

- **Email enviado:** `/[locale]/email-send` → mensaje de correo enviado (recuperar contraseña).
- **Verificar cuenta:** `/[locale]/verify-account` → verificación con token (query `token`).
- **Registro salida:** `/[locale]/registro-salida`.

## API y Swagger

- **Documentación:** todos los endpoints están en **Swagger**: `http://localhost:4000/api/docs`.
- **Resumen de endpoints:** `docs/API_ENDPOINTS.md` (auth, users, fichajes, tasks, dashboard, alertas, operaciones, empresa, health, metrics).
- **Auth:** `POST /api/v1/auth/login`, `GET /api/v1/auth/me` (Bearer token), `POST /api/v1/auth/forgot-password`.

## Error 500 en consola

Si ves `[API Error] 500 ...` en consola, desde el cambio reciente también se muestra la **URL** de la petición que ha fallado. Revisa qué endpoint devuelve 500 (por ejemplo `.../api/v1/users`, `.../api/v1/fichajes/...`) y revisa logs del backend o ese controlador para corregir el error.
