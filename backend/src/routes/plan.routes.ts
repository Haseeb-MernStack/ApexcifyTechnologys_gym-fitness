import { Router } from "express";
import Plan from "../models/Plan";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Trainer: create a plan for a member
router.post("/", authenticate, authorizeRoles("trainer", "admin"), async (req: AuthRequest, res) => {
  try {
    const { member, type, title, description, fileUrl } = req.body as {
      member: string;
      type: "workout" | "diet";
      title: string;
      description?: string;
      fileUrl?: string;
    };

    const plan = await Plan.create({
      member,
      trainer: req.user!._id,
      type,
      title,
      description,
      fileUrl,
    });

    res.status(201).json(plan);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create plan" });
  }
});

// Member: get own plans
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const plans = await Plan.find({ member: req.user!._id }).populate("trainer", "name email");
  res.json(plans);
});

// Trainer: get plans created by self
router.get("/trainer/me", authenticate, authorizeRoles("trainer"), async (req: AuthRequest, res) => {
  const plans = await Plan.find({ trainer: req.user!._id }).populate("member", "name email");
  res.json(plans);
});

// Admin: get all plans
router.get("/", authenticate, authorizeRoles("admin"), async (_req, res) => {
  const plans = await Plan.find()
    .populate("member", "name email")
    .populate("trainer", "name email");
  res.json(plans);
});

// Trainer/Admin: delete plan
router.delete("/:id", authenticate, authorizeRoles("trainer", "admin"), async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }
    res.json({ message: "Plan deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete plan" });
  }
});

export default router;
