"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Attendance_1 = __importDefault(require("../models/Attendance"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Admin/Trainer: mark attendance (manual or QR)
router.post("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin", "trainer"), async (req, res) => {
    try {
        const { member, gymClass, date, status, method } = req.body;
        const attendance = await Attendance_1.default.create({
            member,
            gymClass,
            date: date || new Date(),
            status: status || "present",
            method: method || "manual",
        });
        res.status(201).json(attendance);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to mark attendance" });
    }
});
// Admin/Trainer: get attendance by class
router.get("/class/:classId", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin", "trainer"), async (req, res) => {
    const { classId } = req.params;
    const attendance = await Attendance_1.default.find({ gymClass: classId }).populate("member", "name email");
    res.json(attendance);
});
// Member: get own attendance
router.get("/me", auth_middleware_1.authenticate, async (req, res) => {
    const attendance = await Attendance_1.default.find({ member: req.user._id }).populate("gymClass", "title startTime");
    res.json(attendance);
});
// Admin: get all attendance
router.get("/", auth_middleware_1.authenticate, (0, auth_middleware_1.authorizeRoles)("admin"), async (_req, res) => {
    const attendance = await Attendance_1.default.find()
        .populate("member", "name email")
        .populate("gymClass", "title startTime")
        .sort({ date: -1 });
    res.json(attendance);
});
exports.default = router;
//# sourceMappingURL=attendance.routes.js.map