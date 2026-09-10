-- =============================================================
-- Odontavo – Schema v1
-- Ejecuta este script en: Supabase Dashboard → SQL Editor
-- =============================================================

-- ──────────────────────────────────────────────────────────────
-- TABLA: patients
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.patients (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name              TEXT        NOT NULL,
  date_of_birth     DATE        NOT NULL,
  -- { "email": "...", "phone": "...", "address": "..." }
  contact           JSONB       NOT NULL DEFAULT '{}',
  -- { "bloodType": "...", "allergies": [...], "history": "..." }
  medical           JSONB       NOT NULL DEFAULT '{}',
  -- { "name": "...", "phone": "...", "relationship": "..." }
  emergency_contact JSONB       NOT NULL DEFAULT '{}',
  last_visit        DATE,
  next_appointment  DATE,
  avatar            TEXT,
  status            TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "patients_dentist_select" ON public.patients
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "patients_dentist_insert" ON public.patients
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "patients_dentist_update" ON public.patients
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "patients_dentist_delete" ON public.patients
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- TABLA: appointments
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.appointments (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id   UUID        NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT        NOT NULL,
  dentist_name TEXT        NOT NULL,
  date         DATE        NOT NULL,
  time         TIME        NOT NULL,
  type         TEXT        NOT NULL,
  status       TEXT        NOT NULL DEFAULT 'pending'
                CHECK (status IN ('confirmed','pending','completed','cancelled')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "appointments_dentist_select" ON public.appointments
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "appointments_dentist_insert" ON public.appointments
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "appointments_dentist_update" ON public.appointments
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "appointments_dentist_delete" ON public.appointments
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- TABLA: transactions
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id           UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id   UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id   UUID           REFERENCES public.patients(id) ON DELETE SET NULL,
  patient_name TEXT           NOT NULL,
  concept      TEXT           NOT NULL,
  amount       NUMERIC(12,2)  NOT NULL,
  type         TEXT           NOT NULL CHECK (type IN ('ingreso','gasto','presupuesto')),
  status       TEXT           NOT NULL CHECK (status IN ('pagado','pendiente','cancelado')),
  date         DATE           NOT NULL,
  method       TEXT           CHECK (method IN ('efectivo','tarjeta','transferencia','otro')),
  notes        TEXT,
  created_at   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_dentist_select" ON public.transactions
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "transactions_dentist_insert" ON public.transactions
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "transactions_dentist_update" ON public.transactions
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "transactions_dentist_delete" ON public.transactions
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- TABLA: treatments
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.treatments (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id  UUID           NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT           NOT NULL,
  category    TEXT           NOT NULL,
  price       NUMERIC(12,2)  NOT NULL,
  duration    INT            NOT NULL,  -- minutos
  description TEXT,
  active      BOOLEAN        NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "treatments_dentist_select" ON public.treatments
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "treatments_dentist_insert" ON public.treatments
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "treatments_dentist_update" ON public.treatments
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "treatments_dentist_delete" ON public.treatments
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- TABLA: odontogram_entries
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.odontogram_entries (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id   UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id   UUID        NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  tooth_number TEXT        NOT NULL,  -- Notacion FDI: '11' a '48'
  surface      TEXT,
  diagnosis    TEXT        NOT NULL,
  treatment    TEXT        NOT NULL,
  notes        TEXT,
  date         DATE        NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.odontogram_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "odontogram_dentist_select" ON public.odontogram_entries
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "odontogram_dentist_insert" ON public.odontogram_entries
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "odontogram_dentist_update" ON public.odontogram_entries
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "odontogram_dentist_delete" ON public.odontogram_entries
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- TABLA: prescriptions
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  dentist_id              UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id              UUID        NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name            TEXT        NOT NULL,
  patient_email           TEXT        NOT NULL,
  dentist_name            TEXT        NOT NULL,
  dentist_license         TEXT        NOT NULL,
  clinic_name             TEXT        NOT NULL,
  diagnosis               TEXT        NOT NULL,
  -- Array de medicamentos: [{ name, dose, frequency, duration, instructions }]
  medications             JSONB       NOT NULL DEFAULT '[]',
  additional_instructions TEXT        NOT NULL DEFAULT '',
  expires_at              TIMESTAMPTZ NOT NULL,
  status                  TEXT        NOT NULL DEFAULT 'draft'
                          CHECK (status IN ('draft','sent','viewed','completed')),
  sent_via                TEXT[]      NOT NULL DEFAULT '{}',
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "prescriptions_dentist_select" ON public.prescriptions
  FOR SELECT USING (dentist_id = auth.uid());

CREATE POLICY "prescriptions_dentist_insert" ON public.prescriptions
  FOR INSERT WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "prescriptions_dentist_update" ON public.prescriptions
  FOR UPDATE USING (dentist_id = auth.uid()) WITH CHECK (dentist_id = auth.uid());

CREATE POLICY "prescriptions_dentist_delete" ON public.prescriptions
  FOR DELETE USING (dentist_id = auth.uid());

-- ──────────────────────────────────────────────────────────────
-- INDICES de rendimiento
-- ──────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_patients_dentist      ON public.patients(dentist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_dentist  ON public.appointments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_patient  ON public.appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_transactions_dentist  ON public.transactions(dentist_id);
CREATE INDEX IF NOT EXISTS idx_transactions_patient  ON public.transactions(patient_id);
CREATE INDEX IF NOT EXISTS idx_treatments_dentist    ON public.treatments(dentist_id);
CREATE INDEX IF NOT EXISTS idx_odontogram_patient    ON public.odontogram_entries(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_dentist ON public.prescriptions(dentist_id);
