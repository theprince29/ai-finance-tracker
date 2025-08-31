import { z } from "zod";

export const createTxnSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.number().positive(),
  currency: z.string().min(1),
  category: z.enum([
    'INCOME','FOOD','GROCERY','TRANSPORT','GAS','SUBSCRIPTION','ENTERTAINMENT',
    'ELECTRONICS','SHOPPING','HEALTH','UTILITIES','RENT','TRAVEL','OTHER'
  ]).default('OTHER'),
  description: z.string().min(1),
  merchant: z.string().optional().nullable(),
  occurredAt: z.string().datetime().optional()
});

export const parseSchema = z.object({
  text: z.string().min(1)
});
