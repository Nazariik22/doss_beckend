import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
    getSeenIPs,
    getSuspiciousIPs,
    getBlockedIPs,
    blockIP,
    unblockIP
} from "../controllers/ipController.js";

const router = express.Router();

router.get("/seen", protect, getSeenIPs);         // Всі IP, що зверталися
router.get("/suspicious", protect, getSuspiciousIPs); // Підозрілі
router.get("/blocked", protect, getBlockedIPs);   // Заблоковані
router.post("/block", protect, blockIP);
router.post("/unblock", protect, unblockIP);

export default router;
