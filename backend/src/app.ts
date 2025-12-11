import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import memberRoutes from "./routes/member.routes";
import trainerRoutes from "./routes/trainer.routes";
import classRoutes from "./routes/class.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import attendanceRoutes from "./routes/attendance.routes";
import planRoutes from "./routes/plan.routes";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/trainers", trainerRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/plans", planRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

export default app;
