import { Request, Response } from "express";
import * as bookingService from "../services/booking.service.js";
import { bookingSchema } from "../validators/booking.validator.js";

export const bookSlot = async (req: Request, res: Response) => {
  const parsed = bookingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: parsed.error.issues.map((e) => ({
        field: e.path[0],
        message: e.message,
      })),
    });
  }

  const { userId, slotId } = parsed.data;

  const booking = await bookingService.bookSlot(userId, slotId);

  res.json({
    success: true,
    booking,
  });
};
