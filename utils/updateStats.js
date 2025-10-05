import { recordStats } from "../services/statsService.js";
import { createLog } from "../services/logService.js";

export const updateStats = async (req, res, next) => {
    const userId = req.user?.id;       // Беремо користувача з JWT
    const siteId = req.headers["x-site-id"];
    const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    if (!userId || !siteId) return next(); // Якщо не API-запит сайту — пропускаємо

    const blocked = res.statusCode === 403 || res.statusCode === 429;


    await createLog({
        user: userId,
        site: siteId,
        ip,
        endpoint: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        blocked,
        userAgent: req.headers["user-agent"]
    });

    // Оновлення статистики
    await recordStats(userId, siteId, ip, blocked);

    next();
};
