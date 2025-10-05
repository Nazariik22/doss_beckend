import mongoose from "mongoose";

const blockedIPSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    ip: { type: String, required: true },
    country: { type: String },               
    requestCount: { type: Number, default: 0 },
    lastSeen: { type: Date },              
    reason: { type: String },
    blockedAt: { type: Date, default: Date.now }
}, { timestamps: true });

blockedIPSchema.index({ user: 1, site: 1, ip: 1 }, { unique: true });

export default mongoose.model("BlockedIP", blockedIPSchema);
