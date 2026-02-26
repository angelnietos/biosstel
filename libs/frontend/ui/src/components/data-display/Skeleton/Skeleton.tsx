/**
 * @biosstel/ui - Skeleton
 * Placeholder while content loads. No custom HTML in features.
 */

export interface SkeletonProps {
  className?: string;
  /** Approximate height (Tailwind class or default h-4). */
  height?: 'sm' | 'md' | 'lg';
}

const heightMap = { sm: 'h-4', md: 'h-6', lg: 'h-8' } as const;

export const Skeleton = ({ className = '', height = 'sm' }: SkeletonProps) => (
  <div
    className={`bg-gray-100 rounded animate-pulse ${heightMap[height]} ${className}`.trim()}
    aria-hidden
  />
);

export default Skeleton;
