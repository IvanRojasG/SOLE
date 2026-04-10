# Data Dictionary

## Alcance

Este diccionario de datos está basado en la estructura actualmente implementada en:

- `alembic/versions/0001_initial_schema.py`
- `app/models/all_models.py`

La fuente de verdad sigue siendo la migración y el código.

## Tabla `users`

**Descripción resumida**

Almacena las credenciales de acceso y datos base de autenticación para atletas y coaches.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del usuario. Es la clave primaria del registro. |
| `email` | `VARCHAR(120)` | Correo electrónico único usado para autenticación. |
| `password_hash` | `VARCHAR(255)` | Hash de la contraseña del usuario, nunca la contraseña en texto plano. |
| `role` | `VARCHAR(20)` | Rol funcional del usuario dentro del sistema. Valores esperados: `athlete` o `coach`. |
| `is_active` | `BOOLEAN` | Indica si la cuenta está habilitada para autenticarse y usar la API. |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del usuario. |

## Tabla `athletes`

**Descripción resumida**

Guarda el perfil de negocio del atleta, separado de las credenciales del usuario.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del atleta. Clave primaria. |
| `user_id` | `UUID` | Referencia única al usuario autenticable asociado en `users`. |
| `full_name` | `VARCHAR(150)` | Nombre completo visible del atleta. |
| `level` | `VARCHAR(20)` | Nivel deportivo del atleta dentro del box o reto. |
| `baseline_locked` | `BOOLEAN` | Indica si el baseline ya fue bloqueado y dejó de admitir cambios. |
| `created_at` | `TIMESTAMP` | Fecha y hora de creación del perfil del atleta. |

## Tabla `coaches`

**Descripción resumida**

Guarda el perfil de negocio de los coaches que validan logros y registran asistencia.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del coach. Clave primaria. |
| `user_id` | `UUID` | Referencia única al usuario autenticable asociado en `users`. |
| `full_name` | `VARCHAR(150)` | Nombre completo del coach. |

## Tabla `movement_catalog`

**Descripción resumida**

Catálogo maestro de movimientos usados para registrar PRs del baseline.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del movimiento. |
| `name` | `VARCHAR(80)` | Nombre único del movimiento, por ejemplo `back squat` o `snatch`. |

## Tabla `skill_catalog`

**Descripción resumida**

Catálogo maestro de skills usados para registrar el baseline técnico del atleta.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único de la skill. |
| `name` | `VARCHAR(80)` | Nombre único de la skill, por ejemplo `pull-ups` o `toes to bar`. |

## Tabla `athlete_baseline_prs`

**Descripción resumida**

Guarda los PRs iniciales declarados por un atleta dentro de su baseline.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del registro de PR. |
| `athlete_id` | `UUID` | Referencia al atleta dueño del baseline. |
| `movement_id` | `UUID` | Referencia al movimiento del catálogo al que aplica el PR. |
| `weight` | `NUMERIC` | Peso registrado como marca personal inicial para ese movimiento. |

**Restricción relevante**

- Un atleta solo puede tener un PR baseline por movimiento: `UNIQUE (athlete_id, movement_id)`.

## Tabla `athlete_baseline_skills`

**Descripción resumida**

Guarda el estado inicial de skills del atleta dentro de su baseline.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del registro de skill baseline. |
| `athlete_id` | `UUID` | Referencia al atleta dueño del baseline. |
| `skill_id` | `UUID` | Referencia a la skill del catálogo. |
| `status` | `VARCHAR(20)` | Estado declarado del atleta respecto a esa skill. Ejemplo actual: `can_do`. |

**Restricción relevante**

- Un atleta solo puede tener una entrada baseline por skill: `UNIQUE (athlete_id, skill_id)`.

## Tabla `attendance_sessions`

**Descripción resumida**

Representa una sesión de asistencia creada por un coach para una fecha determinada.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único de la sesión de asistencia. |
| `session_date` | `DATE` | Fecha de la sesión registrada. |
| `coach_id` | `UUID` | Coach responsable que creó o controla la sesión. |

**Restricción relevante**

- Un mismo coach no puede crear dos sesiones para la misma fecha: `UNIQUE (session_date, coach_id)`.

## Tabla `attendance_records`

**Descripción resumida**

