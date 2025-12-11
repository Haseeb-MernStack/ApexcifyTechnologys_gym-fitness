"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromHeader = authHeader?.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : undefined;
        const token = tokenFromHeader || req.cookies?.token;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await User_1.default.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.middleware.js.map