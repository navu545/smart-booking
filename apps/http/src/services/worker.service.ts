import { prisma } from "@repo/db";
import { getDistance } from "../utils/distance.js";

// 🧠 CACHE
let cachedWorkers: any = null;
let lastFetchTime = 0;
const CACHE_TTL = 30 * 1000; // 30 seconds (safe for real-time system)

export const getWorkers = async () => {
  const now = Date.now();

  //  Return cache if fresh
  if (cachedWorkers && now - lastFetchTime < CACHE_TTL) {
    return cachedWorkers;
  }

  const workers = await prisma.worker.findMany({
    include: {
      user: true,
      slots: true,
    },
  });

  //  TEMP: hardcoded user location
  const userLat = 30.7333;
  const userLng = 76.7794;

  const enriched = workers.map((w: any) => {
    const availableSlots = w.slots.filter((s: any) => !s.isBooked).length;

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

  //  Save to cache
  cachedWorkers = enriched;
  lastFetchTime = now;

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

//  EXPOSE INVALIDATION FUNCTION
export const invalidateWorkerCache = () => {
  cachedWorkers = null;
};
