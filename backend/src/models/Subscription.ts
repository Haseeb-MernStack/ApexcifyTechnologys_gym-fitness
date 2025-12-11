import mongoose, { Document, Schema, Types } from "mongoose";

export type SubscriptionStatus = "active" | "expired" | "pending" | "cancelled";
export type PaymentProvider = "stripe" | "paypal" | "cash";

export interface ISubscription extends Document {
  member: Types.ObjectId;
  planName: string;
  price: number;
  status: SubscriptionStatus;
  provider: PaymentProvider;
  externalPaymentId?: string; // Stripe/PayPal payment or subscription id
  startDate: Date;
  endDate: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    member: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planName: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "expired", "pending", "cancelled"],
      default: "pending",
    },
    provider: { type: String, enum: ["stripe", "paypal", "cash"], default: "stripe" },
    externalPaymentId: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", subscriptionSchema);

export default Subscription;
