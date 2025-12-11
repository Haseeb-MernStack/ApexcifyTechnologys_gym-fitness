"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get current member profile
router.get("/me", auth_middleware_1.authenticate, async (req, res) => {
    const user = req.user;
    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    });
});
// Update own profile
router.patch("/me", auth_middleware_1.authenticate, async (req, res) => {
    const user = req.user;
    const { name, phone } = req.body;
    if (name !== undefined)
        user.name = name;
    if (phone !== undefined)
        user.phone = phone;
    await user.save();
    return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
    });
});
// Admin: list all members
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (_req, res) => {
    const members = await User_1.default.find({ role: "member" }).select("name email phone role");
    return res.json(members);
});
exports.default = router;
//# sourceMappingURL=member.routes.js.map