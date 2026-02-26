# @biosstel/ui

Biblioteca de componentes de UI (botones, inputs, cards, iconos, etc.) para Biosstel.

## Estructura

- **`components/`** – Todos los componentes: Button, Input, Card, Modal, DepartmentBadge, PaginationDots, BasicSelect, animaciones (DivAnimFade, etc.), iconos.
- **`molecules/`** – Composiciones de negocio que usan components: ButtonPrimary, ButtonCancel, InputPassword, SearchInput, TabButton, LegendDot, etc.

Una sola capa. Sin atoms.

## Uso

Importa desde `@biosstel/ui` lo que necesites: `Button`, `Input`, `Card`, `InputPassword`, `ButtonPrimary`, `QuestionIcon`, etc. Todo se exporta desde el `index` de la lib.

## Boundaries

Lo que importa son los **boundaries entre libs**: ui (presentación), ui-layout (estructura), shared (composición), features (páginas/casos de uso). Esta lib solo exporta componentes de presentación.
