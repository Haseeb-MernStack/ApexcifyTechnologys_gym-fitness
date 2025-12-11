import mongoose, { Document, Schema, Types } from "mongoose";

export type PlanType = "workout" | "diet";

export interface IPlan extends Document {
  member: Types.ObjectId;
  trainer: Types.ObjectId;
  type: PlanType;
  title: string;
  description?: string;
  fileUrl?: string; // could be a PDF/image link stored in cloud
}

const planSchema = new Schema<IPlan>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["workout", "diet"], required: true },
    title: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String },
  },
  { timestamps: true }
);

const Plan = mongoose.models.Plan || mongoose.model<IPlan>("Plan", planSchema);

export default Plan;
