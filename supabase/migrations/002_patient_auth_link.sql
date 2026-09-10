-- ============================================================
-- MIGRATION 002 — Vinculación paciente ↔ auth.users
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Agregar columna auth_user_id a la tabla patients
ALTER TABLE public.patients
  ADD COLUMN IF NOT EXISTS auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- 2. Índice para búsquedas rápidas por auth_user_id
CREATE INDEX IF NOT EXISTS idx_patients_auth_user ON public.patients(auth_user_id);

-- 3. Política: el paciente puede ver su propio expediente
CREATE POLICY "patients_patient_can_read_own"
  ON public.patients
  FOR SELECT
  USING (auth_user_id = auth.uid());

-- 4. Política: el paciente puede ver sus propias recetas
--    (La política anterior del dentista sigue funcionando con dentist_id = auth.uid())
DROP POLICY IF EXISTS "prescriptions_patient_select" ON public.prescriptions;

CREATE POLICY "prescriptions_patient_can_read_own"
  ON public.prescriptions
  FOR SELECT
  USING (
    dentist_id = auth.uid()
    OR patient_id IN (
      SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    )
  );

-- 5. Política: el paciente puede ver sus propias citas
CREATE POLICY "appointments_patient_can_read_own"
  ON public.appointments
  FOR SELECT
  USING (
    dentist_id = auth.uid()
    OR patient_id IN (
      SELECT id FROM public.patients WHERE auth_user_id = auth.uid()
    )
  );
