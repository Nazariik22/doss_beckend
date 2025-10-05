import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    ip: { type: String, required: true },
    country: { type: String }, // ✅ ДОДАНО
    endpoint: { type: String },
    method: { type: String },
    statusCode: { type: Number },
    blocked: { type: Boolean, default: false },
    userAgent: { type: String }
}, { timestamps: true });

export default mongoose.model("Log", logSchema);