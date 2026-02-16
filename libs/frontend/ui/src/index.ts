/**
 * @biosstel/ui - Atomic UI Components Library
 * 
 * Pure UI components with no business logic, no fetch, no feature dependencies.
 * 
 * These components can be used in any React application without coupling to
 * the specific business domain or framework (Next.js).
 * 
 * PRINCIPLES:
 * - Zero business logic
 * - Zero framework dependencies (no Next.js, no routing)
 * - Zero fetch/API calls
 * - Only UI logic (display, interaction)
 * - Dependencies: only React and styling utilities
 */

// Components
export { Input, type InputProps } from './components/Input';
export { InputPassword, type InputPasswordProps } from './components/InputPassword';
export { ErrorFormMsg, type ErrorFormMsgProps } from './components/ErrorFormMsg';
export { ToastProvider, useToast, type Toast } from './components/ToastProvider';

// Icons
export type { IconProps } from './components/icons';
export { EyeIcon } from './components/icons/EyeIcon';
export { EyeOffIcon } from './components/icons/EyeOffIcon';
