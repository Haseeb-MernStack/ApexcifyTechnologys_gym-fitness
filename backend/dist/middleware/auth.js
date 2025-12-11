"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;
    if (!token) {
        return res.status(401).json({ message: "Missing auth token" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = { id: payload.id, role: payload.role };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
function authorize(roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map