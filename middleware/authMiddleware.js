import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, 'mySuperSecretKey123456');
            req.user = await User.findById(decoded._id).select("-password");
            next();
        } catch (error) {
            return res.status(401).json({ message: "Не авторизовано" });
        }
    }
    if (!token) return res.status(401).json({ message: "Немає токену" });
};
