pan# Plan: pantallas y elementos por rol (Figma)

Objetivo: definir **qué pantallas** y **qué elementos** ve cada rol, e implementarlo. En Figma está claro: un **Administrador no ficha**; ve gestión (listados, calendarios, horarios). Los roles operativos (Comercial, Tienda, Telemarketing, Backoffice) sí fican y ven el reloj / Fichar entrada.

---

## 1. Roles (resumen)

| Rol            | Descripción breve |
|----------------|-------------------|
| **ADMIN**      | Acceso total a rutas permitidas; **no ficha**; gestiona usuarios, empresa, reportes, listados de fichajes. |
| **COORDINADOR**| Como admin en gestión; puede crear/editar usuarios (límite 1 día); **no ficha**; ve listados de fichajes. |
| **TELEMARKETING** | Ficha; Inicio, Fichajes (reloj + control jornada), Objetivos, Operaciones (agenda). |
| **TIENDA**     | Ficha; Inicio, Fichajes, Objetivos, Productos, Inventario, Operaciones (tienda). |
| **COMERCIAL**  | Ficha; Inicio, Fichajes, Objetivos, Operaciones (visitas). |
| **BACKOFFICE** | Ficha; Inicio, Fichajes, Operaciones (revisión), BackOffice. |

**Regla de negocio (Figma):**
- **Fichar entrada/salida (reloj)**: solo roles que tienen jornada a registrar → **COMERCIAL, TIENDA, TELEMARKETING, BACKOFFICE**.  
- **Admin y Coordinador**: no ven el bloque "Fichar entrada" en Inicio ni el reloj en Fichajes; ven **listado de fichajes** (tabla por usuario/horas) y gestión de **Calendarios / Horarios / Permisos**.

---

## 2. Permisos por ruta (ya implementado)

La configuración actual está en `libs/frontend/platform/src/config/routesPermissions.ts` y se documenta en `ROLES_AND_PERMISSIONS.md`. Resumen:

- **Inicio, Fichajes, Alertas, Configuración perfil**: todos los roles.
- **Usuario/as, Add user, Add client, Empresa, Reportes**: ADMIN, COORDINADOR.
- **Objetivos**: ADMIN, COORDINADOR, COMERCIAL, TIENDA, TELEMARKETING.
- **Productos, Inventario**: ADMIN, COORDINADOR, TIENDA.
- **Operaciones** (por subruta): según rol (Comercial visitas, Telemarketing agenda, etc.).
- **BackOffice**: ADMIN, COORDINADOR, BACKOFFICE.

No se cambia quién **accede a la ruta**; se añade **qué elementos se muestran dentro** de cada pantalla según rol.

---

## 3. Elementos por pantalla y rol (matriz)

### 3.1 Inicio (`/home`)

| Elemento | ADMIN | COORDINADOR | COMERCIAL | TIENDA | TELEMARKETING | BACKOFFICE |
|----------|-------|-------------|-----------|--------|---------------|------------|
| Título "Inicio" | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Filtros (marca, departamentos, etc.) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Bloque "Fichar entrada"** (arco + botón + enlace gestión jornada) | **✗** | **✗** | ✓ | ✓ | ✓ | ✓ |
| Cards objetivos (Producto nuevo, Terminales, etc.) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabla Alertas | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Empty state "Primero se ha de filtrar…" | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Figma:** Base-10, Base-18 (Inicio con Fichar entrada para quien fica; en flujos admin no aparece el reloj).

---

### 3.2 Fichajes (`/fichajes`, `/clock`)

| Elemento | ADMIN | COORDINADOR | COMERCIAL | TIENDA | TELEMARKETING | BACKOFFICE |
|----------|-------|-------------|-----------|--------|---------------|------------|
| **Card reloj "Fichar entrada" / Pausar / Fichar salida** (arco + botones) | **✗** | **✗** | ✓ | ✓ | ✓ | ✓ |
| Enlace "Ver gestión de jornada y tareas →" | **✗** | **✗** | ✓ | ✓ | ✓ | ✓ |
| Título "Fichaje" + Filtros + fecha | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Botones **Añadir Calendario laboral +**, **Crear horario +**, **Crear Permiso +** | ✓ | ✓ | **✗** | **✗** | **✗** | **✗** |
| Tabs: Fichajes / Listado Calendarios / Horarios / Permisos | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Tabla listado** (Usuario, Horas fichadas, %, etc.) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

**Nota:** El listado (tabla) puede verse para todos en la pestaña "Fichajes"; los botones de gestión (Añadir Calendario, Crear horario, Crear permiso) solo ADMIN y COORDINADOR (según Figma figma4: vista manager). Opcional: restringir pestañas "Calendarios / Horarios / Permisos" solo a ADMIN/COORDINADOR.

**Figma:** figma4 Base, Base-1, Base-5 (dashboard Fichaje: quien gestiona ve botones y tabs; quien solo fica ve reloj arriba y listado).

---

### 3.3 Control de jornada (`/fichajes/control-jornada`)

| Elemento | ADMIN | COORDINADOR | COMERCIAL | TIENDA | TELEMARKETING | BACKOFFICE |
|----------|-------|-------------|-----------|--------|---------------|------------|
| Página completa (reloj, agenda, objetivos) | **✗** | **✗** | ✓ | ✓ | ✓ | ✓ |

**Implementación:** Si el rol es ADMIN o COORDINADOR, redirigir a `/fichajes` o mostrar mensaje "No tienes acceso a esta vista" y enlace a Fichajes. La ruta puede seguir permitida para todos (para no romper enlaces) pero el contenido se oculta o redirige por rol.

**Figma:** Base-11, Base-15 (vista para quien ficha).

---

### 3.4 Usuario/as (`/users`, `/add-user`, etc.)

