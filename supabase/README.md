# Supabase migrations

## Etapa 2 — Users & roles

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **SQL Editor**.
2. Paste and run `migrations/001_users_and_roles.sql`.
3. Confirm `sistemas@auvit.com` exists under **Authentication → Users** before running (the script links that account to `role = admin`).
4. Verify in **Table Editor → users** that your row exists with role `admin`.
5. Run `migrations/002_fix_rls_recursion.sql` (required if login shows "no profile" despite admin row existing).

### Troubleshooting: "Acceso no permitido" after login

If the user exists in `users` as admin but the app cannot load the profile, run `002_fix_rls_recursion.sql`. The original admin RLS policies caused infinite recursion on SELECT.

### Etapa 4 — Users UI

Run `migrations/004_users_admin_upsert_by_email.sql`.

Then the app supports:

- `/usuarios/nuevo`: assign role/profile by email (admin only)
- `/usuarios/[id]`: edit role, name, phone or delete profile

Note: email/account creation still starts in **Authentication → Users**.

### Etapa 3 — Clients & tickets

Run `migrations/003_clients_and_tickets.sql` in SQL Editor.

Ticket statuses: `open`, `assigned`, `in_progress`, `resolved`, `closed`, `cancelled`.

### Adding a new role later

1. `ALTER TYPE public.user_role ADD VALUE 'new_role';`
2. Update `src/types/user.ts` and `src/lib/permissions.ts` in the Next.js app.
