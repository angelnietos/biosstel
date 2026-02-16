import React from 'react'

/**
 * AuthShell - Contenedor principal de la feature de autenticación
 * Equivale al módulo root de Angular con su componente
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-shell">
      <header className="auth-header">
        <h1>Biosstel - Autenticación</h1>
      </header>
      <main className="auth-main">
        {children}
      </main>
    </div>
  )
}