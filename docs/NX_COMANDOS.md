# Comandos Nx en el monorepo

## Generadores: evitar que se queden colgados

Los generadores de Nx pueden **quedarse esperando entrada** si se ejecutan en modo interactivo (por ejemplo desde la extensión de Nx en el IDE). Para que funcionen sin colgarse:

1. **Usar siempre `--no-interactive`** cuando ejecutes `nx generate` (o `nx g`) desde terminal o desde scripts.
2. **Indicar todas las opciones necesarias** en la línea de comandos para que no pida nada por teclado.

### Ejemplos (terminal)

```bash
# Crear una librería React (ajusta nombre y ruta)
pnpm exec nx g @nx/react:library mi-lib --directory=libs/frontend/mi-lib --no-interactive --projectNameAndRootFormat=as-provided

# Crear un componente
pnpm exec nx g @nx/react:component mi-componente --project=objetivos --no-interactive --export
```

### Scripts en package.json

En la raíz del repo hay scripts de ayuda que ya usan `--no-interactive`:

- `pnpm nx:gen:list` — Lista generadores disponibles (para ver opciones).
- Ver más abajo cómo añadir scripts concretos si los necesitas.

### Si usas la extensión Nx / Angular Console en el IDE

Si al lanzar un generador desde la UI se queda “Running…” sin avanzar, suele ser porque el generador está esperando respuestas interactivas. En ese caso:

- **Cancela** la ejecución desde la UI.
- Abre una **terminal** en la raíz del proyecto y ejecuta el mismo generador con `--no-interactive` y las opciones necesarias (nombre, proyecto, ruta, etc.), como en los ejemplos de arriba.

## Comandos útiles (sin generadores)

| Comando | Descripción |
|---------|-------------|
| `pnpm exec nx run front-biosstel:build` | Build del frontend |
| `pnpm exec nx run api-biosstel:build` | Build de la API |
| `pnpm exec nx run-many -t build -p front-biosstel,api-biosstel` | Build de varios proyectos |
| `pnpm exec nx graph` | Grafo de dependencias |
| `pnpm exec nx show project front-biosstel` | Detalle del proyecto |
| `pnpm exec nx g @nx/react:library --help` | Ver opciones de un generador |

## Variables de entorno

- **CI / NX_DAEMON:** En entornos CI suele estar `CI=true`; Nx puede desactivar la daemon y asumir no-interactivo. Si en local quieres el mismo comportamiento, puedes usar `NX_DAEMON=false` o ejecutar los generadores con `--no-interactive` explícitamente.
