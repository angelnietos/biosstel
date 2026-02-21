/**
 * @biosstel/ui - Loading
 * Atomic loading spinner. Figma-style.
 */

export interface LoadingProps {
  isHeightFit?: boolean;
  className?: string;
}

export const Loading = ({
  isHeightFit = false,
  className = '',
}: LoadingProps) => (
  <div
    className={`flex w-full items-center justify-center ${
      isHeightFit ? 'h-fit py-16' : 'h-full'
    } ${className}`}
  >
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-gray-350 border-t-primary"
      aria-hidden
    />
  </div>
);

export default Loading;
