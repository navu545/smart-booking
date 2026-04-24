import { Router } from "express";
import { reset } from "../controllers/admin.controller.js";

const router = Router();

router.post("/reset", reset);

export default router;
