# CrossFit Monthly Challenge API

Backend MVP para gestionar un reto mensual de CrossFit con FastAPI, PostgreSQL, SQLModel, Alembic, JWT y Docker.

## Levantar el proyecto

1. Crear archivo `.env` a partir de `.env.example` si quieres personalizar variables.
2. Ejecutar:

```bash
docker-compose up --build
```

3. Abrir Swagger en `http://localhost:8000/docs`.

La app ejecuta `alembic upgrade head` al iniciar y luego carga seed inicial idempotente.

## Variables de entorno

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `DATABASE_URL`
- `JWT_SECRET_KEY`
- `JWT_ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

## Credenciales seed

Coaches creados automáticamente:

- `coach1@example.com` / `Coach1234!`
- `coach2@example.com` / `Coach1234!`

También se insertan automáticamente:

- Movements: `back squat`, `deadlift`, `snatch`
- Skills: `pull-ups`, `double unders`, `toes to bar`
- Challenges de ejemplo para poder registrar logros desde Swagger

## Endpoints disponibles

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

### Attendance

- `POST /attendance/session`
- `POST /attendance/session/{id}/checkin`
- `GET /attendance/me`

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

## Coleccion Postman

La coleccion lista para importar está en:

- `postman/CrossFit-Monthly-Challenge.postman_collection.json`

## Contexto para agentes

Se agregó una base de contexto operativo en:

- `agents/PROJECT_CONTEXT.md`
- `agents/NEXT_STEPS.md`
- `agents/DATA_DICTIONARY.md`

Úsala como resumen de arquitectura, reglas, seeds y próximos ajustes. La fuente de verdad sigue siendo el código.

Flujo recomendado en Postman:

1. Importar la colección.
2. Ejecutar `Register Athlete`.
3. Ejecutar `Login Athlete` y `Login Coach`.
4. Completar manualmente `movement_id`, `skill_id` y `challenge_id` con valores obtenidos desde Swagger o base de datos.
5. Ejecutar el resto de endpoints usando las variables guardadas automáticamente.

## Reglas implementadas

- El atleta solo puede registrar baseline mientras `baseline_locked = false`
- El baseline se bloquea explícitamente con `POST /baseline/lock/{athlete_id}`
- Solo coaches pueden aprobar/rechazar logros y registrar asistencia
- Los puntos se insertan únicamente al aprobar un logro
- No se permiten logros duplicados por atleta + challenge + fecha
- El ranking sale de `points_ledger`, no de recálculo en memoria
