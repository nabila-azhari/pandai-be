import * as yup from 'yup';

/* =========================
   ROLE TYPE
   ========================= */
export type UserRole = 'siswa' | 'guru' | 'orang-tua' | 'waka';

/* =========================
   LOGIN
   ========================= */
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required'),
});

export type LoginType = yup.InferType<typeof loginSchema>;

/* =========================
   REGISTER
   ========================= */
export const registerSchema = yup.object({
  fullname: yup
    .string()
    .required('Fullname is required'),

  email: yup
    .string()
    .email('Invalid email')
    .required('Email is required'),

  password: yup
    .string()
    .min(8, 'Password min 8 character')
    .required('Password is required'),

  role: yup
    .mixed<UserRole>()
    .oneOf(['siswa', 'guru', 'orang-tua', 'waka'])
    .default('siswa')
    .required(),

  // 🔑 NIS HANYA UNTUK SISWA
  nis: yup
    .string()
    .when('role', {
      is: 'siswa',
      then: (schema) =>
        schema.required('NIS is required for siswa'),
      otherwise: (schema) =>
        schema.notRequired(),
    }),
});

export type RegisterType = yup.InferType<typeof registerSchema>;
