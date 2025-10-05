import mongoose from "mongoose";

const siteSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    domain: { type: String, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: false },
    protectionLevel: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    rateLimit: { type: Number, default: 100 },
    autoBlock: { type: Boolean, default: false },
    blockedCountries: { type: [String], default: [] },
    integration: { type: String, enum: ["js", "middleware"], default: "js" },
    token: { type: String, required: true }
}, { timestamps: true });


export default mongoose.model("Site", siteSchema);