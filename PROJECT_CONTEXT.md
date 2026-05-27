# Auvit Service Platform

## Project Overview

Auvit Service Platform is a web-based ticketing and service management system for a home automation company.

The platform will manage:
- Service tickets
- Clients
- Technicians
- Scheduling
- Service orders
- Reporting
- User roles
- Historical failures
- Operations workflows

Primary focus:
Service department first.

---

# Main Stack

## Frontend
- Next.js 15
- React
- TypeScript
- TailwindCSS
- shadcn/ui

## Backend
- Supabase

## Database
- PostgreSQL (via Supabase)

## Deployment
- Vercel

## Version Control
- Git + GitHub

---

# Current Architecture

src/
│
├── app/
│   ├── login/
│   └── (dashboard)/
│       ├── dashboard/
│       ├── tickets/
│       ├── clientes/
│       ├── agenda/
│       ├── usuarios/
│       └── layout.tsx
│
├── components/
│   ├── layout/
│   └── ui/
│
├── lib/
│   ├── supabase.ts
│   └── supabase-client.ts
│
├── services/
├── hooks/
├── types/
└── styles/

---

# Main Roles

## Administrator
- Full access
- User management
- Ticket assignment
- Reporting
- Dashboard access
- Operations management

## Receptionist
- Create/edit tickets
- Manage customers
- Assign technicians
- View schedules

## Technician
- View assigned tickets
- Take available tickets
- Update service status
- Add service notes
- Mobile responsive access

## Operations
- Service coordination
- Schedule management
- Monitoring technicians

## Route permissions (implemented)

| Route | admin | receptionist | technician | operations |
|-------|:-----:|:------------:|:----------:|:----------:|
| /dashboard | yes | yes | yes | yes |
| /tickets | yes | yes | yes | yes |
| /clientes | yes | yes | no | yes |
| /agenda | yes | yes | yes | yes |
| /usuarios | yes | no | no | no |

DB enum: `admin`, `receptionist`, `technician`, `operations` — see `supabase/migrations/001_users_and_roles.sql`

---

# Main Modules

## Authentication
- Login
- Protected routes
- Session management
- Role permissions

## Dashboard
- KPIs
- Open tickets
- Technician status
- Pending services
- Reports

## Tickets
- Create ticket
- Update ticket
- Ticket history
- Priority levels
- Service notes
- Assign technician

## Clients
- Customer database
- Service history
- Address management
- Contact information

## Agenda
- Calendar view
- Technician schedules
- Service assignments

## Service Orders
- Printable PDF
- Company branding
- Service details
- Client signature

## Reports
- Service metrics
- Technician performance
- Failure analytics

---

# Database Planned Tables

## users
- id
- name
- email
- role
- phone
- created_at

## clients
- id
- name
- phone
- email
- address
- notes
- created_at

## tickets
- id
- client_id
- assigned_to
- priority
- status (`open`, `assigned`, `in_progress`, `resolved`, `closed`, `cancelled`)
- reported_issue
- possible_solution
- created_at
- updated_at

**Flujo de estados:** Resuelto = trabajo terminado, puede no estar pagado. Cerrado = pagado/cerrado administrativamente.

## ticket_history
- id
- ticket_id
- notes
- status
- created_by
- created_at

## schedules
- id
- technician_id
- ticket_id
- scheduled_start
- scheduled_end
- status (`scheduled`, `completed`, `cancelled`)
- notes
- created_by
- created_at

---

# UI Guidelines

## Design Style
- Clean SaaS dashboard
- Dark sidebar
- Modern cards
- Mobile responsive
- Tablet friendly
- Technician mobile-first workflows

## Main Colors
- Dark neutral
- Slate palette
- Professional enterprise look

---

# Development Rules

## IMPORTANT
- Commit frequently
- Never modify Next.js configs unnecessarily
- Keep components modular
- Use TypeScript types
- Use services folder for database logic
- Use hooks for reusable logic

---

# Git Workflow

## Main Commands

git add .
git commit -m "message"
git push

---

# Current Progress

## Completed
- Next.js setup
- Tailwind setup
- GitHub setup
- Supabase connection
- Sidebar layout
- Dashboard structure
- shadcn/ui setup
- Login page UI
- Auth: login redirect, session cookies, middleware protected routes, logout
- Roles: `users` table, RLS, route/menu permissions, admin bootstrap SQL
- Clients CRUD + Tickets CRUD + ticket history (SQL `003_clients_and_tickets.sql`)
- Users module UI (admin): create profile by email, edit role/name/phone, delete profile (`004_users_admin_upsert_by_email.sql`)
- Dashboard metrics (real data from tickets, role-aware technician view)
- Weekly agenda module with multiple appointments per ticket (`005_weekly_agenda.sql`)
- Create Auth users from admin UI (`SUPABASE_SERVICE_ROLE_KEY` + `/usuarios/nuevo`)
- Basic reports (`/reportes`): by status, priority, technician, resolved vs closed
- Service order print flow (`/tickets/[id]/orden`) — functional layout; branding/logo later

## Next Steps
- UI refresh (modern SaaS look)
- Service order: logo, membrete, formato tipo Excel

---

# Future Features

- Push notifications
- WhatsApp integration
- AI-assisted diagnostics
- Technician GPS tracking
- Inventory integration
- PDF service reports
- Digital signatures
- Photo attachments
- Voice notes
- Offline mobile support
