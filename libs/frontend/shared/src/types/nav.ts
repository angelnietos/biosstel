/**
 * @biosstel/shared - Nav types for MainAppLayout
 */

export interface NavItem {
  path: string;
  label: string;
  /** Icon component (SVG) */
  Icon: React.ElementType;
  /** Icon when active (optional; falls back to Icon) */
  IconActive?: React.ElementType;
}
