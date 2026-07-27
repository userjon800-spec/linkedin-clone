import { z } from "zod";

export const signupSchema = z
  .object({
    // Step 1
    firstName: z
      .string()
      .min(2, "Ism kamida 2 ta belgidan iborat bo'lishi kerak"),
    lastName: z.string().optional(),
    email: z.string().email("Yaroqli email manzilini kiriting"),
    password: z
      .string()
      .min(8, "Parol kamida 8 ta belgidan iborat bo'lishi kerak")
      .regex(/[A-Z]/, "Kamida bitta bosh harf bo'lishi kerak")
      .regex(/[a-z]/, "Kamida bitta kichik harf bo'lishi kerak")
      .regex(/[0-9]/, "Kamida bitta raqam bo'lishi kerak"),
    confirmPassword: z.string(),

    // Step 2
    job: z
      .string({ error: "Iltimos, kasbingizni tanlang" })
      .min(1, "Kasbingizni tanlang"),
    age: z.string().optional(),
    location: z.string().optional(),
    company: z.string().optional(),

    // Step 3
    school: z.string().optional(),
    degree: z.string().optional(),
    field: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parollar bir-biriga mos kelmadi",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
