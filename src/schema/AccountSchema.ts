import { z } from 'zod';

export const AccountSchema = z.object({
  balance: z.number({
    invalid_type_error: 'Balance must a number',
    required_error: 'Balance is required',
  }),
});

export type AccountType = z.infer<typeof AccountSchema>;
