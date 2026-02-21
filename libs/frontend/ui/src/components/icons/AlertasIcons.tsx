/**
 * @biosstel/ui - Alertas Icons
 */

import { IconProps } from './types';

export const ClockXIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 4.5V8.5L10 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.5" fill="#FEE2E2" />
    <path
      d="M10.5 10.5L13.5 13.5M13.5 10.5L10.5 13.5"
      stroke="#EF4444"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export const ClockAlertIcon = ({ className = '', size = 16 }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="8" cy="8" r="7.25" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 4.5V8.5L10 10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3.5" fill="#FEF3C7" />
    <path
      d="M12 10.5V12M12 13.5H12.01"
      stroke="#F59E0B"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);
