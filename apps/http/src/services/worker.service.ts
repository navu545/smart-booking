import { prisma } from "@repo/db";
import { getDistance } from "../utils/distance.js";

export const getWorkers = async () => {
  const workers = await prisma.worker.findMany({
    include: {
      user: true,
      slots: true,
    },
  });

  // 🔥 TEMP: hardcoded user location
  const userLat = 30.7333;
  const userLng = 76.7794;

  const enriched = workers.map((w) => {
    const availableSlots = w.slots.filter((s) => !s.isBooked).length;

    const distance = getDistance(userLat, userLng, w.lat, w.lng);

    return {
      id: w.id,
      userId: w.userId,
      rating: w.rating,
      user: w.user,
      availableSlots,
      distance, 
    };
  });

  return enriched;
};

export const getSlots = async (workerId: number) => {
  return prisma.slot.findMany({
    where: {
      workerId,
    },
    include: {
      booking: true, 
    },
    orderBy: {
      date: "asc",
    },
  });
};
