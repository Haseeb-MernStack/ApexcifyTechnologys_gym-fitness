import { Router } from "express";
import Subscription from "../models/Subscription";
import { authenticate, authorizeRoles, AuthRequest } from "../middleware/auth.middleware";

const router = Router();

// Admin: create subscription for a member
router.post("/", authenticate, authorizeRoles("admin"), async (req: AuthRequest, res) => {
  try {
    const { member, planName, price, status, provider, startDate, endDate, externalPaymentId } =
      req.body as {
        member: string;
        planName: string;
        price: number;
        status?: string;
        provider?: string;
        startDate: string;
        endDate: string;
        externalPaymentId?: string;
      };

    const subscription = await Subscription.create({
      member,
      planName,
      price,
      status: (status as any) || "active",
      provider: (provider as any) || "stripe",
      startDate,
      endDate,
      externalPaymentId,
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create subscription" });
  }
});

// Member: get own subscriptions
router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const subscriptions = await Subscription.find({ member: req.user!._id }).sort({ createdAt: -1 });
  res.json(subscriptions);
});

// Admin: list all subscriptions
router.get("/", authenticate, authorizeRoles("admin"), async (_req, res) => {
  const subscriptions = await Subscription.find().populate("member", "name email").sort({
    createdAt: -1,
  });
  res.json(subscriptions);
});

// Admin: update subscription
router.patch("/:id", authenticate, authorizeRoles("admin"), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body as Partial<{
      status: string;
      endDate: Date;
      externalPaymentId: string;
    }>;

    const subscription = await Subscription.findByIdAndUpdate(id, updates, { new: true });

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update subscription" });
  }
});

export default router;
