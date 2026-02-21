import type { NavItem } from '../types/nav';
import {
  HomeIcon,
  SidebarClockIcon,
  UserPlusIcon,
  CubeIcon,
  ChartIcon,
} from '@biosstel/ui';
import PATHS from './paths';

export const navItems: NavItem[] = [
  { label: 'Inicio', path: PATHS.HOME, Icon: HomeIcon },
  { label: 'Fichajes', path: PATHS.FICHAJES, Icon: SidebarClockIcon },
  { label: 'Usuarios', path: PATHS.USERS, Icon: UserPlusIcon },
  { label: 'Objetivos', path: PATHS.OBJETIVOS, Icon: CubeIcon },
  { label: 'Productos', path: PATHS.PRODUCTOS, Icon: CubeIcon },
  { label: 'Resultados', path: PATHS.OBJETIVOS_TERMINALES, Icon: ChartIcon },
];
