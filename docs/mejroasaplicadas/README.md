# Comparativa: Proyecto inicial vs Monorepo actual (Biosstel)

Documentación objetiva que compara la **solución inicial** (dos repositorios separados: front y API) con la **solución actual** (monorepo único) para apoyo a decisiones de negocio, CTO y CEO.

---

## Proyectos comparados

| Denominación | Ubicación / referencia | Descripción |
|--------------|------------------------|-------------|
| **Proyecto inicial (heredado)** | `api-biosstel-main`, `front-biosstel-developer` (repos o copias en `C:\Users\amuni\Desktop\comparaciones\`) | Frontend Next.js y API en repos separados; API con GraphQL no consumido por el front; microservicios (auth); contrato front–back desalineado. |
| **Solución actual (monorepo)** | Este repositorio (`babooni`) | Un solo repo: `apps/front-biosstel`, `apps/api-biosstel`, `libs/` (frontend features, backend api-*, shared-types). API REST única, tipos compartidos, Nx + pnpm. |

---

## Documentos en esta carpeta

| Documento | Audiencia | Contenido |
|-----------|-----------|-----------|
| **[CONTEXTO_ORIGEN_PROYECTO_Y_DOCUMENTACION.md](CONTEXTO_ORIGEN_PROYECTO_Y_DOCUMENTACION.md)** | Dirección, equipo | Contexto interno: por qué existe esta documentación y el proyecto monorepo; alineación técnica inicial, discrepancia con lo comunicado a dirección y origen del conflicto. |
| **[COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md](COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md)** | CEO, CTO, negocio, técnicos | Comparativa detallada: resumen ejecutivo, tabla por aspectos, ventajas/desventajas objetivas, conclusión y recomendación. |
| **[INFORME_PROBLEMAS_PROYECTO_HEREDADO.md](INFORME_PROBLEMAS_PROYECTO_HEREDADO.md)** | CTO, equipo técnico | Listado de problemas detectados en el proyecto inicial (front y back): contrato API, login no conectado, CORS, JWT, tipos, rutas sin implementar, etc. |
| **[DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md)** | CTO, arquitectura | Decisión de no incorporar GraphQL en el monorepo actual; justificación por feature. |
| **[ARQUITECTURA_MICROSERVICIOS.md](ARQUITECTURA_MICROSERVICIOS.md)** | CTO, arquitectura | Config Server, API Gateway, Circuit Breaker: cuándo no usarlos ahora y cuándo sí en una futura migración a microservicios. |
| **[RESUMEN_EJECUTIVO.md](RESUMEN_EJECUTIVO.md)** | CEO, CTO, negocio | Una página: tabla comparativa, conclusión objetiva y recomendación. |
| **[presentacion_comparativa.html](presentacion_comparativa.html)** | CEO, CTO, negocio | Presentación en HTML (abrir en navegador): visión general, comparativa objetiva, riesgos, métricas, recomendación. Autocontenida, imprimible. |
| **[presentacion_devs.html](presentacion_devs.html)** | Desarrollo, diseño | Presentación en HTML para devs: por qué es mejor la nueva solución, cómo crear features (libs), arquitectura agnóstica al framework, escalable para productos verticales, libs de UI para diseño. |

---

## Uso recomendado

- **Para CEO / negocio:** Leer la sección "Para el CEO" en [COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md](COMPARATIVA_PROYECTO_HEREDADO_VS_MONOREPO.md) y revisar la [presentación HTML](presentacion_comparativa.html) (secciones Resumen ejecutivo y Negocio).
- **Para CTO:** Revisar la comparativa completa, el [informe de problemas](INFORME_PROBLEMAS_PROYECTO_HEREDADO.md) y las decisiones [GraphQL](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md) y [microservicios](ARQUITECTURA_MICROSERVICIOS.md); después la presentación (sección CTO).
- **Para desarrollo y diseño:** Abrir [presentacion_devs.html](presentacion_devs.html): arquitectura, creación de features, libs de UI, flujo de trabajo.
- **Para presentaciones:** Abrir `presentacion_comparativa.html` o `presentacion_devs.html` en un navegador; se puede imprimir o exportar a PDF desde el navegador.

---

*Documentación basada en la revisión del proyecto inicial (api-biosstel-main, front-biosstel-developer) y del monorepo actual (babooni).*
