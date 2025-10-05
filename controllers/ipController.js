import SuspiciousIP from "../models/SuspiciousIP.js";
import BlockedIP from "../models/BlockedIP.js";
import Log from "../models/Log.js";

export const getSeenIPs = async (req, res) => {
    const ips = await SuspiciousIP.find({ user: req.user._id });
    res.json(ips);
};

export const getSuspiciousIPs = async (req, res) => {
    const threshold = 1000;
    const ips = await SuspiciousIP.find({
        user: req.user._id,
        $or: [
            { requestCount: { $gte: threshold } },
            { reason: { $exists: true, $ne: null } }
        ]
    });
    res.json(ips);
};

export const getBlockedIPs = async (req, res) => {
    const ips = await BlockedIP.find({ user: req.user._id });
    res.json(ips);
};

export const blockIP = async (req, res) => {
    try {
        const { ip, reason, site, userAgent, endpoint } = req.body;
        const user = req.user._id;
        let activity;

        if (site) {
            activity = await SuspiciousIP.findOne({ user, site, ip });
        }
        if (!activity) {
            activity = await SuspiciousIP.findOne({ user, ip });
        }

        const blockedData = {
            user,
            site: site || null,
            ip,
            reason,
            requestCount: activity?.requestCount || 0,
            country: activity?.country || null,
            lastSeen: activity?.lastSeen || null,
            blockedAt: new Date()
        };

        // Створюємо або оновлюємо запис у BlockedIP
        let blocked = await BlockedIP.findOneAndUpdate(
            { user, site: site || null, ip },
            blockedData,
            { upsert: true, new: true }
        );

        // Логування блокування
        const newLog = new Log({
            ip,
            user,
            blocked: true,
            site: site || null,
            statusCode: 403,
            blockedAt: new Date(),
            userAgent: userAgent || null,
            endpoint: endpoint || null
        });
        await newLog.save();

        res.status(201).json(blocked);
    } catch (error) {
        console.error("Error blocking IP:", error);
        res.status(500).json({ error: "Server error blocking IP" });
    }
};

export const unblockIP = async (req, res) => {
    try {
        const { ip, userAgent, endpoint } = req.body;
        const user = req.user._id;

        await BlockedIP.deleteMany({ user, ip }); // видалити з усіх сайтів

        // Логування розблокування
        const newLog = new Log({
            ip,
            user,
            blocked: false,
            site: null,
            statusCode: 200,
            blockedAt: null,
            userAgent: userAgent || null,
            endpoint: endpoint || null
        });
        await newLog.save();

        res.json({ message: "IP розблоковано" });
    } catch (error) {
        console.error("Error unblocking IP:", error);
        res.status(500).json({ error: "Server error unblocking IP" });
    }
};
