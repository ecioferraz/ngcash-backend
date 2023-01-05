import { z } from 'zod';

export const UserSchema = z.object({
  username: z
    .string({
      required_error: 'Username obrigatório.',
      invalid_type_error: 'Username must be a string',
    })
    .min(3, { message: 'Username deve ter no mínimo 3 caracteres.' }),
  password: z
    .string({
      required_error: 'Senha obrigatória.',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, { message: 'Username deve ter no mínimo 8 caracteres.' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/, {
      message: 'Senha deve conter pelo menos um número e uma letra maiúscula.',
    }),
  accountId: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
