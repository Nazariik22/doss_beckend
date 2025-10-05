import SuspiciousIP from "../models/SuspiciousIP.js";

export const trackIPActivity = async (userId, siteId, ip, reason = null) => {
    await SuspiciousIP.findOneAndUpdate(
        { user: userId, site: siteId, ip },
        {
            $inc: { requestCount: 1 },
            $set: { lastSeen: new Date(), ...(reason ? { reason } : {}) }
        },
        { upsert: true }
    );
};