# Contexto: origen del proyecto monorepo y de esta documentación

Documento interno que explica **por qué existe** esta carpeta de documentación (comparativas, informes, presentaciones) y **en qué contexto** se decidió construir la solución actual (monorepo, API REST, tipos compartidos). Sirve para que dirección y equipo técnico tengan el marco completo cuando surjan dudas sobre el cambio de arquitectura o sobre el trabajo realizado.

---

## 1. Situación inicial del proyecto Biosstel

- **Proyecto:** Aplicación interna para Biosstel (gestión de comerciales, objetivos, fichajes, etc.). Dos repositorios: front (Next.js) y API (Node/GraphQL, microservicio de auth).
- **Equipo:** Un desarrollador en front, otro incorporado para back. Plazos muy ajustados (entrega prevista en poco tiempo); diseño en Figma aún incompleto.
- **Convenciones de la empresa:** Seguir la forma de trabajar de otros proyectos (Ecolum, etc.): tecnologías unificadas (Next + Apollo/GraphQL en front, Node en back), misma estructura “por si alguien tiene que echar una mano”.
- **Encargo explícito a quien entra en back:** Centrarse en reutilización, escalabilidad y hacer las cosas bien; el back sería responsabilidad suya, con libertad para organizarlo mientras se mantuvieran tecnologías.

---

## 2. Alineación técnica entre los dos desarrolladores (conversaciones internas)

En las conversaciones de onboarding y coordinación, **ambos desarrolladores coincidieron** en varios puntos:

- **Monorepo:** Ambos veían mejor un monorepo para compartir tipos y tener front y API alineados. A uno le habían indicado seguir la estructura de otros proyectos (repos separados); el otro planteó hablar con dirección para convencerles de hacerlo bien desde el principio.
- **GraphQL:** Se cuestionó si GraphQL era necesario para este producto (un cliente, una app). Se comentó que una API REST (o NestJS) sería más adecuada. El desarrollador de front dijo que el sistema GraphQL actual no le gustaba y que “si depende de mí no te impongo nada para el back”.
- **Base de datos y stack back:** PostgreSQL de acuerdo; posibilidad de usar NestJS u otra opción que encajara mejor. El desarrollador de front indicó que a él le daba igual la tecnología del back (Nest, Express, incluso API dentro de Next) y que el back iba a ser del otro “a tu bola”.
- **Componentes y librería de UI:** Ambos vieron necesario tener componentes reutilizables (lib de UI) y no “pantallas a lo loco”. Se habló de design system, Storybook y de que las páginas usen componentes de una lib.
- **Mock server:** Se acordó usar un mock server (por ejemplo MockServer o similar) para no depender de datos aleatorios ni del back; solo cambiar la URL de entorno al conectar con la API real.
- **CI/CD, Docker, calidad:** Ambos vieron falta de CI/CD y la conveniencia de Docker y de herramientas como Sonar para evitar “merge a máster con todo” y código inmantenible.
- **Dirección y revisión:** Se comentó que no había PRs ni revisión de código y que “cada uno va a su bola”; ambos abogaban por hacer las cosas bien y por proponer mejoras a dirección.

**Resumen:** En los intercambios internos, las propuestas técnicas (monorepo, API REST en lugar de GraphQL para este caso, libs, mocks, CI) eran compartidas, y se dejó claro que el back era responsabilidad de uno con libertad de enfoque.

---

## 3. Posición de dirección en ese momento

- Dirección (vía otro miembro del equipo) transmitió que **había que mantener las tecnologías y la estructura** del resto de proyectos para unificar y por si alguien tenía que ayudar más adelante.
- Se indicó que el back sería responsabilidad del nuevo desarrollador y que **mientras mantuviera tecnologías podía hacerlo como quisiera**.
- No se aprobó formalmente un cambio a monorepo ni a REST en ese momento; se entendió que se podía proponer y “pelear” por mejoras y que el back podía organizarse con libertad.

---

## 4. Lo que luego se comunicó a dirección (y origen del conflicto)

En un momento posterior, **dirección recibió una versión distinta** de lo ocurrido:

- Que **no se había hecho nada** (o que el trabajo realizado no se reconocía).
- Que **se había cambiado todo** respecto a lo acordado.
- Que **no se estaban siguiendo las convenciones** de la empresa (tecnologías, forma de trabajar de otros proyectos).

Esa comunicación llevó a que **dirección reaccionara con malestar** hacia el desarrollador que había estado al cargo del back y que había propuesto monorepo, REST y mejoras de arquitectura.

**Contraste con el registro interno:** En las conversaciones entre los dos desarrolladores, las ideas de monorepo, REST, libs y mocks eran compartidas; se había dicho que el back era “a tu bola” y que, si preguntaran, se daría la razón a las mejoras propuestas. Por tanto, la versión que llegó a dirección no coincidía con ese alineamiento ni con el encargo de “libertad en el back manteniendo tecnologías”.

---

## 5. Por qué existe este proyecto (monorepo) y esta documentación

A raíz de ese conflicto:

1. **Proyecto actual (babooni):** Se materializó la solución que se había discutido técnicamente: monorepo con apps (front + API) y libs (features, shared-types, UI). API REST con NestJS, tipos compartidos, Docker, estructura Nx. Es decir, se llevó a la práctica lo que ambos desarrolladores habían considerado mejor y que dirección había permitido “a tu bola” en el back.

2. **Documentación en esta carpeta:** Se creó para:
   - **Objetivar** la comparación entre la solución inicial (dos repos, GraphQL no consumido por el front, contratos desalineados) y la solución actual (monorepo, REST, tipos compartidos).
   - **Justificar** las decisiones técnicas (por qué REST y no GraphQL aquí, por qué esta arquitectura, por qué no microservicios desde el primer día) con informes y presentaciones para CEO, CTO y negocio.
   - **Dejar constancia** de los problemas reales del proyecto heredado (contrato login, puertos, CORS, mocks dispersos, etc.) tras análisis del código, sin depender de versiones verbales.
   - **Dar a desarrollo** una guía clara (presentación para devs) de por qué esta arquitectura, cómo crear features y cómo escalar.

Así, **el conflicto (versión negativa comunicada a dirección vs. alineación técnica y encargo real) es el motivo por el que se ha documentado todo de forma explícita:** para que dirección y equipo puedan evaluar con hechos y documentos, no solo con relatos contradictorios.

---

## 6. Uso recomendado de este documento

- **Dirección / jefes:** Leer este contexto antes de revisar la comparativa o las presentaciones, para entender por qué existen y en qué situación se generaron.
- **Equipo técnico:** Tener claro que la documentación de esta carpeta no es “excusa”, sino respuesta a la necesidad de objetivar decisiones y trabajo realizado.
- **No es un documento acusatorio:** No se nombra a nadie para señalar culpabilidad; se describe la discrepancia entre lo comunicado a dirección y lo reflejado en las conversaciones técnicas, y se explica que de ahí surge la necesidad de esta documentación y del proyecto actual.

---

*Documento interno. Actualizar o archivar según convenga a la empresa.*
