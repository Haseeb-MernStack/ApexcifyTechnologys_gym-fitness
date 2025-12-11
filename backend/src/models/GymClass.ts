import mongoose, { Document, Schema, Types } from "mongoose";

export interface IGymClass extends Document {
  title: string;
  description?: string;
  trainer: Types.ObjectId;
  startTime: Date;
  endTime: Date;
  capacity: number;
  attendees: Types.ObjectId[];
}

const gymClassSchema = new Schema<IGymClass>(
  {
    title: { type: String, required: true },
    description: { type: String },
    trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    capacity: { type: Number, default: 20 },
    attendees: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const GymClass = mongoose.models.GymClass || mongoose.model<IGymClass>("GymClass", gymClassSchema);

export default GymClass;
