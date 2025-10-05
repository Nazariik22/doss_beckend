import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import siteRoutes from "./routes/siteRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import ipRoutes from "./routes/ipRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();


connectDB();


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
    if (req.path === "/protect.js") {
        res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    }
    next();
});
app.use(express.static(path.join(__dirname, "public")));


app.use("/api/auth", authRoutes);
app.use("/api/sites", siteRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/logs", logRoutes);
app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
