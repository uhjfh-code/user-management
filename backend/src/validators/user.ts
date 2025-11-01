// backend/src/validators/user.ts
import { z } from "zod";

export const userSchema = z.object({
  id: z.number().optional(),
  customerNumber: z.coerce.number().int().min(1),
  username: z.string().min(3).max(30),
  email: z.string().email().max(300),
  firstName: z.string().min(1).max(150),
  lastName: z.string().min(1).max(150),
  password: z.string().min(8).max(150),
  dateOfBirth: z.coerce.date(),
  lastLogin: z.coerce.date().optional(),
});
