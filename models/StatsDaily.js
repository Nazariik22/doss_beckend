import mongoose from "mongoose";

const statsDailySchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    date: { type: Date, required: true },
    requests: { type: Number, default: 0 },
    blocked: { type: Number, default: 0 },
    countries: { type: Map, of: Number, default: {} } ,
    uniqueIPs: { type: [String], default: [] }
}, { timestamps: true });

export default mongoose.model("StatsDaily", statsDailySchema);