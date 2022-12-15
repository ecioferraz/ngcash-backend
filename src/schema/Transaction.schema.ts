import { z } from 'zod';

export const TransactionSchema = z.object({
  debitedAccountId: z.string(),
  creditedAccountId: z.string(),
  value: z.number(),
  createdAt: z.date(),
});

export type TransactionType = z.infer<typeof TransactionSchema>;
