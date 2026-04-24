import { prisma } from "@repo/db";
import { seedDatabase } from "@repo/db/seedData";
import { sendWSMessage } from "../lib/wsClient.js";

export const resetDatabase = async () => {
  console.log("🔄 RESET START");

  // Clear tables
  await prisma.booking.deleteMany();
  await prisma.slot.deleteMany();
  await prisma.worker.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 DATA CLEARED");

  //Reset auto-increment IDs (CRITICAL FIX)
  await prisma.$executeRawUnsafe(`
    TRUNCATE TABLE "Booking", "Slot", "Worker", "User"
    RESTART IDENTITY CASCADE;
  `);

  console.log("🔢 IDENTITY RESET");

  // Reseed
  await seedDatabase();

  console.log("✅ RESET COMPLETE");

  sendWSMessage({
    type: "SYSTEM_RESET",
  });
};
