"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DietPlan = exports.WorkoutPlan = exports.Attendance = exports.Subscription = exports.ClassModel = exports.Trainer = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const userSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "TRAINER", "MEMBER"], default: "MEMBER" },
    phone: { type: String },
}, { timestamps: { createdAt: true, updatedAt: true } });
exports.User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
const trainerSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialties: [{ type: String }],
    bio: String,
}, { timestamps: true });
exports.Trainer = mongoose_1.default.models.Trainer || mongoose_1.default.model("Trainer", trainerSchema);
const classSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    trainer: { type: mongoose_1.Schema.Types.ObjectId, ref: "Trainer", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 20 },
}, { timestamps: true });
exports.ClassModel = mongoose_1.default.models.Class || mongoose_1.default.model("Class", classSchema);
const subscriptionSchema = new mongoose_1.Schema({
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
        type: String,
        enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
        default: "ACTIVE",
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    paymentProvider: { type: String, enum: ["STRIPE", "PAYPAL", "CASH"], default: "CASH" },
}, { timestamps: true });
exports.Subscription = mongoose_1.default.models.Subscription ||
    mongoose_1.default.model("Subscription", subscriptionSchema);
const attendanceSchema = new mongoose_1.Schema({
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    class: { type: mongoose_1.Schema.Types.ObjectId, ref: "Class" },
    checkInTime: { type: Date, default: Date.now },
    method: { type: String, enum: ["MANUAL", "QR"], default: "MANUAL" },
}, { timestamps: true });
exports.Attendance = mongoose_1.default.models.Attendance ||
    mongoose_1.default.model("Attendance", attendanceSchema);
const planBaseFields = {
    member: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    fileUrl: String,
};
const workoutPlanSchema = new mongoose_1.Schema(planBaseFields, { timestamps: true });
const dietPlanSchema = new mongoose_1.Schema(planBaseFields, { timestamps: true });
exports.WorkoutPlan = mongoose_1.default.models.WorkoutPlan ||
    mongoose_1.default.model("WorkoutPlan", workoutPlanSchema);
exports.DietPlan = mongoose_1.default.models.DietPlan || mongoose_1.default.model("DietPlan", dietPlanSchema);
//# sourceMappingURL=index.js.map