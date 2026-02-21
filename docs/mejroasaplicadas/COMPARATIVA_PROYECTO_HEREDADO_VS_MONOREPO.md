# Comparativa: Proyecto heredado vs Monorepo actual (Biosstel)

**Documento para dirección:** compara la situación anterior (dos proyectos separados) con la actual (todo en un solo repositorio) y explica por qué la versión actual es mejor para el negocio. Enfoque **objetivo**: se reconocen ventajas y desventajas de cada opción.

---

## Referencia de proyectos comparados

| Solución | Repositorios / ubicación | Descripción breve |
|----------|--------------------------|-------------------|
| **Proyecto inicial (heredado)** | `api-biosstel-main` (API), `front-biosstel-developer` (frontend). Código de referencia: p. ej. `C:\Users\amuni\Desktop\comparaciones\api-biosstel-main` y `C:\Users\amuni\Desktop\comparaciones\front-biosstel-developer`. | Dos repositorios independientes. Backend: GraphQL (Apollo) + microservicios (auth en Express). Frontend: Next.js; en la práctica llamaba a REST; puertos y rutas no alineados con el backend. Sin tipos compartidos. |
| **Solución actual (monorepo)** | Repositorio actual `babooni`: `apps/front-biosstel`, `apps/api-biosstel`, `libs/frontend/*`, `libs/backend/api-*`, `libs/shared-types`. | Un solo repositorio. Backend: NestJS, API REST única, arquitectura hexagonal por dominio. Frontend: Next.js 16, features por área, Redux, tipos compartidos con la API. Nx + pnpm. |

---

## Para el CEO — Resumen en un minuto

- **Antes:** Había **dos proyectos independientes** (interfaz de usuario y servidor) en repositorios distintos. No compartían una misma definición de datos, el servidor usaba una tecnología (GraphQL) que la interfaz **no utilizaba**, y para trabajar hacía falta clonar y mantener dos sitios.
- **Ahora:** Todo está en **un solo proyecto (monorepo)**: misma interfaz y mismo servidor, con datos y reglas definidos una sola vez y compartidos. Una única forma de desplegar, probar y documentar.
- **¿Está mejor?** **Sí.** Menos duplicación, menos riesgo de que interfaz y servidor se desincronicen, más rápido añadir nuevas funcionalidades y más fácil para el equipo trabajar y para nuevos miembros incorporarse a medio plazo.
- **Único punto a favor de antes:** Los proyectos antiguos eran más pequeños y en principio más fáciles de “entender” al primer vistazo. A cambio, eran más frágiles y difíciles de escalar.
- **Recomendación:** **Seguir con el monorepo actual.** No hay motivo para volver atrás ni para complicar la arquitectura (por ejemplo, no hemos incorporado GraphQL porque no aporta ventajas en este producto).

---

## 1. Resumen ejecutivo (tabla)

| Qué valoramos | Proyecto heredado (2 repos) | Monorepo actual | Dónde gana |
|---------------|-----------------------------|-----------------|------------|
| **Dónde está el código** | Dos repositorios separados (interfaz + servidor) | Un solo repositorio con aplicaciones y librerías reutilizables | **Actual** |
| **Cómo habla la interfaz con el servidor** | Servidor con GraphQL; la interfaz en la práctica llamaba a varios endpoints REST y no usaba GraphQL | Una sola API REST coherente; interfaz y servidor alineados | **Actual** |
| **Organización del front** | Todo mezclado en una sola app | App + módulos por área (login, usuarios, fichajes, empresa, alertas, etc.) | **Actual** |
| **Datos compartidos interfaz/servidor** | Sin paquete común; riesgo de duplicar o desalinear definiciones | Una única fuente de verdad de tipos y estructuras compartidas | **Actual** |
| **Día a día del equipo** | Dos clones, dos instalaciones, dos procesos para desarrollar | Un clon, una instalación, scripts únicos para arrancar, construir y probar | **Actual** |
| **Escalabilidad y mantenimiento** | Limitada; añadir dominios o cambios coordinados es más costoso | Alta: módulos claros, tests y CI unificados, más fácil crecer sin romper cosas | **Actual** |
| **Facilidad inicial para alguien nuevo** | Proyectos más pequeños, aparentemente más simples | Requiere entender la estructura del monorepo y de los módulos | **Heredado** |

**Conclusión:** El monorepo actual es mejor en casi todo. La única ventaja del pasado es que “se veía” más simple al principio; a medio plazo, el monorepo reduce riesgos, costes de coordinación y tiempo para sacar nuevas funciones.

