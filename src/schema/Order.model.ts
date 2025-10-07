import mongoose, { Schema } from "mongoose";
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../libs/enums/order.enum";

const orderSchema = new Schema(
  {
    memberId: {
      type: Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },

    orderTotal: {
      type: Number,
      required: true,
    },

    orderDelivery: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      default: PaymentMethod.CARD,
    },

    paymentStatus: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
    },

    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
  },
  { timestamps: true, collection: "orders" }
);

export default mongoose.model("Order", orderSchema);
