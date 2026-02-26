/**
 * @biosstel/shared - Nav types for MainAppLayout
 */

import type { AppRole } from '@biosstel/platform';

export interface NavItem {
  path: string;
  label: string;
  /** Icon component (SVG) */
  Icon: React.ElementType;
  /** Icon when active (optional; falls back to Icon) */
  IconActive?: React.ElementType;
  /**
   * Si se define, el ítem solo se muestra para estos roles.
   * Si no se define, se usa canAccessPath(path, role) para filtrar.
   */
  requiredRoles?: AppRole[];
}
