# Refactor SOLID: ui, ui-layout, shared

Objetivo: una sola responsabilidad por lib, sin duplicados ni responsabilidades mezcladas.

---

## Problemas actuales

### 1. **ui** – Duplicación atoms vs components
- **Button**: existe en `atoms/Button` (API: cssProps) y en `components/Button` (API: variant, className). Las molecules usan atoms/Button; la app usa components/Button.
- **Input, Card, Modal, ErrorFormMsg, Loading, FloatingLabel, IconButton, NumberInput, ClockArc, Select**: mismo patrón duplicado.
- **InputPassword**: existe en `molecules/InputPassword` (usa atoms/Input) y en `components/InputPassword` (usa components/Input). El index exporta desde molecules.
- Consecuencia: dos APIs para lo mismo, mantenimiento doble, confusión.

### 2. **shared** – UI y HTML propio
- **AuthLayout, PageContent, MainAppLayout**: usan `<main>`, `<div>`, `<section>`, `<aside>`, `<header>`, `<button>`, `<img>`, `<Link>` con clases Tailwind propias.
- **Sidebar, Header, MobileBar**: íconos SVG inline, botones crudos, Links con className. Deberían usar componentes de ui (Button, Icon, Link si existe).
- **PageContent**: mezcla PageContainer (ui-layout) con h1 y div con sombra; el título y el “card” son presentación que debería venir de ui.

### 3. **ui-layout** – Límite con shared
- **Stack, Form, PageContainer, CenteredLayout, SidebarLayout, MainContainer** están bien como “solo estructura”.
- **PageContent** está en shared pero es “página con título y contenedor”; podría ser composición en shared usando PageContainer + Heading (ui) + Card (ui).

---

## Principios SOLID aplicados

| Principio | Aplicación |
|-----------|------------|
| **S**ingle Responsibility | ui = solo presentación (botones, inputs, cards, iconos). ui-layout = solo estructura (flex, grid, contenedores). shared = solo composición de app (layouts que ensamblan ui + ui-layout). |
| **O**pen/Closed | Componentes de ui cerrados a lógica de negocio; abiertos por props (variants, className). |
| **L**iskov | Cualquier componente que sustituya a otro del mismo tipo (p. ej. Button) cumple el contrato (props, accesibilidad). |
| **I**nterface Segregation | APIs pequeñas por componente; no mezclar props de layout con props de presentación. |
| **D**ependency Inversion | Features y shared dependen de abstracciones (ui, ui-layout); no de implementaciones concretas ni de HTML/CSS propio. |

---

## Reglas por lib

### **@biosstel/ui**
- **Única responsabilidad:** Componentes de presentación (visual, accesibilidad, sin lógica de negocio).
- **Una sola implementación por concepto:** Un Button, un Input, un Card, etc. No “atom” + “component” duplicados.
- **Puede contener:** atoms (primitivos), molecules (composiciones de atoms), iconos, constantes de diseño/animación. Todo en una misma API coherente (p. ej. siempre `className` + variantes).
- **No contiene:** Estructura de página (sidebar, header de app), rutas, datos.

### **@biosstel/ui-layout**
- **Única responsabilidad:** Estructura y layout (contenedores, flex/grid, espaciado).
- **Contiene:** PageContainer, CenteredLayout, SidebarLayout, MainContainer, Stack, Form. Sin colores/iconos de negocio.
- **No contiene:** Botones, inputs, cards, iconos de app, textos de negocio.

### **@biosstel/shared**
- **Única responsabilidad:** Composiciones reutilizables por varias features (layouts de app, navegación).
- **Solo compone:** Usa únicamente componentes de @biosstel/ui y @biosstel/ui-layout (y platform para Link/router). **No define ni duplica** primitivos de ui (Button, Input, Card, etc.); esos viven solo en ui.
- **Contiene:** MainAppLayout, AuthLayout, Sidebar, Header, MobileBar, PageContent. Implementados con ui + ui-layout; sin `<button>`, `<div className="...">` propio ni SVG inline salvo que vengan de ui.
- **No debe haber** en shared carpetas o componentes como Button, Input, Card, etc.; si existen, eliminarlos y usar @biosstel/ui.

