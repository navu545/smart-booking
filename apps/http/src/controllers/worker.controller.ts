import { Request, Response } from "express";
import * as workerService from "../services/worker.service.js";
import { workerSlotsQuerySchema } from "../validators/worker.validator.js";
import { AppError } from "../utils/AppError.js";

export const getWorkers = async (_req: Request, res: Response) => {
  const workers = await workerService.getWorkers();

  res.json({
    success: true,
    data: workers,
  });
};

export const getSlots = async (req: Request, res: Response) => {
  const parsed = workerSlotsQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw new AppError("Invalid query params", 400, "INVALID_QUERY");
  }

  const { workerId } = parsed.data;

  const slots = await workerService.getSlots(workerId);

  res.json({
    success: true,
    data: slots,
  });
};
