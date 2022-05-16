import { z } from 'zod';

export const getSucursalsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});

export const postSucursalsBodySchema = z.object({
  name: z.string(),
});

export const putSucursalsBodySchema = z.object({
  id: z.number().min(1),
  name: z.string(),
});

export const deleteSucursalsParamsSchema = z.object({
  id: z.string().regex(/^[0-9]{1,}$/),
});
