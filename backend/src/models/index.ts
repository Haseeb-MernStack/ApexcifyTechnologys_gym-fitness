import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole = "ADMIN" | "TRAINER" | "MEMBER";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["ADMIN", "TRAINER", "MEMBER"], default: "MEMBER" },
    phone: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export interface ITrainer extends Document {
  user: mongoose.Types.ObjectId;
  specialties: string[];
  bio?: string;
}

const trainerSchema = new Schema<ITrainer>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialties: [{ type: String }],
    bio: String,
  },
  { timestamps: true }
);

export const Trainer: Model<ITrainer> =
  mongoose.models.Trainer || mongoose.model<ITrainer>("Trainer", trainerSchema);

export interface IClass extends Document {
  name: string;
  description?: string;
  trainer: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  capacity: number;
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    description: String,
    trainer: { type: Schema.Types.ObjectId, ref: "Trainer", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 20 },
  },
  { timestamps: true }
);

export const ClassModel: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", classSchema);

export interface ISubscription extends Document {
  member: mongoose.Types.ObjectId;
  planName: string;
  amount: number;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: Date;
  endDate: Date;
  paymentProvider?: "STRIPE" | "PAYPAL" | "CASH";
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
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
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export interface IAttendance extends Document {
  member: mongoose.Types.ObjectId;
  class?: mongoose.Types.ObjectId;
  checkInTime: Date;
  method: "MANUAL" | "QR";
}

const attendanceSchema = new Schema<IAttendance>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    class: { type: Schema.Types.ObjectId, ref: "Class" },
    checkInTime: { type: Date, default: Date.now },
    method: { type: String, enum: ["MANUAL", "QR"], default: "MANUAL" },
  },
  { timestamps: true }
);

export const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", attendanceSchema);

export interface IPlanBase extends Document {
  member: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fileUrl?: string; // could be used later for uploads
}

const planBaseFields = {
  member: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: String,
  fileUrl: String,
};

const workoutPlanSchema = new Schema<IPlanBase>(planBaseFields, { timestamps: true });
const dietPlanSchema = new Schema<IPlanBase>(planBaseFields, { timestamps: true });

export const WorkoutPlan: Model<IPlanBase> =
  mongoose.models.WorkoutPlan ||
  mongoose.model<IPlanBase>("WorkoutPlan", workoutPlanSchema);

export const DietPlan: Model<IPlanBase> =
  mongoose.models.DietPlan || mongoose.model<IPlanBase>("DietPlan", dietPlanSchema);
