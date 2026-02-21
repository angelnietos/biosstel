# Planes de ejecución – Biosstel

Carpeta que centraliza el **plan completo de ejecución** del proyecto: base de datos, API, frontend, cobertura de flujos y documentación de arquitectura, para que **no quede ningún flujo sin cubrir** y todo esté documentado.

## Documentos

| Documento | Descripción |
|-----------|-------------|
| **[ARQUITECTURA.md](./ARQUITECTURA.md)** | Arquitectura del sistema: monorepo, API (NestJS, TypeORM), Frontend (Next.js, libs), auth, roles, despliegue. |
| **[PLAN_EJECUCION_COMPLETO.md](./PLAN_EJECUCION_COMPLETO.md)** | Plan maestro de ejecución: fases, hitos, criterios de cierre, dependencias entre DB / API / Front. |
| **[PLAN_BASE_DE_DATOS.md](./PLAN_BASE_DE_DATOS.md)** | Esquemas actuales, tablas pendientes (departamentos, centros de trabajo, calendarios, horarios, permisos, documentación usuario), migraciones. |
| **[PLAN_API.md](./PLAN_API.md)** | Endpoints actuales por módulo, endpoints faltantes por flujo, contratos y autenticación. |
| **[PLAN_FRONTEND.md](./PLAN_FRONTEND.md)** | Rutas y features actuales, pantallas/modales faltantes por flujo, roles y permisos en UI. |
| **[PLAN_FLUJOS_COBERTURA.md](./PLAN_FLUJOS_COBERTURA.md)** | Matriz de cobertura: cada flujo (según Figma) vs estado en DB / API / Front (cubierto / pendiente / parcial). |
| **[PENDIENTES.md](./PENDIENTES.md)** | Listado único de ítems pendientes (API, Front, opcional) para no dejar nada sin cerrar. |

## Referencias externas

- **Flujo completo pantalla a pantalla:** [figma designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](../figma%20designs/FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md)
- **Diseños Figma por área:** [figma designs/README.md](../figma%20designs/README.md)
- **Roles y elementos por pantalla:** [apps/front-biosstel/docs/PLAN_ROLES_Y_ELEMENTOS.md](../apps/front-biosstel/docs/PLAN_ROLES_Y_ELEMENTOS.md)

## Uso

1. **Visión general:** leer ARQUITECTURA.md y PLAN_EJECUCION_COMPLETO.md.
2. **Implementar por capa:** seguir PLAN_BASE_DE_DATOS → PLAN_API → PLAN_FRONTEND en ese orden cuando haya dependencias.
3. **Comprobar que no falte nada:** usar PLAN_FLUJOS_COBERTURA.md como checklist y actualizarlo al cerrar cada flujo.
