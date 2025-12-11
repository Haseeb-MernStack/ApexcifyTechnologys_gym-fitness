"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const GymClass_1 = __importDefault(require("../models/GymClass"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Get all gym classes (public for members)
router.get("/", auth_middleware_1.authenticate, async (_req, res) => {
    const classes = await GymClass_1.default.find().populate("trainer", "name email").sort({ startTime: 1 });
    res.json(classes);
});
// Admin / Trainer: create class
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin", "trainer"), async (req, res) => {
    try {
        const { title, description, trainer, startTime, endTime, capacity } = req.body;
        const gymClass = await GymClass_1.default.create({
            title,
            description,
            trainer: trainer || req.user._id,
            startTime,
            endTime,
            capacity,
        });
        res.status(201).json(gymClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create class" });
    }
});
// Admin / Trainer: update class
router.patch("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin", "trainer"), async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const gymClass = await GymClass_1.default.findByIdAndUpdate(id, updates, { new: true });
        if (!gymClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.json(gymClass);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to update class" });
    }
});
// Member: enroll in class
router.post("/:id/enroll", auth_middleware_1.authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const gymClass = await GymClass_1.default.findById(id);
        if (!gymClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        if (gymClass.attendees.length >= gymClass.capacity) {
            return res.status(400).json({ message: "Class is full" });
        }
        const userId = req.user._id;
        if (gymClass.attendees.includes(userId)) {
            return res.status(400).json({ message: "Already enrolled" });
        }
        gymClass.attendees.push(userId);
        await gymClass.save();
        res.json({ message: "Enrolled successfully", gymClass });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to enroll" });
    }
});
// Admin: delete class
router.delete("/:id", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (req, res) => {
    try {
        const { id } = req.params;
        const gymClass = await GymClass_1.default.findByIdAndDelete(id);
        if (!gymClass) {
            return res.status(404).json({ message: "Class not found" });
        }
        res.json({ message: "Class deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delete class" });
    }
});
exports.default = router;
//# sourceMappingURL=class.routes.js.map