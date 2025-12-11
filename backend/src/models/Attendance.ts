import mongoose, { Document, Schema, Types } from "mongoose";

export type AttendanceStatus = "present" | "absent";

export interface IAttendance extends Document {
  member: Types.ObjectId;
  gymClass: Types.ObjectId;
  date: Date;
  status: AttendanceStatus;
  method: "manual" | "qr";
}

const attendanceSchema = new Schema<IAttendance>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    gymClass: { type: Schema.Types.ObjectId, ref: "GymClass", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["present", "absent"], default: "present" },
    method: { type: String, enum: ["manual", "qr"], default: "manual" },
  },
  { timestamps: true }
);

const Attendance =
  mongoose.models.Attendance || mongoose.model<IAttendance>("Attendance", attendanceSchema);

export default Attendance;
