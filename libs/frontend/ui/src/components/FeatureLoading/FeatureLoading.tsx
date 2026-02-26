/**
 * @biosstel/ui - FeatureLoading
 * Placeholder shown while a lazy-loaded feature chunk is loading.
 */

export interface FeatureLoadingProps {
  /** Optional loading label (e.g. i18n "Cargando...") */
  loadingText?: string;
  className?: string;
}

export function FeatureLoading({
  loadingText = 'Cargando...',
  className = '',
}: FeatureLoadingProps) {
  return (
    <div
      className={`flex min-h-[200px] items-center justify-center ${className}`}
      aria-label={loadingText}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
        <span className="text-sm text-gray-500">{loadingText}</span>
      </div>
    </div>
  );
}

export default FeatureLoading;
