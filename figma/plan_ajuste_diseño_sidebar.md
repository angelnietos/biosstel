# Match Figma Design for Sidebar

This plan outlines the changes needed to match the sidebar navigation with the Figma design. The current implementation uses emojis and a wider layout that differs significantly from the requested sleek, minimal design.

## Proposed Changes

### [UI Library](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/ui)

#### [NEW] [SidebarIcons.tsx](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/ui/src/components/icons/SidebarIcons.tsx)

- Implement SVG components for:
  - HomeIcon (Outline & Solid)
  - UsersIcon
  - ClockIcon
  - UserPlusIcon (Alert/Add icon)
  - ChartIcon
  - CubeIcon
  - LogoutIcon

#### [MODIFY] [index.ts](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/ui/src/index.ts)

- Export the new sidebar icons.

### [Objetivos Feature](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/features/objetivos)

#### [MODIFY] [DashboardLayout.tsx](file:///C:/Users/amuni/Desktop/babooni/libs/frontend/features/objetivos/src/pages/layouts/DashboardLayout.tsx)

- Update `navigationItems` to include the new icons.
- Update `sidebarWidth` in `SidebarLayout` call.
- Refactor the `Sidebar` navigation:
  - Add Biosstel logo at the top.
  - Match active state styling: Rounded-xl blue background for the home/active item.
  - Apply a subtle shadow matching Figma properties.
  - Position the Logout icon at the bottom of the sidebar.

## Verification Plan

### Manual Verification

- View any dashboard page (e.g., Home or Alertas) in the browser.
- Verify sidebar width is consistent with Figma.
- Verify icons are the correct outlines/solid versions.
- Verify logout icon is at the bottom.
- Verify active state styling when navigating.
