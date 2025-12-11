import { Router } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { authenticate, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// Member/Admin/Trainer signup
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body as {
      name: string;
      email: string;
      password: string;
      role?: string;
      phone?: string;
    };

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: (role as any) || "member",
      phone,
    });

    const token = (jwt as any).sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body as { email: string; password: string };
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = (jwt as any).sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to login" });
  }
});

router.get("/me", authenticate, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  return res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

export default router;
