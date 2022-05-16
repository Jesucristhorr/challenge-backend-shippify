import { z } from 'zod';

export const getUserParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});

export const postUserBodySchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const putUserBodySchema = z.object({
  id: z.number().min(1),
  firstName: z.string(),
  lastName: z.string(),
});

export const deleteUserParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});
