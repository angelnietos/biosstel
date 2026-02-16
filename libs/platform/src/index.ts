/**
 * @biosstel/platform - Platform Adapters Library
 * 
 * This library provides adapters for Next.js-specific functionality.
 * It acts as a bridge between the framework-agnostic features and Next.js.
 * 
 * This allows features to be framework-independent and easily portable
 * to other frameworks (Remix, React Router, etc.) by swapping this adapter.
 * 
 * PRINCIPLES:
 * - Contains ONLY Next.js-specific integrations
 * - Features import from here, not directly from next/*
 * - Swappable for other frameworks
 * - No business logic here
 * 
 * DEPENDENCIES:
 * - next (Next.js)
 * - react
 * 
 * EXAMPLES OF ADAPTERS:
 * - Link component (routing)
 * - useRouter hook
 * - Server components helpers
 * - next-intl integration
 * - NextAuth.js integration
 */

// Routing
export { Link, type LinkProps } from './routing';

// Re-export commonly used Next.js types if needed
// export type { ... } from 'next';
