-- =====================================================
-- SIMPLE USERS TABLE
-- =====================================================

CREATE TABLE public.users (
  id uuid not null default gen_random_uuid(),
  email character varying(255) not null,
  password_hash character varying(255) not null,
  first_name character varying(100) null,
  last_name character varying(100) null,
  phone character varying(20) null,
  role character varying(50) not null default 'BUYER'::character varying,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check (
    role IN ('ADMIN', 'AGENT', 'BUYER', 'BUILDER')
  )
);

-- Simple indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users (email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users (is_active);
