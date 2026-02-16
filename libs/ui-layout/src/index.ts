/**
 * @biosstel/ui-layout - Visual Layout Components Library
 * 
 * Generic layout components that provide visual structure.
 * Does NOT know about business domain (admin, users, etc.)
 * 
 * PRINCIPLES:
 * - Zero business logic
 * - Zero feature-specific knowledge
 * - Only structural/layout logic
 * - Dependencies: only React
 * - Can use @biosstel/ui components
 */

// Layout Components
export { PageContainer, type PageContainerProps } from './components/PageContainer';
export { CenteredLayout, type CenteredLayoutProps } from './components/CenteredLayout';
export { SidebarLayout, type SidebarLayoutProps } from './components/SidebarLayout';
export { MainContainer, type MainContainerProps } from './components/MainContainer';