---

## 2. Qué teníamos antes (proyecto heredado)

**En una frase:** Dos proyectos separados —uno para la interfaz de usuario y otro para el servidor— que no estaban bien alineados entre sí.

### Interfaz de usuario (front)

- Una sola aplicación web (Next.js) con todo el código junto.
- La interfaz **no usaba** la parte GraphQL del servidor: llamaba por REST a varios endpoints (login, usuarios, etc.) con direcciones y puertos que, además, no coincidían bien con lo que el servidor ofrecía.
- No había una definición única de datos compartida con el servidor; si el servidor cambiaba algo, la interfaz podía quedar desincronizada.

**Impacto en negocio:** Más riesgo de errores, más tiempo para mantener dos sitios y coordinar versiones, y dificultad para escalar el producto de forma ordenada.

### Servidor (API)

- Servidor con GraphQL (Apollo) y microservicios (por ejemplo, uno de autenticación) en Express.
- La parte GraphQL no era consumida por la interfaz; en la práctica la interfaz hablaba por REST. Es decir, se mantenía complejidad técnica sin beneficio para el producto.

**Impacto en negocio:** Complejidad y coste de mantenimiento innecesarios; la tecnología no aportaba valor al usuario final.

---

## 3. Qué tenemos ahora (monorepo)

**En una frase:** Un solo repositorio que contiene la interfaz, el servidor y las piezas reutilizables (módulos por área de negocio y tipos compartidos), con una única API REST y una sola forma de trabajar.

### Estructura

- **Un solo repositorio:** Interfaz (front-biosstel) y API (api-biosstel) en el mismo proyecto, más librerías compartidas.
- **Módulos por dominio:** Auth, usuarios, objetivos, fichajes, alertas, operaciones, empresa, etc., tanto en servidor como en interfaz, lo que permite crecer por funcionalidades sin mezclar todo.
- **Tipos compartidos:** Una única definición de datos compartida entre interfaz y servidor (`shared-types`), lo que reduce errores y retrabajos.
- **API REST única:** El servidor expone solo REST; se evaluó añadir GraphQL para alguna parte y se decidió no hacerlo (ver [DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md)).
- **Un solo flujo de trabajo:** Un clon, una instalación, comandos únicos para arrancar, construir, probar y desplegar.

**Impacto en negocio:** Menos duplicación, menos desalineación entre interfaz y servidor, despliegues y versiones más coherentes, y base más sólida para incorporar nuevas funciones y personas.

---

## 4. Comparativa por aspectos (con impacto en negocio)

### 4.1 Organización del código

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Interfaz** | Todo en una sola app, sin separación clara por área | App + módulos por área (login, usuarios, fichajes, empresa, alertas, etc.) | En el actual es más fácil localizar cambios, asignar tareas y evitar que un cambio rompa otras partes. |
| **Servidor** | GraphQL + microservicios; la interfaz no usaba GraphQL | Una aplicación con módulos por dominio y API REST única | Menos complejidad, menos coste de mantenimiento y menos puntos de fallo. |
| **Ganador** | — | **Actual** | Mejor organización = menos errores y más velocidad a medio plazo. |

### 4.2 Datos compartidos entre interfaz y servidor

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Definición de datos** | No había paquete común; definiciones duplicadas o distintas | Una sola fuente de verdad (`shared-types`) | Si el servidor cambia un dato, la interfaz usa la misma definición; se evitan fallos sutiles y retrabajos. |
| **Ganador** | — | **Actual** | Menos riesgo y menos tiempo de corrección. |

### 4.3 Experiencia del equipo (desarrollo y despliegue)

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Instalación y arranque** | Dos repos, dos instalaciones, varios procesos | Un repositorio, una instalación, comandos únicos | Menos tiempo perdido en configurar y en coordinar entornos. |
| **Construcción y pruebas** | Por proyecto, por separado | Comandos unificados (build, tests, lint) | Más consistencia y más fácil automatizar (CI/CD). |
| **Ganador** | — | **Actual** | Más productividad y menos fricción operativa. |

### 4.4 API: GraphQL vs REST en este proyecto

En el proyecto heredado, el servidor tenía GraphQL pero **la interfaz no lo usaba**: llamaba a varios endpoints REST. Así, GraphQL no aportaba valor y sí complejidad.

En el monorepo actual todo es REST; se revisó si alguna parte del producto (p. ej. dashboard o alertas) debería usar GraphQL y se decidió que no (documento [DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md)).

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Uso real** | Interfaz → varios REST; GraphQL sin uso | Interfaz → una API REST coherente | Menos complejidad técnica y menos superficie de mantenimiento. |
| **Ganador** | — | **Actual** | Misma capacidad de negocio con menos coste técnico. |

