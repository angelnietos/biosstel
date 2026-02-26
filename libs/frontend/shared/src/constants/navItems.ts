import type { NavItem } from '../types/nav';
import {
  HomeIcon,
  UsersIcon,
  SidebarClockIcon,
  UserPlusIcon,
  ChartIcon,
  CubeIcon,
  CalendarIcon,
} from '@biosstel/ui';
import PATHS from './paths';

/**
 * Lista completa de ítems del sidebar (Figma).
 * AppLayout filtra por rol con canAccessPath(path, userRole); solo se muestran los permitidos.
 */
export const navItems: NavItem[] = [
  { label: 'Inicio', path: PATHS.HOME, Icon: HomeIcon },
  { label: 'Fichajes', path: PATHS.FICHAJES, Icon: SidebarClockIcon },
  { label: 'Usuario/as', path: PATHS.USERS, Icon: UsersIcon },
  { label: 'Objetivos', path: PATHS.OBJETIVOS, Icon: ChartIcon },
  { label: 'Productos', path: PATHS.PRODUCTOS, Icon: CubeIcon },
  { label: 'Resultados', path: PATHS.REPORTS, Icon: ChartIcon },
  { label: 'Alertas', path: PATHS.ALERTAS, Icon: UserPlusIcon },
  { label: 'Inventario', path: PATHS.INVENTORY, Icon: CubeIcon },
  { label: 'Empresa', path: PATHS.EMPRESA, Icon: CalendarIcon },
  { label: 'Operaciones', path: PATHS.OPERACIONES, Icon: CalendarIcon },
  { label: 'Back office', path: PATHS.BACKOFFICE, Icon: ChartIcon },
];
