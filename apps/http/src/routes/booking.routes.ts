import { Router } from "express";
import { bookSlot } from "../controllers/booking.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/", asyncHandler(bookSlot));

export default router;
