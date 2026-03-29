---
name: migrate
description: Create and run a Supabase SQL migration. Use when the user says "migrate", "migration", "run migration", or needs schema changes.
argument-hint: "<migration_name> <description of schema changes>"
---

# Supabase Migration Runner

Create and push SQL migrations to the remote Supabase database.

## Prerequisites

- Supabase CLI installed (`supabase` command available)
- Project linked (run `supabase link --project-ref <ref>` if not)
- Migration files live in `supabase/migrations/`

## Steps

1. **Parse the request** — understand what schema changes are needed.

2. **Create the migration file:**
   ```bash
   supabase migration new <migration_name>
   ```
   This creates a timestamped file in `supabase/migrations/`.

3. **Write the SQL** into the created migration file. Use `IF NOT EXISTS` where appropriate for safety.

4. **Push to remote:**
   ```bash
   supabase db push
   ```
   This applies pending migrations to the remote database.

5. **Verify** — confirm the migration was applied successfully by checking the output or querying the new table/column via the app's API.

## Troubleshooting

If `db push` fails with "Remote migration versions not found":
```bash
# List what's out of sync
supabase migration list

# Revert remote-only migrations that don't exist locally
supabase migration repair --status reverted <timestamp>

# Then retry
supabase db push
```

## Notes

- The project ref is `cnnttsihfbyxhzlmzdtv` (claw-home)
- Always use `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS` for idempotency
- Supabase uses the service role key from `.env.local` for auth
