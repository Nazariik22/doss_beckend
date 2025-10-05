import StatsDaily from "../models/StatsDaily.js";
import StatsHourly from "../models/StatsHourly.js";

export const getDailyStats = async (req, res) => {
    const stats = await StatsDaily.find({ user: req.user._id });
    res.json(stats);
};

export const getHourlyStats = async (req, res) => {
    const stats = await StatsHourly.find({ user: req.user._id });
    res.json(stats);
};

export const getCombinedStats = async (req, res) => {
    const daily = await StatsDaily.find({ user: req.user._id });
    const hourly = await StatsHourly.find({ user: req.user._id });
    res.json({ daily, hourly });
};

export const getHourlyStatsByDay = async (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Необхідна дата (YYYY-MM-DD)" });
    const regex = new RegExp(`^${date}`);
    const stats = await StatsHourly.find({
        user: req.user._id,
        hour: { $regex: regex }
    }).sort({ hour: 1 });

    res.json(stats);
};

export const getDailyStatsByMonth = async (req, res) => {
    const { month } = req.query;
    if (!month) return res.status(400).json({ message: "Необхідний місяць (YYYY-MM)" });

    const start = new Date(`${month}-01T00:00:00.000Z`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);

    const stats = await StatsDaily.find({
        user: req.user._id,
        date: { $gte: start, $lt: end }
    }).sort({ date: 1 });

    res.json(stats);
};
