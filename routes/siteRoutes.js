import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createSite, getSites, getSite, updateSite, deleteSite } from "../controllers/siteController.js";

const router = express.Router();

router.post("/", protect, createSite);
router.get("/", protect, getSites);
router.get("/:id", protect, getSite);
router.put("/:id", protect, updateSite);
router.delete("/:id", protect, deleteSite);

export default router;