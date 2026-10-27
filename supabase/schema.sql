-- Pro Tours & Travel Solutions — Supabase schema (run once in the Supabase SQL editor).
-- Server code writes with the service-role key; the browser never gets direct table access.

-- Every TBO API request/response (TBO wants these kept as JSON).
create table if not exists tbo_logs (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  env         text not null,               -- staging | live
  trace_id    text,
  method      text not null,               -- Authenticate, Search, FareQuote, Ticket…
  kind        text not null check (kind in ('request', 'response')),
  body        jsonb not null
);
create index if not exists tbo_logs_trace on tbo_logs (trace_id, created_at);

-- One row per flight booking attempt (website or CRM).
create table if not exists flight_bookings (
  id            bigserial primary key,
  created_at    timestamptz not null default now(),
  order_ref     text unique not null,
  env           text not null,
  trace_id      text,
  status        text not null default 'pending',  -- pending | ticketed | failed | cancelled | refunded
  amount_inr    numeric(12,2),
  payment_id    text,
  contact_phone text,
  contact_email text,
  legs          jsonb not null default '[]',      -- [{pnr, bookingId, ticketStatus, error, details}]
  notes         text
);

-- Website enquiries (WhatsApp/contact form copies) for the CRM.
create table if not exists enquiries (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  name        text,
  phone       text,
  email       text,
  topic       text,
  message     text,
  status      text not null default 'new'       -- new | contacted | won | lost
);

-- Editable site content for the CRM (packages, notices, settings).
create table if not exists site_content (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now()
);

alter table tbo_logs        enable row level security;
alter table flight_bookings enable row level security;
alter table enquiries       enable row level security;
alter table site_content    enable row level security;
-- No public policies: only the server (service role) reads/writes until CRM logins are added.
