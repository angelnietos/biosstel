# Match Figma Design for Alertas

This plan outlines the changes needed to match the Alertas dashboard with the Figma design. The current implementation uses placeholder components that don't reflect the requested layout and styling.

## Proposed Changes

### [Alertas Feature](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/features/alertas)

#### [MODIFY] [AlertsDashboard.tsx](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/features/alertas/src/pages/components/AlertsDashboard/AlertsDashboard.tsx)

- Implement the filters section with the grid of dropdowns (Marca, Fecha, Departamentos, etc.).
- Add the "Alertas" title above the table.
- Integrate the `AlertsTable` component.
- Add the "filter required" placeholder card when no filters are selected (as seen in Figma).

#### [MODIFY] [AlertsTable.tsx](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/features/alertas/src/pages/components/AlertsTable/AlertsTable.tsx)

- Update column headers to include sort icons (up/down arrows).
- Update row styling: rounded corners for badges, specific padding, and alignment.
- Implement Figma-specific color palettes for "Rol" and "Status" badges.
- Add icons for "No ha fichado" (red clock with x) and "Fichaje fuera de horario" (yellow clock).
- Add a pagination component at the bottom of the table.

## Verification Plan

### Manual Verification

- View the Alertas page in the browser (running the app locally).
- Compare the implemented layout and styles with the Figma mockup.
- Verify that the badges have the correct colors and icons.
- Verify that the filters are correctly laid out.
- Verify that the pagination and sort icons are visible.
