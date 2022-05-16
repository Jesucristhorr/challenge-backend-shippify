import { z } from 'zod';

export const getEventsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});

export const postEventsBodySchema = z.object({
  typeId: z.string().regex(/^[0-9]{1,}$/),
  sucursalId: z.string().regex(/^[0-9]{1,}$/),
});

export const putEventsBodySchema = z.object({
  id: z.number().min(1),
  typeId: z.string().regex(/^[0-9]{1,}$/),
  sucursalId: z.string().regex(/^[0-9]{1,}$/),
});

export const deleteEventsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});
