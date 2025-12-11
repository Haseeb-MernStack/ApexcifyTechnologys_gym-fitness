"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Plan_1 = __importDefault(require("../models/Plan"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Trainer: create a plan for a member
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("trainer", "admin"), async (req, res) => {
    try {
        const { member, type, title, description, fileUrl } = req.body;
        const plan = await Plan_1.default.create({
            member,
            trainer: req.user._id,
            type,
            title,
            description,
            fileUrl,
        });
        res.status(201).json(plan);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create plan" });
    }
});
// Member: get own plans
router.get("/me", auth_middleware_1.authenticate, async (req, res) => {
    const plans = await Plan_1.default.find({ member: req.user._id }).populate("trainer", "name email");
    res.json(plans);
});
// Trainer: get plans created by self
router.get("/trainer/me", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("trainer"), async (req, res) => {
    const plans = await Plan_1.default.find({ trainer: req.user._id }).populate("member", "name email");
    res.json(plans);
});
// Admin: get all plans
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (_req, res) => {
    const plans = await Plan_1.default.find()
        .populate("member", "name email")
        .populate("trainer", "name email");
    res.json(plans);
});
// Trainer/Admin: delete plan
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("trainer", "admin"), async (req, res) => {
    try {
        const plan = await Plan_1.default.findByIdAndDelete(req.params.id);
        if (!plan) {
            return res.status(404).json({ message: "Plan not found" });
        }
        res.json({ message: "Plan deleted" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete plan" });
    }
});
exports.default = router;
//# sourceMappingURL=plan.routes.js.map