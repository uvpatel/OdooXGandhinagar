import { z } from "zod"



export const UserZodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
 password: z.string().min(7).max(10),
});

