# Project Context

## Objetivo

Backend MVP para gestionar un reto mensual de CrossFit con:

- registro y autenticación de atletas
- baseline inicial de PRs y skills
- bloqueo de baseline
- registro y validación de logros
- puntos en `points_ledger`
- ranking general
- dashboard resumido

## Stack

- Python 3.12
- FastAPI
- PostgreSQL
- SQLModel
- Alembic
- JWT
- Docker / Docker Compose

## Estructura actual

```text
app/
  main.py
  core/
  models/
  schemas/
  api/
  services/
alembic/
postman/
agents/
```

## Puntos de entrada

- API: `app/main.py`
- Router principal: `app/api/router.py`
- Configuración: `app/core/config.py`
- Sesión DB: `app/core/db.py`
- Seguridad JWT/passwords: `app/core/security.py`
- Dependencias auth/roles: `app/core/deps.py`
- Migración inicial: `alembic/versions/0001_initial_schema.py`

## Modelo funcional

- `users`: credenciales y rol (`athlete`, `coach`)
- `athletes`: perfil del atleta y estado `baseline_locked`
- `coaches`: perfil del coach
- `movement_catalog`, `skill_catalog`: catálogos base
- `athlete_baseline_prs`, `athlete_baseline_skills`: baseline inicial
- `challenges`: catálogo de retos con puntos
- `achievements`: logros enviados por atletas
- `points_ledger`: fuente de verdad para puntos y ranking

## Reglas de negocio implementadas

- El atleta completa baseline mientras no esté bloqueado.
- El baseline se bloquea con `POST /baseline/lock/{athlete_id}`.
- Solo coaches pueden:
  - bloquear baseline
  - aprobar logros
  - rechazar logros
- Los puntos se insertan solo cuando un coach aprueba un logro.
- No se permiten logros duplicados por atleta + challenge + fecha.
- El ranking se construye desde `points_ledger`.

## Flujo principal recomendado

1. Registrar atleta en `POST /auth/register`
2. Login atleta en `POST /auth/login`
3. Cargar baseline PRs y skills
4. Login coach
5. Bloquear baseline del atleta
6. Registrar logros del atleta
7. Aprobar o rechazar logros desde coach
8. Consultar ranking y dashboard

## Seeds cargados al startup

Coaches:

- `coach1@example.com` / `Coach1234!`
- `coach2@example.com` / `Coach1234!`

Movements:

- `back squat`
- `deadlift`
- `snatch`

Skills:

- `pull-ups`
- `double unders`
- `toes to bar`

Challenges:

- `Improve benchmark WOD`
- `New gymnastics skill`

## Endpoints expuestos

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### Athletes

- `GET /athletes/me`
- `PUT /athletes/me`
- `GET /athletes`

### Baseline

- `POST /baseline/prs`
- `POST /baseline/skills`
- `POST /baseline/lock/{athlete_id}`
- `GET /baseline/me`

### Achievements

- `POST /achievements`
- `GET /achievements/me`
- `GET /achievements/pending`
- `POST /achievements/{id}/approve`
- `POST /achievements/{id}/reject`

### Ranking

- `GET /ranking`

### Dashboard

- `GET /dashboard`

## Decisiones prácticas tomadas

- Un único endpoint de login para atleta y coach.
- Seed idempotente en startup para reducir pasos manuales.
- `points_ledger` incluye `source_id` para trazar el origen del puntaje.
- Se dejaron `challenges` seed para poder probar logros desde Swagger/Postman sin pasos extra.
- La colección Postman vive en `postman/CrossFit-Monthly-Challenge.postman_collection.json`.

## Ajustes útiles para próximas iteraciones

- agregar tests automáticos de integración
- exponer endpoints de catálogo (`movements`, `skills`, `challenges`) para evitar consultar IDs manualmente
- agregar paginación y filtros en listados
- registrar auditoría de aprobaciones/rechazos por coach
- endurecer validaciones de estados y enums
- agregar refresh token o expiración configurable por entorno

## Criterio de uso de este documento

Este archivo sirve como contexto operativo rápido para futuras sesiones o agentes.
No reemplaza al código, migraciones ni al `README`; si hay divergencia, la fuente de verdad es el código.
