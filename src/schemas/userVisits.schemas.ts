import { z } from 'zod';

export const getUserVisitsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});

export const postUserVisitsBodySchema = z.object({
  userId: z.string().regex(/^[0-9]{1,}$/),
});

export const putUserVisitsBodySchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
  userId: z.string().regex(/^[0-9]{1,}$/),
});

export const deleteUserVisitsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});
