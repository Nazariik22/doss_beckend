import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateUserToken = (id) => {
    return jwt.sign({ _id: id }, 'mySuperSecretKey123456', { expiresIn: "30d" });
};

export const generateApiToken = () => {
    return crypto.randomBytes(24).toString("hex");
};