### 4.5 Escalabilidad y mantenimiento

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Añadir nueva funcionalidad** | Más coordinación entre dos repos; en servidor, más piezas (microservicios/subgraphs) | Nuevo módulo en backend y en front; integración en las mismas apps | Tiempo y coste menores para ampliar el producto. |
| **Tests y automatización** | Por repo, sin estándar único | Tests y CI unificados (Vitest, Playwright, Nx) | Más confianza al hacer cambios y al desplegar. |
| **Ganador** | — | **Actual** | Mejor base para crecer el producto y el equipo. |

### 4.6 Facilidad inicial para alguien nuevo

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Primera impresión** | Proyectos más pequeños, menos carpetas | Estructura de monorepo y módulos que hay que aprender | El heredado puede parecer “más fácil” al principio. |
| **Ganador** | **Heredado** | — | Ventaja solo a muy corto plazo; a medio plazo el monorepo está mejor documentado y es más predecible. |

### 4.7 Despliegue y CI/CD

| | Heredado | Actual | Por qué importa |
|--|----------|--------|-------------------|
| **Pipelines** | Dos pipelines (uno por repo) | Un pipeline que construye interfaz y servidor con dependencias claras | Una sola fuente de verdad para versiones y despliegues; menos errores de coordinación. |
| **Ganador** | — | **Actual** | Despliegues más seguros y reproducibles. |

---

## 5. Resumen: ¿Dónde gana cada uno?

| Aspecto | Gana heredado | Gana actual |
|---------|----------------|-------------|
| Estructura y organización | | ✓ |
| Datos compartidos interfaz/servidor | | ✓ |
| Un solo lugar para desarrollar y desplegar | | ✓ |
| Escalabilidad y mantenimiento | | ✓ |
| Despliegue y CI unificados | | ✓ |
| API coherente (REST, sin GraphQL sin uso) | | ✓ |
| Facilidad inicial para alguien nuevo | ✓ | |

**Conclusión:** El monorepo actual gana en todo excepto en la “simplicidad” inicial de tener dos proyectos pequeños. Esa ventaja es efímera; el monorepo es mejor para el negocio a medio y largo plazo.

---

## 6. Conclusión y recomendación

- **El monorepo actual es mejor** para organización, consistencia de datos, productividad del equipo, escalabilidad, mantenimiento y despliegue. La API es coherente (REST) y no arrastramos tecnología (GraphQL) que no se usaba.
- **El proyecto heredado** era más “simple” de entender al primer vistazo, pero con más riesgo de desincronización, más coste de coordinación y menos margen para crecer.
- **Recomendación:** **Mantener el monorepo actual** y no volver a la estructura de dos repos. Tampoco incorporar GraphQL en este producto; la decisión está documentada en [DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md).

---

## Apéndice (para quien quiera más detalle técnico)

### Sobre GraphQL en el proyecto heredado

En el heredado, el servidor exponía GraphQL pero la interfaz no lo consumía: llamaba a varios endpoints REST. Por tanto, GraphQL no aportaba ventajas (ni un único endpoint ni consultas flexibles) y sí complejidad. En el monorepo actual se ha evaluado de nuevo si alguna parte del producto debería usar GraphQL; la conclusión es no añadirlo por ahora (ver [DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md](DECISION_GRAPHQL_ARQUITECTURA_ACTUAL.md)).

### Términos en una línea (glosario rápido)

- **Monorepo:** Un solo repositorio que contiene varias aplicaciones y librerías (en nuestro caso: interfaz, API y módulos compartidos).
- **REST / API REST:** Forma estándar de que la interfaz pida y envíe datos al servidor mediante URLs y métodos (GET, POST, etc.).
- **GraphQL:** Otra forma de API donde el cliente puede pedir campos concretos en una sola petición; en nuestro caso no se usaba desde la interfaz.
- **Tipos compartidos / shared-types:** Definiciones únicas de datos (por ejemplo “Usuario”, “Alerta”) que usan tanto la interfaz como el servidor, para no duplicar y no desincronizar.
- **CI/CD:** Automatización para construir, probar y desplegar el software de forma repetible.

---

*Documento basado en la revisión del proyecto inicial (api-biosstel-main, front-biosstel-developer; código de referencia en `C:\Users\amuni\Desktop\comparaciones\`) y del monorepo actual (babooni).*