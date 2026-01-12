import * as yup from 'yup';
import { UserRole } from '../auth/schema';

/* =========================
   USER SCHEMA (DATABASE)
   ========================= */
export const userSchema = yup.object({
  id: yup
    .string()
    .required(),

  fullname: yup
    .string()
    .required(),

  email: yup
    .string()
    .email()
    .required(),

  password: yup
    .string()
    .required(),

  role: yup
    .mixed<UserRole>()
    .oneOf(['siswa', 'guru', 'orang-tua', 'waka'])
    .required(),

  // 🔑 hanya siswa yang punya NIS
  nis: yup
    .string()
    .optional(),

  createdAt: yup.date().optional(),
  updatedAt: yup.date().optional(),
});

export type UserType = yup.InferType<typeof userSchema>;
