# Resumen ejecutivo — Comparativa proyecto inicial vs monorepo actual

**Una página** para CEO, CTO y negocio. Proyectos comparados: **inicial** (`api-biosstel-main`, `front-biosstel-developer`) vs **actual** (monorepo `babooni`).

---

## Qué se compara

| | Proyecto inicial | Monorepo actual |
|---|------------------|-----------------|
| **Estructura** | Dos repositorios (front + API) | Un repositorio (apps + libs) |
| **API** | GraphQL en servidor no usado por el front; front llamaba a REST con puertos/rutas distintos | Una API REST; front y API alineados; Swagger |
| **Datos compartidos** | No había paquete común | `shared-types` única fuente de verdad |
| **Equipo** | Dos clones, dos instalaciones, dos pipelines | Un clon, una instalación, comandos únicos |
| **Escalabilidad** | Limitada; coordinación costosa | Módulos por dominio; tests y CI unificados |

---

## Conclusión objetiva

- **El monorepo actual gana** en organización, alineación front–back, tipos compartidos, operación unificada, escalabilidad y despliegue.
- **El proyecto inicial gana** solo en la “simplicidad” de tener dos proyectos pequeños a primera vista; esa ventaja es efímera.
- **Riesgos del inicial:** contrato front–back desalineado (login no conectado, endpoints inexistentes), CORS abierto, JWT sin secreto por defecto, sin tipos compartidos (ver INFORME_PROBLEMAS_PROYECTO_HEREDADO.md).

---

## Recomendación

**Mantener el monorepo actual.** No volver a dos repos ni añadir complejidad (p. ej. GraphQL) sin necesidad explícita. Decisiones documentadas en esta carpeta (GraphQL, microservicios).

---

**Documentación completa:** [COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md](COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md) · **Presentación:** [presentacion_comparativa.html](presentacion_comparativa.html)
