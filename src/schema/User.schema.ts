import { z } from 'zod';

export const UserSchema = z.object({
  username: z
    .string({
      required_error: 'Username is required',
      invalid_type_error: 'Username must be a string',
    })
    .min(3, { message: 'Username must be 3 or more characters long' }),
  password: z
    .string({
      required_error: 'Password is required',
      invalid_type_error: 'Password must be a string',
    })
    .min(8, { message: 'Password must be 8 or more characters long' })
    .regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).*$/, {
      message:
        'Password must contain at least a number and an uppercase letter',
    }),
  accountId: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
