# SOLE Fitness Frontend

Base frontend de SOLE Fitness construida con Next.js App Router, TypeScript estricto, Tailwind CSS, ESLint, Prettier y Docker.

## Instalación local

1. Entrar al proyecto:

```bash
cd frontend
```

2. Instalar dependencias:

```bash
npm install
```

3. Crear variables locales:

```bash
cp .env.example .env.local
```

4. Ejecutar en desarrollo:

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## Docker

Levantar con Docker Compose:

```bash
cd frontend
docker-compose up --build
```

La aplicación queda expuesta en:

`http://localhost:3000`

## Scripts útiles

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run typecheck`
- `npm run format`

## Estructura

```text
frontend/
  src/
    app/
    components/
    lib/
    services/
    types/
  public/
    brand/
  Dockerfile
  docker-compose.yml
  package.json
```

## Configuración de mocks

El proyecto usa una capa desacoplada de datos con repositorios y mocks.

Variable:

```env
NEXT_PUBLIC_DATA_SOURCE=mock
```

Con `mock`, las páginas consumen datos desde:

- `src/services/mocks/`
- `src/services/repository/`
- `src/services/adapters/`

## Cambio a API

Para consumir el backend real:

1. Cambiar la variable:

```env
NEXT_PUBLIC_DATA_SOURCE=api
```

2. Configurar conexión al backend:

```env
BACKEND_API_URL=http://localhost:8000
```

3. La integración actual usa:

- `src/services/api/backend.ts`
- `src/services/actions.ts`
- `src/services/auth/session.ts`
- `src/services/auth/actions.ts`
- repositorios en `src/services/repository/`

4. Mantener los tipos de `src/types/` como contrato estable entre UI y datasource.

## Integración con backend

La UI ya puede consumir el backend FastAPI existente cuando `NEXT_PUBLIC_DATA_SOURCE=api`.

Lecturas:

- leaderboard desde `/ranking`
- retos desde `/challenges`
- atletas públicos desde `/public/athletes`
- área atleta desde endpoints protegidos con sesión real
- área coach desde endpoints protegidos con sesión real

Mutaciones ya conectadas:

- actualizar perfil atleta
- guardar y bloquear baseline
- registrar logro
- aprobar o rechazar logro
- actualizar reto

Autenticación funcional:

- `/login` consume `POST /auth/login`
- `/register` consume `POST /auth/register`
- la sesión se guarda en cookies `httpOnly`
- `/athlete/**` y `/coach/**` están protegidas por rol desde layouts del App Router
- la navegación pública muestra acceso, panel y salida según la sesión activa

Si corres el frontend con Docker y el backend en tu host local, el `docker-compose.yml` ya usa por defecto:

```env
BACKEND_API_URL=http://host.docker.internal:8000
```

## Áreas disponibles

- Home pública
- Leaderboard
- Challenges
- Athletes
- Flujo Athlete
- Flujo Coach

## Consideraciones de entrega

- branding configurable desde `src/lib/config/brand.ts`
- tokens centralizados en `src/lib/config/theme.ts`
- mocks desacoplados de componentes
- estados loading, empty y error implementados
- responsive mobile-first
- autenticación real con backend vía server actions y cookies seguras
- contenedor global con padding horizontal consistente para evitar layouts pegados al borde
- build listo para conectar backend sin rehacer la UI
