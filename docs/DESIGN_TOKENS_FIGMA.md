# Design tokens y alineación con Figma

## Fuente de verdad

Los tokens de diseño están en **`apps/front-biosstel/src/styles/theme.css`** (dentro de `@theme { ... }`). Están pensados para coincidir con el diseño en Figma (colores de marca, tipografía, radios, sombras).

- **Colores:** `--color-primary`, `--color-brand-*`, `--color-muted`, `--color-success`, `--color-error`, etc.
- **Tipografía:** `--text-h1`, `--text-body`, `--text-sm`, etc. (fluid con clamp).
- **Radios:** `--radius-card`, `--radius-input`, `--radius-20`.
- **Sombras:** `--shadow-button`, `--shadow-card`, etc.

Los componentes en **`libs/frontend/ui`** y las páginas de las features deben usar estas variables (p. ej. `var(--color-primary)`, `var(--text-body)`) en lugar de valores hardcodeados, para que un cambio en `theme.css` se refleje en toda la app.

## Cómo usar en componentes

En clases Tailwind (cuando estén definidas en el tema) o en CSS/className con variables:

```css
.my-button {
  background: var(--color-button-primary);
  color: var(--color-white);
  border-radius: var(--radius-input);
  font-size: var(--text-body);
}
```

Si Tailwind está configurado para leer estas variables, también puedes usar utilidades como `bg-primary`, `text-muted`, etc., según cómo se mapeen en el tema.

## Checklist pantallas vs Figma

Al implementar o revisar una pantalla:

1. **Contenedores y espaciado:** Usar variables de spacing/radius del tema; si Figma usa 16px/24px, comprobar que coincidan con `theme.css` o añadir el token que falte.
2. **Tipografía:** Títulos con `--text-h1`/`--text-h2`, cuerpo con `--text-body`, secundario con `--text-sm`/`--text-muted`.
3. **Colores:** Botones primarios/secundarios y estados (hover, disabled) con los colores del tema; no usar hex sueltos salvo que se añadan como nuevo token.
4. **Estados:** Focus, error, success usando `--color-error`, `--color-success`, etc.

Si una pantalla en Figma usa un valor que no existe en `theme.css`, añadir el token en `theme.css` (y opcionalmente en el tema de Tailwind si aplica) y usarlo en el componente. Así se mantiene una única fuente de verdad y la alineación con Figma.

## Tabla pantallas ↔ Figma

Lista de rutas principales y su correspondencia con diseños en Figma (actualizar con enlaces o nombres de frame cuando se revisen).

| Ruta / pantalla | Figma (frame o link) | Revisado |
|-----------------|----------------------|----------|
| `/home` (Dashboard objetivos) | — | Pendiente |
| `/objetivos-terminales` | — | Pendiente |
| `/objetivos/plantillas` | — | Pendiente |
| `/objetivos/asignacion-departamentos` | — | Pendiente |
| `/objetivos/asignacion-personas` | — | Pendiente |
| `/objetivos/historico` | — | Pendiente |
| `/fichajes` (Control jornada) | — | Pendiente |
| `/fichajes/calendario` | — | Pendiente |
| `/fichajes/horarios` | — | Pendiente |
| `/fichajes/permisos` | — | Pendiente |
| `/alertas` | — | Pendiente |
| `/usuarios` | — | Pendiente |
| `/empresa/departamentos` | — | Pendiente |
| `/empresa/centros-trabajo` | — | Pendiente |
| `/operaciones` (Comercial, Telemarketing, Tienda, Backoffice) | — | Pendiente |
| `/productos` | — | Pendiente |
| `/inventory` | — | Pendiente |
| `/reports` | — | Pendiente |
| Login / auth | — | Pendiente |
