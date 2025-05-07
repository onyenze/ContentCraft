import { z } from 'zod';

export const contentTypeUpdateSchema = z.object({
  name: z.string().optional(),
  identifier: z.string().optional()
});
