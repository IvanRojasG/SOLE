# Next Steps

## Prioridad alta

- Exponer endpoints de catálogo para `movement_catalog`, `skill_catalog` y `challenges`.
  Motivo: hoy Postman y Swagger requieren consultar IDs manualmente.

- Agregar tests de integración para flujos críticos.
  Cobertura mínima:
  - registro y login
  - baseline y lock
  - aprobación de logros
  - inserción en `points_ledger`
  - ranking

- Reemplazar strings libres por enums en roles y estados.
  Aplicar en:
  - `users.role`
  - `achievements.status`
  - estados de baseline skills si se formalizan

## Prioridad media

- Registrar qué coach aprobó o rechazó un logro.
  Motivo: trazabilidad operativa.

- Añadir filtros y paginación a listados grandes.
  Candidatos:
  - `/athletes`
  - `/achievements/pending`
  - `/achievements/me`
  - `/ranking`

- Mejorar `dashboard` con métricas del mes actual.
  Ejemplos:
  - top 10
  - logros aprobados del mes

## Prioridad baja

- Añadir colección de environment para Postman.
- Agregar Makefile o scripts de utilidad.
- Separar settings por entorno (`dev`, `test`, `prod`).

## Riesgos técnicos actuales

- No hay suite automática de tests.
- No hay endpoints públicos de catálogos.
- Parte de las reglas dependen de validaciones a nivel aplicación además de restricciones SQL.

## Orden recomendado de ejecución

1. endpoints de catálogos
2. tests de integración
3. enums y endurecimiento de validaciones
4. trazabilidad de aprobación/rechazo
5. paginación y filtros
