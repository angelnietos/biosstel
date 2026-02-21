# Figma Designs – Índice central

Carpeta que engloba **todos los diseños Figma** del proyecto y el **flujo completo pantalla a pantalla** en Markdown.

## Origen de los diseños

| Carpeta origen | Contenido |
|----------------|-----------|
| **figma/** | Sidebar, Alertas (planes de ajuste) |
| **figma2/** | Inicio (Home), Objetivos Terminales, Nuevo producto, Control de jornada, Base escritorio, App móvil |
| **figma2/figma3/** | Usuario/as: listado, filtros, Añadir Usuario, Añadir Departamento, Detalle Usuario, Documentación |
| **figma2/figma4/** | Fichaje: listados (calendarios, horarios, permisos), tabla horas, modales Crear calendario/horario/permiso; App móvil (login, dashboard) |

## Documentos en esta carpeta

| Documento | Descripción |
|-----------|-------------|
| **README.md** (este archivo) | Índice y enlaces a carpetas origen |
| **[FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](./FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md)** | Flujo completo de la aplicación, pantalla por pantalla, según Figma |

## Enlaces a documentación detallada por área

- **figma:** [plan_ajuste_diseño_sidebar.md](../figma/plan_ajuste_diseño_sidebar.md), [plan_ajuste_diseño_alertas.md](../figma/plan_ajuste_diseño_alertas.md)
- **figma2:** [README_FIGMA.md](../figma2/README_FIGMA.md) (índice Base/App, criterios, estado)
- **figma2/figma3 (Usuario/as):** [README_FIGMA.md](../figma2/figma3/README_FIGMA.md), [PLAN_FIGMA.md](../figma2/figma3/PLAN_FIGMA.md)
- **figma2/figma4 (Fichaje y App móvil):** [README_FIGMA.md](../figma2/figma4/README_FIGMA.md), [PLAN_FIGMA.md](../figma2/figma4/PLAN_FIGMA.md)

## Criterios Figma globales (resumen)

- **Títulos:** `Heading level={1}`, color #080808 (gray-900), bold
- **Cards:** p-5 shadow-sm, borde #ECEBEB (border-card), radius 12px
- **Tablas:** cabecera gris (bg-table-header), filas borde sutil, texto gray-900 / muted
- **Empty state:** texto gris + CTA
- **Fichar entrada:** arco gris/verde/rojo según estado, botón negro "Fichar entrada"
- **Modales:** títulos claros, Cancelar / acción principal (Añadir, Crear, Desactivar)

## Estado vs planes

- **Cobertura por flujo (DB / API / Front):** [planes ejecución/PLAN_FLUJOS_COBERTURA.md](../planes%20ejecucion/PLAN_FLUJOS_COBERTURA.md)
- **Pendientes prioritarios:** [planes ejecución/PENDIENTES.md](../planes%20ejecucion/PENDIENTES.md)

## Uso

1. Para ver el **flujo completo** de la app: abrir [FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md](./FLUJO_COMPLETO_PANTALLA_A_PANTALLA.md).
2. Para implementar o revisar una pantalla concreta: usar el flujo + el README/PLAN de la carpeta origen indicada en la tabla de arriba.
3. Para comprobar qué falta: consultar PLAN_FLUJOS_COBERTURA y PENDIENTES en `planes ejecucion`.
