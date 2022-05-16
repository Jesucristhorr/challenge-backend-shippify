import { z } from 'zod';

export const getChargesParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});

export const postChargesBodySchema = z.object({
  amount: z.number().min(0),
  userId: z.string().regex(/^[0-9]{1,}$/),
  lastEventId: z.string().regex(/^[0-9]{1,}$/),
});

export const putChargesBodySchema = z.object({
  id: z.number().min(1),
  amount: z.number().min(0),
  userId: z.string().regex(/^[0-9]{1,}$/),
  lastEventId: z.string().regex(/^[0-9]{1,}$/),
});

export const deleteChargesParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});
