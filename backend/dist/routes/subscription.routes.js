"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Subscription_1 = __importDefault(require("../models/Subscription"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin: create subscription for a member
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (req, res) => {
    try {
        const { member, planName, price, status, provider, startDate, endDate, externalPaymentId } = req.body;
        const subscription = await Subscription_1.default.create({
            member,
            planName,
            price,
            status: status || "active",
            provider: provider || "stripe",
            startDate,
            endDate,
            externalPaymentId,
        });
        res.status(201).json(subscription);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create subscription" });
    }
});
// Member: get own subscriptions
router.get("/me", auth_middleware_1.authenticate, async (req, res) => {
    const subscriptions = await Subscription_1.default.find({ member: req.user._id }).sort({ createdAt: -1 });
    res.json(subscriptions);
});
// Admin: list all subscriptions
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (_req, res) => {
    const subscriptions = await Subscription_1.default.find().populate("member", "name email").sort({
        createdAt: -1,
    });
    res.json(subscriptions);
});
// Admin: update subscription
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const subscription = await Subscription_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }
        res.json(subscription);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update subscription" });
    }
});
exports.default = router;
//# sourceMappingURL=subscription.routes.js.map