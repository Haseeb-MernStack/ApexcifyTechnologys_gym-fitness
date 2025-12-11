import { Router } from "express";
import User from "../models/User";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Admin: create trainer user
router.post("/", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { name, email, password, phone } = req.body as {
      name: string;
      email: string;
      password: string;
      phone?: string;
    };

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const trainer = await User.create({ name, email, password, phone, role: "trainer" });
    return res.status(201).json({
      id: trainer._id,
      name: trainer.name,
      email: trainer.email,
      role: trainer.role,
      phone: trainer.phone,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create trainer" });
  }
});

// Admin: list trainers
router.get("/", authenticate, authorizeRoles("admin"), async (_req, res) => {
  const trainers = await User.find({ role: "trainer" }).select("name email phone role");
  return res.json(trainers);
});

// Trainer: get own profile
router.get("/me", authenticate, authorizeRoles("trainer"), async (req: AuthRequest, res) => {
  const user = req.user!;
  return res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
  });
});

export default router;
