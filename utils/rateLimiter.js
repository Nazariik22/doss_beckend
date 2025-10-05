import SuspiciousIP from "../models/SuspiciousIP.js";
import BlockedIP from "../models/BlockedIP.js";
import { validateIP } from "./validateIP.js";

// Rate limiting для API
const ipRequests = new Map();

export const rateLimiter = (limit = 100, windowMs = 60000) => {
    return async (req, res, next) => {
        const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

        // Якщо IP заблокований
        const isBlocked = await BlockedIP.findOne({ ip });
        if (isBlocked) {
            return res.status(403).json({ message: "Ваш IP заблокований." });
        }

        if (!validateIP(ip)) return res.status(400).json({ message: "Некоректний IP" });

        const now = Date.now();
        if (!ipRequests.has(ip)) {
            ipRequests.set(ip, []);
        }

        // Фільтруємо старі запити
        const requests = ipRequests.get(ip).filter((t) => now - t < windowMs);
        requests.push(now);
        ipRequests.set(ip, requests);

        // Якщо перевищено ліміт — додаємо до підозрілих
        if (requests.length > limit) {
            await SuspiciousIP.findOneAndUpdate(
                { ip },
                { $inc: { requestCount: 1 }, lastSeen: new Date(), reason: "Rate limit exceeded" },
                { upsert: true, new: true }
            );
            return res.status(429).json({ message: "Забагато запитів, спробуйте пізніше" });
        }

        next();
    };
};
