import { z } from 'zod';

// Esquema para la validación del perfil
export const profileSchema = z.object({
  firstName: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre es demasiado largo'),
  lastName: z.string()
    .min(1, 'El apellido es requerido')
    .max(100, 'El apellido es demasiado largo'),
  email: z.string()
    .email('Debe ser un correo electrónico válido')
    .min(1, 'El correo electrónico es requerido'),
  phone: z.string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Número de teléfono inválido')
    .min(10, 'El número de teléfono debe tener al menos 10 dígitos')
    .optional()
    .or(z.literal('')),
  bio: z.string()
    .max(500, 'La biografía es demasiado larga')
    .optional()
    .or(z.literal('')),
});

// Esquema para la validación de configuración general
export const generalSettingsSchema = z.object({
  companyName: z.string()
    .min(1, 'El nombre de la empresa es requerido')
    .max(150, 'El nombre de la empresa es demasiado largo'),
  timezone: z.string()
    .min(1, 'Debe seleccionar una zona horaria'),
  language: z.string()
    .min(1, 'Debe seleccionar un idioma'),
  currency: z.string()
    .min(1, 'Debe seleccionar una moneda'),
  dateFormat: z.string()
    .min(1, 'Debe seleccionar un formato de fecha'),
});

// Esquema para la validación de seguridad (contraseña)
export const securitySchema = z.object({
  currentPassword: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres'),
  newPassword: z.string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe incluir mayúsculas, minúsculas y números'),
  confirmPassword: z.string(),
})
.refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// Tipos derivados de los esquemas
export type ProfileData = z.infer<typeof profileSchema>;
export type GeneralSettingsData = z.infer<typeof generalSettingsSchema>;
export type SecurityData = z.infer<typeof securitySchema>;