Registra qué atletas asistieron a una sesión específica.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del check-in de asistencia. |
| `session_id` | `UUID` | Referencia a la sesión de asistencia. |
| `athlete_id` | `UUID` | Referencia al atleta marcado como asistente. |

**Restricción relevante**

- Un atleta no puede ser registrado dos veces en la misma sesión: `UNIQUE (session_id, athlete_id)`.

## Tabla `challenges`

**Descripción resumida**

Catálogo de retos o logros posibles que pueden otorgar puntos al ser aprobados.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del reto. |
| `title` | `VARCHAR(120)` | Nombre o título único del reto. |
| `points` | `INTEGER` | Cantidad de puntos que otorga el reto al aprobarse. |

## Tabla `achievements`

**Descripción resumida**

Registra los logros enviados por atletas para su validación posterior por parte de un coach.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del logro enviado. |
| `athlete_id` | `UUID` | Referencia al atleta que reporta el logro. |
| `challenge_id` | `UUID` | Referencia al reto que el atleta afirma haber cumplido. |
| `achievement_date` | `DATE` | Fecha en que el logro ocurrió o fue alcanzado. |
| `status` | `VARCHAR(20)` | Estado del logro. Valores usados actualmente: `submitted`, `approved`, `rejected`. |
| `created_at` | `TIMESTAMP` | Fecha y hora en que el logro fue registrado en el sistema. |

**Restricción relevante**

- No se permiten duplicados por atleta + reto + fecha: `UNIQUE (athlete_id, challenge_id, achievement_date)`.

## Tabla `points_ledger`

**Descripción resumida**

Libro mayor de puntos del sistema. Es la fuente de verdad para el ranking general.

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID` | Identificador único del asiento de puntos. |
| `athlete_id` | `UUID` | Referencia al atleta que recibe los puntos. |
| `source_type` | `VARCHAR(30)` | Tipo de origen del puntaje. En la implementación actual se usa `achievement`. |
| `source_id` | `UUID` | Identificador opcional del registro origen que generó los puntos, por ejemplo un `achievement`. |
| `points` | `INTEGER` | Cantidad de puntos abonados al atleta. |
| `created_at` | `TIMESTAMP` | Fecha y hora en que se insertó el movimiento de puntos. |

## Relaciones principales

| Origen | Destino | Tipo de relación | Descripción |
|---|---|---|---|
| `users.id` | `athletes.user_id` | 1 a 1 | Un usuario atleta tiene un solo perfil de atleta. |
| `users.id` | `coaches.user_id` | 1 a 1 | Un usuario coach tiene un solo perfil de coach. |
| `athletes.id` | `athlete_baseline_prs.athlete_id` | 1 a N | Un atleta puede registrar varios PRs baseline. |
| `athletes.id` | `athlete_baseline_skills.athlete_id` | 1 a N | Un atleta puede registrar varias skills baseline. |
| `movement_catalog.id` | `athlete_baseline_prs.movement_id` | 1 a N | Un movimiento puede ser usado por muchos atletas. |
| `skill_catalog.id` | `athlete_baseline_skills.skill_id` | 1 a N | Una skill puede ser usada por muchos atletas. |
| `coaches.id` | `attendance_sessions.coach_id` | 1 a N | Un coach puede crear varias sesiones. |
| `attendance_sessions.id` | `attendance_records.session_id` | 1 a N | Una sesión puede tener muchos registros de asistencia. |
| `athletes.id` | `attendance_records.athlete_id` | 1 a N | Un atleta puede asistir a varias sesiones. |
| `challenges.id` | `achievements.challenge_id` | 1 a N | Un reto puede ser reportado por varios atletas. |
| `athletes.id` | `achievements.athlete_id` | 1 a N | Un atleta puede registrar varios logros. |
| `athletes.id` | `points_ledger.athlete_id` | 1 a N | Un atleta puede tener múltiples movimientos de puntos. |

## Observaciones funcionales

- `points_ledger` evita recalcular el ranking en memoria y deja trazabilidad del puntaje.
- El baseline se considera editable hasta que `athletes.baseline_locked = true`.
- La autenticación depende de `users`; el perfil operativo depende de `athletes` o `coaches`.
- Los logros aprobados son los que generan registros en `points_ledger`.
