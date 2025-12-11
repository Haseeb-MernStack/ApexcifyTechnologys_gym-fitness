"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const member_routes_1 = __importDefault(require("./routes/member.routes"));
const trainer_routes_1 = __importDefault(require("./routes/trainer.routes"));
const class_routes_1 = __importDefault(require("./routes/class.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
const attendance_routes_1 = __importDefault(require("./routes/attendance.routes"));
const plan_routes_1 = __importDefault(require("./routes/plan.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/members", member_routes_1.default);
app.use("/api/trainers", trainer_routes_1.default);
app.use("/api/classes", class_routes_1.default);
app.use("/api/subscriptions", subscription_routes_1.default);
app.use("/api/attendance", attendance_routes_1.default);
app.use("/api/plans", plan_routes_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map