| Elemento | ADMIN | COORDINADOR | Resto |
|----------|-------|-------------|-------|
| Acceso a la ruta | ✓ | ✓ | ✗ (ya aplicado) |
| Listado, Añadir Usuario +, Añadir Punto de venta +, Añadir Departamento + | ✓ | ✓ | — |
| Modal Añadir Usuario (aviso Coordinador 1 día) | ✓ | ✓ | — |

Sin cambios de elementos; ya restringido por ruta. Figma figma3.

---

### 3.5 Objetivos (`/objetivos`, `/objetivos-terminales`, etc.)

| Elemento | ADMIN | COORDINADOR | COMERCIAL | TIENDA | TELEMARKETING |
|----------|-------|-------------|-----------|--------|---------------|
| Acceso | ✓ | ✓ | ✓ | ✓ | ✓ |
| Tabs Contratos/Puntos, asignaciones, modal Desactivar | ✓ | ✓ | ✓ | ✓ | ✓ |
| Botón "Nuevo objetivo +" / edición global | Opcional: solo ADMIN/COORDINADOR | ✓ | Según Figma | ✓ | ✓ |

Definir en Figma si "Nuevo objetivo" o edición masiva es solo admin/coordinador. Por defecto se deja acceso a todos los que tienen permiso de ruta.

---

### 3.6 Productos, Inventario, Reportes, Empresa, Operaciones, Alertas

- **Rutas:** Ya definidas en `routesPermissions.ts`.
- **Elementos:** Misma vista para todos los roles que tienen acceso; no hay subelementos por rol en la documentación Figma actual. Si más adelante Figma diferencia (p. ej. solo admin puede "Añadir producto"), se añadirá a esta matriz.

---

## 4. Resumen de reglas para implementar

1. **Quién puede fichar (reloj / Fichar entrada):**  
   `COMERCIAL`, `TIENDA`, `TELEMARKETING`, `BACKOFFICE`.  
   No: `ADMIN`, `COORDINADOR`.

2. **Dónde ocultar "Fichar entrada":**  
   - En **Inicio** (`DashboardHomePage`): no mostrar el bloque con ClockArc + botón "Fichar entrada" si el rol es ADMIN o COORDINADOR.  
   - En **Fichajes** (`FichajeDashboard`): no mostrar la card superior del reloj (Fichar entrada / Pausar / Fichar salida) si el rol es ADMIN o COORDINADOR.

3. **Control de jornada:**  
   En `/fichajes/control-jornada`, si el rol es ADMIN o COORDINADOR, redirigir a `/fichajes` o mostrar "Sin acceso" con enlace a Fichajes.

4. **Botones de gestión en Fichajes:**  
   "Añadir Calendario laboral +", "Crear horario +", "Crear Permiso +" (y opcionalmente las pestañas de listados de calendarios/horarios/permisos) solo visibles para **ADMIN** y **COORDINADOR**.

5. **Sidebar / navegación:**  
   Ya se filtra por `canAccessPath`. Opcional: para ADMIN/COORDINADOR el ítem "Fichajes" puede apuntar solo a `/fichajes` (listado) y no mostrar enlace destacado a "Control de jornada" si en Figma no lo usan.

---

## 5. Implementación técnica

### 5.1 Constantes / helpers de rol

- En `libs/frontend/platform` (o shared), definir:
  - **Roles que fican:** `ROLES_QUE_FICAN: AppRole[] = ['COMERCIAL', 'TIENDA', 'TELEMARKETING', 'BACKOFFICE']`.
  - **Roles que gestionan fichajes (calendarios, horarios, permisos):** `ROLES_GESTION_FICHAJES: AppRole[] = ['ADMIN', 'COORDINADOR']`.
- Funciones:
  - `canFichar(role?: AppRole | null): boolean` → true si role está en ROLES_QUE_FICAN.
  - `canManageFichajes(role?: AppRole | null): boolean` → true si role está en ROLES_GESTION_FICHAJES.

### 5.2 Uso en componentes

- **DashboardHomePage (Inicio):**  
  Obtener `user.role` (desde auth/context/store). Si `!canFichar(role)`, no renderizar el bloque "Fichar entrada" (Card con ClockArc + botón + enlace).

- **FichajeDashboard:**  
  - Si `!canFichar(role)`: no renderizar la Card del reloj (Fichar entrada / Pausar / Fichar salida) y el enlace "Ver gestión de jornada y tareas".  
  - Si `!canManageFichajes(role)`: no mostrar los tres botones "Añadir Calendario laboral +", "Crear horario +", "Crear Permiso +". Opcional: mostrar solo la pestaña "Fichajes" (listado) y ocultar pestañas Calendarios / Horarios / Permisos.

- **ControlJornada:**  
  Si `!canFichar(role)`, redirigir a `/fichajes` o mostrar vista "Sin permiso" con enlace a Fichajes.

### 5.3 Origen del rol

- El rol debe estar disponible en el cliente: típicamente en el usuario de sesión (JWT o endpoint /me). Verificar que `user.role` esté poblado en el store/context de auth y que se use en los componentes anteriores.

---

## 6. Referencias Figma

- **figma2/README_FIGMA.md:** Inicio (Base-10, Base-18), Control jornada (Base-11, Base-15), criterios generales.
- **figma4/README_FIGMA.md, figma4/PLAN_FIGMA.md:** Fichaje (listado vs reloj); vistas manager (calendarios, horarios, permisos).
- **figma3:** Usuario/as (solo ADMIN/COORDINADOR).

Con este plan se deja definido qué pantallas y qué elementos ve cada rol, y los pasos para implementarlo en código (constantes, helpers y condiciones en Inicio, Fichajes y Control de jornada).
