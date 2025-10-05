import mongoose from "mongoose";

const suspiciousIPSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    ip: { type: String, required: true },
    reason: { type: String },
    requestCount: { type: Number, default: 0 },
    lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

suspiciousIPSchema.index({ user: 1, site: 1, ip: 1 }, { unique: true });

export default mongoose.model("SuspiciousIP", suspiciousIPSchema);