---

## Plan de refactor (orden sugerido)

### Fase 1 – Unificar ui (eliminar duplicados)
1. **Un solo Button:** Mantener `components/Button` como fuente de verdad. Hacer que `atoms/Button` re-exporte Button con `variant="raw"` y `cssProps` mapeado a `className`, para no romper molecules. Opcional: migrar molecules a usar `components/Button` con variantes y eliminar `atoms/Button`.
2. **Un solo Input:** Mantener `components/Input`. Hacer que `atoms/Input` re-exporte o delegue en él con compatibilidad de props (cssProps → className, errorInput → error).
3. **Un solo InputPassword:** Dejar una única implementación (p. ej. en molecules) que use el Input unificado; eliminar la otra.
4. Repetir el mismo criterio para Card, Modal, ErrorFormMsg, Loading, FloatingLabel, IconButton, NumberInput, ClockArc, Select: una implementación, el otro re-exporta o se elimina.

### Fase 2 – ui-layout solo estructura
1. Revisar que PageContainer, Stack, Form, CenteredLayout, SidebarLayout, MainContainer no exporten ni dependan de componentes de “presentación” de ui (salvo que sea un contenedor que opcionalmente use Card de ui).
2. Si algo en shared es “solo estructura” (p. ej. un wrapper sin diseño de marca), valorar moverlo a ui-layout.

### Fase 3 – shared solo composición
1. **AuthLayout:** Sustituir `<main>`, `<section>`, `<aside>`, `<img>` por composición con CenteredLayout/Stack (ui-layout) y componentes de ui para logo/imagen si existen, o mantener un mínimo de estructura documentado.
2. **PageContent:** Usar PageContainer (ui-layout) + un componente de título y un Card o contenedor de ui para el contenido.
3. **Sidebar, Header, MobileBar:** Sustituir `<button>`, SVG inline y `<Link className="...">` por Button, Icon (de ui) y Link envuelto por ui si hay variante, o por un NavLink de ui que reciba estilos por props.
4. **MainAppLayout:** Usar SidebarLayout (ui-layout) pasando Sidebar como slot; mantener la misma API (navItems, userName).

---

## Criterios de “hecho”
- [x] No hay dos implementaciones distintas de Button, Input, Card, etc. en ui (atoms re-exportan components).
- [x] Las molecules siguen usando la API de atoms (cssProps); la app usa components (variant/className). Una sola implementación por concepto.
- [ ] shared sin clases propias salvo las pasadas a componentes ui (en curso: Header refactorizado).
- [ ] Resto de shared (Sidebar, MobileBar, AuthLayout, PageContent) migrar a ui/ui-layout.

---

## Hecho en esta sesión
- **ui:** Button, Input, Card, ErrorFormMsg, Loading, FloatingLabel, IconButton, NumberInput tienen una sola implementación en `components/`; `atoms/` re-exporta con mapeo de props (cssProps → className, etc.). Añadido `variant="raw"` en Button para uso desde atoms. Exportados QuestionIcon y AvatarIcon desde ui.
- **shared:** Header refactorizado: usa IconButton, QuestionIcon y AvatarIcon de @biosstel/ui; sin `<button>` ni SVG inline. Añadido `@biosstel/ui` en tsconfig.build.json de shared.
- **Modal, Select, ClockArc** en atoms se mantienen por ahora (APIs distintas o lógica específica); se pueden unificar en una siguiente fase.

Referencias: [FRONTEND_BOUNDARIES.md](./FRONTEND_BOUNDARIES.md), [libs/frontend/features/README.md](../libs/frontend/features/README.md).
