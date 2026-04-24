import { z } from "zod";

export const workerSlotsQuerySchema = z.object({
  workerId: z.coerce.number().int().positive(),
});
