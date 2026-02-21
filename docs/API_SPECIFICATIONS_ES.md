# Biosstel CRM - Endpoints de la API

> Especificación de referencia (integrada desde alex/). El esquema actual puede usar rutas o modelos ligeramente distintos.

## Autenticación
- `POST /auth/login` => iniciar sesión con jwt
- `GET /auth/me` => obtener usuario actual desde el token

## Usuarios
- `GET /users` => obtener todos los usuarios con info de departamento/rol/centro de trabajo y estado de fichaje
- `POST /users` => crear usuario
- `PUT /users/:id` => actualizar usuario
- `DELETE /users/:id` => borrado lógico de usuario (set deleted_at)

## Departamentos
- `GET /departments` => obtener todos los departamentos con conteo de empleados y responsable
- `POST /departments` => crear departamento
- `PUT /departments/:id` => actualizar departamento

## Centros de Trabajo
- `GET /work-centers` => obtener todos los centros de trabajo con IDs de departamentos vinculados
- `POST /work-centers` => crear centro de trabajo
- `PUT /work-centers/:id` => actualizar centro de trabajo

## Marcas
- `GET /brands` => obtener todas las marcas
- `POST /brands` => crear marca
- `PUT /brands/:id` => actualizar marca
- `DELETE /brands/:id` => eliminar marca

## Familias
- `GET /families` => obtener todas las familias
- `POST /families` => crear familia
- `PUT /families/:id` => actualizar familia
- `DELETE /families/:id` => eliminar familia

## Subfamilias
- `GET /subfamilies` => obtener todas las subfamilias (filtro opcional por familyId)
- `POST /subfamilies` => crear subfamilia
- `PUT /subfamilies/:id` => actualizar subfamilia
- `DELETE /subfamilies/:id` => eliminar subfamilia

## Productos
- `GET /products` => obtener todos los productos (filtros opcionales: familyId, subfamilyId, brandId)
- `POST /products` => crear producto
- `PUT /products/:id` => actualizar producto
- `DELETE /products/:id` => eliminar producto

## Objetivos
- `GET /objectives` => obtener todos los objetivos con familias y datos mensuales (achieved/target)
- `GET /objectives/:id` => obtener detalle de objetivo con asignaciones de departamento/centro-trabajo/persona
- `POST /objectives` => crear objetivo
- `PUT /objectives/:id` => actualizar objetivo
- `PUT /objectives/:id/monthly-target` => actualizar meta mensual del objetivo
- `POST /objectives/:id/assignments` => crear asignación de departamento
- `PUT /objectives/assignments/:assignmentId` => actualizar meta de asignación de departamento
- `DELETE /objectives/assignments/:assignmentId` => eliminar asignación de departamento
- `POST /objectives/assignments/:deptAssignmentId/work-centers` => upsert de asignación de centro de trabajo
- `DELETE /objectives/work-center-assignments/:id` => eliminar asignación de centro de trabajo
- `POST /objectives/assignments/:deptAssignmentId/people` => upsert de asignación de persona
- `PATCH /objectives/person-assignments/:id/achieved` => actualizar valor achieved de persona
- `DELETE /objectives/person-assignments/:id` => eliminar asignación de persona

## Fichaje
- `GET /time-entries` => obtener entradas de fichaje del usuario con resumen (params: userId, date, range)
- `POST /time-entries` => crear entrada de fichaje (clock_in, clock_out, break_start, break_end)

## Tareas/Agenda
- `GET /tasks` => obtener tareas del usuario para una fecha (params: userId, date)
- `POST /tasks` => crear tarea
- `PUT /tasks/:id` => actualizar tarea
- `DELETE /tasks/:id` => eliminar tarea

---

**Notas:**
- Formato de mes: `"YYYY-M"` en JSON, almacenado como DATE (primer día del mes) en la base de datos
- Valores achieved calculados mediante vistas: `v_work_center_achieved`, `v_department_achieved`, `v_monthly_objective_achieved`
- El token JWT debe incluir: `user_id`, `role_id`, `department_id`, `work_center_id`
- Esquema alternativo de referencia: `alex/migration.sql`
