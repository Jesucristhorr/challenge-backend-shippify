import { z } from 'zod';

export const getClientSummaryBodySchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
  userId: z.number().min(1),
});
