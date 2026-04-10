# Frontend Backend API Integration

## Objetivo

Documentar cómo el frontend de `frontend/` consume el backend FastAPI del proyecto raíz cuando el datasource cambia de `mock` a `api`.

## Modo de operación

Variable principal:

```env
NEXT_PUBLIC_DATA_SOURCE=mock | api
```

- `mock`: usa repositorios sobre `src/services/mocks/`
- `api`: usa repositorios y acciones conectadas al backend real

## Variables necesarias

Para desarrollo local del frontend:

```env
BACKEND_API_URL=http://localhost:8000
```

Para Docker del frontend:

```env
BACKEND_API_URL=http://host.docker.internal:8000
```

## Archivos clave

### Frontend

- `frontend/src/services/api/backend.ts`
  Propósito: cliente servidor para fetch al backend y login real contra `/auth/login`.

- `frontend/src/services/auth/session.ts`
  Propósito: persistir sesión en cookies `httpOnly` y proteger rutas por rol.

- `frontend/src/services/auth/actions.ts`
  Propósito: login, registro y logout mediante server actions.

- `frontend/src/services/actions.ts`
  Propósito: mutaciones del frontend usando acciones del servidor de Next.

- `frontend/src/services/repository/`
  Propósito: lecturas desacopladas por datasource.

### Backend

- `app/api/routes/challenges.py`
- `app/api/routes/catalogs.py`
- `app/api/routes/public.py`
- `app/api/routes/baseline.py`
- `app/api/routes/attendance.py`
- `app/api/routes/achievements.py`

## Endpoints usados por el frontend

### Públicos

- `GET /ranking`
- `GET /challenges`
- `GET /public/athletes`

### Athlete

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /athletes/me`
- `PUT /athletes/me`
- `GET /baseline/me/detailed`
- `POST /baseline/prs`
- `PUT /baseline/prs/{id}`
- `POST /baseline/skills`
- `PUT /baseline/skills/{id}`
- `POST /baseline/lock/me`
- `GET /achievements/me/detailed`
- `POST /achievements`
- `GET /attendance/me/detailed`

### Coach

- `POST /auth/login`
- `GET /dashboard`
- `GET /athletes`
- `GET /attendance/sessions`
- `POST /attendance/session`
- `POST /attendance/session/{id}/checkin`
- `GET /achievements/pending/detailed`
- `POST /achievements/{id}/approve`
- `POST /achievements/{id}/reject`
- `PUT /challenges/{id}`

## Decisiones técnicas

- No se exponen credenciales técnicas por rol.
- El usuario inicia sesión con su propio correo y contraseña contra el backend real.
- La sesión queda en cookies `httpOnly` y el servidor de Next adjunta el bearer token al llamar FastAPI.
- Las mutaciones usan server actions de Next.
- El backend se amplió con respuestas enriquecidas para evitar composición frágil en cliente.
- Las rutas `/athlete/**` y `/coach/**` se protegen desde layouts del App Router.
- El `AppContainer` ahora aplica padding horizontal consistente para evitar pantallas pegadas a los bordes.

## Limitaciones actuales

- El perfil extendido del atleta sigue teniendo campos de presentación que aún no existen en base de datos.
- El editor de retos persiste `title` y `points`; `isActive` sigue siendo visual.
- El dashboard atleta y coach combina varios endpoints en frontend para formar vistas completas.

## Orden recomendado para probar integración

1. Levantar backend en `http://localhost:8000`
2. Configurar `frontend/.env.local` con `NEXT_PUBLIC_DATA_SOURCE=api`
3. Levantar frontend
4. Probar autenticación:
   - `/register`
   - `/login`
5. Probar vistas:
   - `/leaderboard`
   - `/challenges`
   - `/athletes`
6. Probar vistas protegidas:
   - `/athlete` con sesión de atleta
   - `/coach` con sesión de coach

## Fuente de verdad

Si hay discrepancias entre este documento y el código, la fuente de verdad es:

- backend: `app/`
- frontend: `frontend/src/`
