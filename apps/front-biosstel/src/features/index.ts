/**
 * Features - Export all features from a single point
 * Equivale al barrel export de Nx/Angular
 */

// Auth Feature
export * from './auth'

// Users Feature
export * from './users'

// Para agregar una nueva feature:
// 1. Crear carpeta features/<feature-name>
// 2. Crear subcarpetas: shell, data-access, api, pages
// 3. Exportar todo desde index.ts
// 4. Agregar aquí el export: export * from './<feature-name>'
