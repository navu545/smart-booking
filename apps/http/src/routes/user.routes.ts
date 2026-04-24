import { Router } from "express";
import { prisma } from "@repo/db";

const router = Router();

router.get("/", async (_req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: "CUSTOMER",
    },
  });

  res.json({
    success: true,
    data: users,
  });
});

export default router;
