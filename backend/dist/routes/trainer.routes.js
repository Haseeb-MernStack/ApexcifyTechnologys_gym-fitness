"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin: create trainer user
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existing = await User_1.default.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already in use" });
        }
        const trainer = await User_1.default.create({ name, email, password, phone, role: "trainer" });
        return res.status(201).json({
            id: trainer._id,
            name: trainer.name,
            email: trainer.email,
            role: trainer.role,
            phone: trainer.phone,
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create trainer" });
    }
});
// Admin: list trainers
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (_req, res) => {
    const trainers = await User_1.default.find({ role: "trainer" }).select("name email phone role");
    return res.json(trainers);
});
// Trainer: get own profile
router.get("/me", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("trainer"), async (req, res) => {
    const user = req.user;
    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    });
});
exports.default = router;
//# sourceMappingURL=trainer.routes.js.map