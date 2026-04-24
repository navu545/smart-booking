import { prisma } from "@repo/db";
import { AppError } from "../utils/AppError.js";
import { sendWSMessage } from "../lib/wsClient.js";


export const bookSlot = async (userId: number, slotId: number) => {
  try {
    const result = await prisma.$transaction(async (tx: any) => {
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
      });

      if (!slot) {
        throw new AppError("Slot not found", 404, "SLOT_NOT_FOUND");
      }

      if (slot.isBooked) {
        throw new AppError("Slot already booked", 400, "SLOT_ALREADY_BOOKED");
      }

      let booking;

      try {
        booking = await tx.booking.create({
          data: {
            userId,
            workerId: slot.workerId,
            slotId,
          },
        });
      } catch (err: any) {
        if (err.code === "P2002") {
          throw new AppError(
            "Slot already booked by another user",
            400,
            "SLOT_ALREADY_BOOKED",
          );
        }
        throw err;
      }

      await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return {
        booking,
        workerId: slot.workerId,
      };
    });

    // ✅ AFTER transaction succeeds
    sendWSMessage({
      type: "SLOT_BOOKED",
      data: {
        slotId,
        workerId: result.workerId,
      },
    });

    return result.booking;
  } catch (err) {
    throw err;
  }
};
