import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(6, { message: "Senha deve ter pelo menos 6 caracteres" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const complaintSchema = z.object({
  title: z.string().min(5, { message: "Título muito curto" }),
  description: z.string().min(20, { message: "Descrição deve ser mais detalhada" }),
  category: z.string(),
  isAnonymous: z.boolean().default(false),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;
