import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getDailyStats,
    getHourlyStats,
    getCombinedStats,
    getHourlyStatsByDay,
    getDailyStatsByMonth
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/daily", protect, getDailyStats);
router.get("/hourly", protect, getHourlyStats);
router.get("/combined", protect, getCombinedStats);


router.get("/hourly/by-day", protect, getHourlyStatsByDay);


router.get("/daily/by-month", protect, getDailyStatsByMonth);

export default router;