# Athlete JSON Import

Place the one-time import file here:

```text
data/import/athletes.json
```

The file must be a JSON list using `name` and `email`:

```json
[
  { "name": "Ana Perez", "email": "ana@example.com" }
]
```

Run the import from the project root while the backend and database are running:

```bash
docker compose exec app python scripts/import_athletes.py data/import/athletes.json
```

Imported athletes receive the default password `Sole12345!` and level `scaled`.
Existing emails are skipped without modifying current data.
