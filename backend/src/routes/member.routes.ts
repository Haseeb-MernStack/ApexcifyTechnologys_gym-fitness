import { Router } from "express";
import User from "../models/User";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Get current member profile
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  return res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });
});

// Update own profile
router.patch("/me", authenticate, async (req: AuthRequest, res) => {
  const user = req.user!;
  const { name, phone } = req.body as { name?: string; phone?: string };

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;

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
router.get("/", authenticate, authorizeRoles("admin"), async (_req, res) => {
  const members = await User.find({ role: "member" }).select("name email phone role");
  return res.json(members);
});

export default router;
