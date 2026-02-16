/**
 * UsersShell - Contenedor principal de la feature de usuarios
 */

export default function UsersShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="users-shell">
      <header className="users-header">
        <h1>Gestión de Usuarios</h1>
      </header>
      <main className="users-main">
        {children}
      </main>
    </div>
  )
}