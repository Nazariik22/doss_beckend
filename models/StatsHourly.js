import mongoose from "mongoose";

const statsHourlySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    hour: { type: String, required: true }, // "YYYY-MM-DD HH:00"
    requests: { type: Number, default: 0 },
    blocked: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("StatsHourly", statsHourlySchema);