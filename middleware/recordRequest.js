import StatsDaily from "../models/StatsDaily.js";
import StatsHourly from "../models/StatsHourly.js";

export const recordRequest = async (req, res, next) => {
    const userId = req.user?._id;
    if (!userId) return next();

    const date = new Date();
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const hourKey = `${today.toISOString().split("T")[0]} ${date.getHours()}:00`;

    // Оновлення денних
    await StatsDaily.findOneAndUpdate(
        { user: userId, date: today },
        { $inc: { requests: 1 }, $addToSet: { uniqueIPs: req.ip } },
        { upsert: true, new: true }
    );

    // Оновлення погодинних
    await StatsHourly.findOneAndUpdate(
        { user: userId, hour: hourKey },
        { $inc: { requests: 1 } },
        { upsert: true, new: true }
    );

    next();
};