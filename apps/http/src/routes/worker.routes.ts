import { Router } from "express";
import { getWorkers, getSlots } from "../controllers/worker.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(getWorkers));
router.get("/slots", asyncHandler(getSlots));

export default router;
