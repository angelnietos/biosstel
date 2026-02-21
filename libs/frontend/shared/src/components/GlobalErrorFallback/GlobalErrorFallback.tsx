'use client';

/**
 * Global error boundary fallback. Self-contained: no providers, no app imports.
 */
export function GlobalErrorFallback({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body>
        <h1>Algo ha ido mal</h1>
        <p>Ha ocurrido un error inesperado.</p>
        <button type="button" onClick={() => reset()}>
          Reintentar
        </button>
      </body>
    </html>
  );
}
