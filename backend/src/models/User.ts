import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type UserRole = "admin" | "trainer" | "member";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "trainer", "member"], default: "member" },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  const user = this as IUser;
  if (!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
});

userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
