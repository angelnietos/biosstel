# Documentación de arquitectura

Planes y descripción de la arquitectura del monorepo, alineados con la estructura actual.

| Documento                                                | Contenido                                                                                                                |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [HEXAGONAL_ARCHITECTURE.md](./HEXAGONAL_ARCHITECTURE.md) | Backend: capas hexagonal (application + infrastructure), módulos actuales, flujo de datos, cómo añadir una feature.      |
| [arquitectura-api.md](./arquitectura-api.md)             | Backend: visión general, lista de libs `api-*`, capas por feature, estado actual.                                        |
| [arquitectura-front.md](./arquitectura-front.md)         | Frontend: principios, estructura de la app y de `libs/frontend`, capas por feature, lista de las 7 features.             |
| [FRONTEND_BOUNDARIES.md](./FRONTEND_BOUNDARIES.md)       | Frontend: boundaries estrictos (ui → ui-layout → shared); qué puede importar cada lib y responsabilidades.               |

El README principal del repo en la raíz enlaza a estos documentos en la sección de documentación adicional.
