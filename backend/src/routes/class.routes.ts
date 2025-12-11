import { Router } from "express";
import GymClass from "../models/GymClass";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Get all gym classes (public for members)
router.get("/", authenticate, async (_req, res) => {
  const classes = await GymClass.find().populate("trainer", "name email").sort({ startTime: 1 });
  res.json(classes);
});

// Admin / Trainer: create class
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "trainer"),
  async (req: AuthRequest, res) => {
    try {
      const { title, description, trainer, startTime, endTime, capacity } = req.body as {
        title: string;
        description?: string;
        trainer: string;
        startTime: string;
        endTime: string;
        capacity?: number;
      };

      const gymClass = await GymClass.create({
        title,
        description,
        trainer: trainer || req.user!._id,
        startTime,
        endTime,
        capacity,
      });

      res.status(201).json(gymClass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to create class" });
    }
  }
);

// Admin / Trainer: update class
router.patch(
  "/:id",
  authenticate,
  authorizeRoles("admin", "trainer"),
  async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const updates = req.body as Partial<{
        title: string;
        description: string;
        startTime: Date;
        endTime: Date;
        capacity: number;
      }>;

      const gymClass = await GymClass.findByIdAndUpdate(id, updates, { new: true });

      if (!gymClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      res.json(gymClass);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to update class" });
    }
  }
);

// Member: enroll in class
router.post("/:id/enroll", authenticate, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const gymClass = await GymClass.findById(id);

    if (!gymClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (gymClass.attendees.length >= gymClass.capacity) {
      return res.status(400).json({ message: "Class is full" });
    }

    const userId = req.user!._id;
    if (gymClass.attendees.includes(userId)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    gymClass.attendees.push(userId);
    await gymClass.save();

    res.json({ message: "Enrolled successfully", gymClass });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to enroll" });
  }
});

// Admin: delete class
router.delete("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const gymClass = await GymClass.findByIdAndDelete(id);

    if (!gymClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete class" });
  }
});

export default router;
