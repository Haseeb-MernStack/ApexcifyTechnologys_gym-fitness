"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
// Member/Admin/Trainer signup
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }
        const user = await User_1.default.create({
            name,
            email,
            password,
            role: role || "member",
            phone,
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to register" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to login" });
    }
});
router.get("/me", auth_middleware_1.authenticate, (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
    }
    return res.json({
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map