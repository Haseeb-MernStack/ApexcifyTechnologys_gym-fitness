import { Router } from "express";
import Attendance from "../models/Attendance";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Admin/Trainer: mark attendance (manual or QR)
router.post("/", authenticate, authorizeRoles("admin", "trainer"), async (req, res) => {
  try {
    const { member, gymClass, date, status, method } = req.body as {
      member: string;
      gymClass: string;
      date: string;
      status?: string;
      method?: string;
    };

    const attendance = await Attendance.create({
      member,
      gymClass,
      date: date || new Date(),
      status: (status as any) || "present",
      method: (method as any) || "manual",
    });

    res.status(201).json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
});

// Admin/Trainer: get attendance by class
router.get("/class/:classId", authenticate, authorizeRoles("admin", "trainer"), async (req, res) => {
  const { classId } = req.params;
  const attendance = await Attendance.find({ gymClass: classId }).populate("member", "name email");
  res.json(attendance);
});

// Member: get own attendance
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const attendance = await Attendance.find({ member: req.user!._id }).populate(
    "gymClass",
    "title startTime"
  );
  res.json(attendance);
});

// Admin: get all attendance
router.get("/", authenticate, authorizeRoles("admin"), async (_req, res) => {
  const attendance = await Attendance.find()
    .populate("member", "name email")
    .populate("gymClass", "title startTime")
    .sort({ date: -1 });
  res.json(attendance);
});

export default router;
