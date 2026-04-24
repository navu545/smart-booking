import { Request, Response } from "express";
import { resetDatabase } from "../services/admin.service.js";

export const reset = async (_req: Request, res: Response) => {
  await resetDatabase();

  res.json({
    success: true,
    message: "Database reset successful",
  });
};
