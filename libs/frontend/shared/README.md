# @biosstel/shared

Componentes y composiciones que **varias features** reutilizan (layouts, navegación).  
**No** define primitivos de UI.

## Responsabilidad única

- **Sí:** Layouts de app (MainAppLayout, AuthLayout), navegación (Sidebar, Header, MobileBar), contenedores de página (PageContent), tipos (NavItem).
- **No:** Botones, inputs, cards, modales, iconos, chips, etc. Esos componentes viven **solo en @biosstel/ui**.

## Regla: sin duplicados de ui

- No debe existir en shared ningún componente que ya exista en ui (Button, Input, Card, Modal, IconButton, etc.).
- Todo lo presentacional se importa de `@biosstel/ui`; shared solo **compone** usando ui + ui-layout + platform.

## Dependencias permitidas

- `@biosstel/ui`
- `@biosstel/ui-layout`
- `@biosstel/platform`
- `@biosstel/shared-types`

Ver [plans/FRONTEND_BOUNDARIES.md](../../plans/FRONTEND_BOUNDARIES.md) y [plans/SOLID_REFACTOR_UI_SHARED.md](../../plans/SOLID_REFACTOR_UI_SHARED.md).
