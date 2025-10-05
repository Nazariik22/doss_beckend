import Log from "../models/Log.js";
import Site from "../models/Site.js";
import StatsDaily from "../models/StatsDaily.js";
import StatsHourly from "../models/StatsHourly.js";
import BlockedIP from "../models/BlockedIP.js";
import { trackIPActivity } from "../utils/ipUtils.js";
import geoip from "geoip-lite";

export const trackRequest = async (req, res) => {
    try {
        const { token, url, referrer, userAgent, timestamp } = req.body;
        const rawIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
        const ip = rawIp === "::1" ? "127.0.0.1" : rawIp;

        const geo = geoip.lookup(ip);
        const country = geo?.country || "Unknown";

        const site = await Site.findOne({ token }).populate("user");
        if (!site) return res.status(404).json({ error: "Site not found for this token" });

        const userId = site.user._id;
        const siteId = site._id;
        const now = timestamp ? new Date(timestamp) : new Date();

        // Формат дати для години "YYYY-MM-DD HH"
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hour = String(now.getHours()).padStart(2, "0");
        const hourString = `${year}-${month}-${day} ${hour}`;

        // День з нульованим часом
        const dateDay = new Date(year, now.getMonth(), now.getDate());

        // Вести активність IP з країною
        await trackIPActivity(userId, siteId, ip, country);

        const isBlockedGlobal = await BlockedIP.findOne({ user: userId, ip });
        const isBlockedSite = await BlockedIP.findOne({ user: userId, site: siteId, ip });

        const isBlocked = isBlockedGlobal || isBlockedSite;

        // Створити лог з булевим blocked
        await Log.create({
            user: userId,
            site: siteId,
            ip,
            country,
            endpoint: url,
            method: "GET",
            statusCode: isBlocked ? 403 : 200,
            blocked: !!isBlocked,  // <-- тут важливо булеве значення
            userAgent,
        });

        // Оновлення статистики по годинах
        await StatsHourly.findOneAndUpdate(
            { user: userId, site: siteId, hour: hourString },
            { $inc: { requests: 1, blocked: isBlocked ? 1 : 0 } },
            { upsert: true }
        );

        // Оновлення статистики по днях
        await StatsDaily.findOneAndUpdate(
            { user: userId, site: siteId, date: dateDay },
            {
                $inc: { requests: 1, blocked: isBlocked ? 1 : 0 },
                $addToSet: { uniqueIPs: ip }
            },
            { upsert: true }
        );

        if (isBlocked) {
            return res.status(403).json({ error: "Access denied. IP blocked." });
        }

        res.status(200).json({ message: "Tracked successfully" });
    } catch (error) {
        console.error("Track error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
