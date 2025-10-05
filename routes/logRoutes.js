import express from "express";
import { trackRequest } from "../controllers/logController.js";

const router = express.Router();

router.post("/track", trackRequest);

export default router;