import { z } from 'zod';

export const medicationSchema = z.object({
  name: z.string().min(1, 'Nombre del medicamento requerido'),
  dose: z.string().min(1, 'Dosis requerida'),
  frequency: z.string().min(1, 'Frecuencia requerida'),
  duration: z.string().min(1, 'Duración requerida'),
  instructions: z.string(),
});

export const prescriptionSchema = z.object({
  patientId: z.string().min(1, 'Selecciona un paciente'),
  diagnosis: z.string().min(3, 'El diagnóstico debe tener al menos 3 caracteres'),
  medications: z.array(medicationSchema).min(1, 'Agrega al menos un medicamento'),
  additionalInstructions: z.string(),
  expiresAt: z.string().min(1, 'Fecha de vencimiento requerida'),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;
export type MedicationFormValues = z.infer<typeof medicationSchema>;
