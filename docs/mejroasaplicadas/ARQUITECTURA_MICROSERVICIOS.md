# Config Server, API Gateway y patrones de resiliencia — cuándo introducirlos

Este documento registra la decisión sobre **Config Server**, **API Gateway** y patrones como **Circuit Breaker** en el contexto del monorepo actual (libs + una API) y una posible **migración futura a microservicios**.

---

## Situación actual

- **Monorepo** con aplicaciones (`api-biosstel`, `front-biosstel`) y librerías por dominio (fichajes, usuarios, alertas, objetivos, etc.).
- **Una sola API** NestJS que agrupa todos los bounded contexts.
- **Un frontend** Next.js que consume esa API (directo o vía proxy).
- Las **libs** están pensadas para poder extraer dominios a servicios independientes más adelante.

---

## Decisión por componente

| Componente        | ¿Ahora? | Motivo |
|------------------|---------|--------|
| **Config Server** | **No** | Con un solo servicio bastan variables de entorno y un módulo de config en la API. Un config server centralizado aporta valor cuando hay muchas aplicaciones y entornos. |
| **API Gateway**   | **No** | El frontend ya tiene una única puerta de entrada (la API). Un gateway tiene sentido cuando existan varios servicios/dominios expuestos y se quiera unificar entrada, auth y enrutado. |
| **Circuit Breaker** | **No** (salvo excepciones) | Útil cuando hay llamadas a servicios externos inestables o entre microservicios. Con una sola API y dependencias controladas, no es prioritario; se puede valorar solo para integraciones con terceros inestables. |

---

## Cuándo sí introducirlos

### Al migrar a microservicios

1. **API Gateway**  
   - **Cuándo:** Cuando existan varios servicios (p. ej. usuarios, fichajes, alertas, reportes) desplegados por separado.  
   - **Para qué:** Punto único de entrada, autenticación/autorización, enrutado por path o dominio, límite de tasa, logging.  
   - **Opciones:** Kong, AWS API Gateway, Azure APIM, o un servicio NestJS ligero que solo enrute.

2. **Config Server**  
   - **Cuándo:** Cuando el número de aplicaciones y entornos haga incómodo gestionar env vars en cada despliegue.  
   - **Para qué:** Configuración y secretos centralizados, cambios sin redesplegar (según implementación).  
   - **Opciones:** Spring Cloud Config, Consul, HashiCorp Vault, o un microservicio mínimo de config.

3. **Circuit Breaker**  
   - **Cuándo:** En llamadas entre microservicios (servicio A → B/C) o a APIs de terceros inestables.  
   - **Para qué:** Evitar fallos en cascada, degradación controlada, reintentos y timeouts centralizados.  
   - **Opciones:** Librerías como `opossum` (Node), o integración en cliente HTTP (axios + circuit breaker). En NestJS puede encapsularse en un interceptor o en un cliente compartido.

---

## Orden recomendado al migrar

1. **API Gateway** — Primero. Define la frontera única hacia el exterior y el enrutado a los primeros servicios desacoplados.  
2. **Circuit Breaker** — Donde haya llamadas entre servicios o a terceros. Se puede introducir por servicio o por cliente HTTP.  
3. **Config Server** — Cuando la gestión de configuración por servicio/entorno sea un dolor real (muchos servicios, muchos entornos, secretos rotando).

---

## Resumen

- **Hoy:** No se implementan Config Server, API Gateway ni circuit breaker. La arquitectura actual (una API, config por env, front → API) es suficiente.
- **Preparación:** Mantener bounded contexts claros en las libs y contratos (DTOs, endpoints) estables para facilitar una futura extracción a servicios.
- **Al pasar a microservicios:** Introducir en este orden: (1) API Gateway, (2) Circuit Breaker donde proceda, (3) Config Server cuando la operación lo justifique.

Si en el futuro aparece una necesidad concreta (p. ej. un tercero muy inestable), se puede añadir **solo** un circuit breaker para esas llamadas en la API actual, sin necesidad de gateway ni config server.
