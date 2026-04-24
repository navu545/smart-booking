import { z } from "zod";

export const bookingSchema = z.object({
  userId: z.number().int().positive(),
  slotId: z.number().int().positive(),
});
