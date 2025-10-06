import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductColor,
  ProductStatus,
  ProductGender,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PROCESS,
    },
    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },
    productName: {
      type: String,
      required: true,
      index: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productLeftCount: {
      type: Number,
      default: 0,
      required: true,
    },
    productSize: {
      type: String,
      enum: ProductSize,
      required: true,
    },
    productColor: {
      type: String,
      enum: ProductColor,
      required: true,
    },
    productGender: {
      type: String,
      enum: ProductGender,
      required: true,
    },
    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      default: [],
    },
    productViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Prevent duplicate product variants including gender
productSchema.index(
  { productName: 1, productSize: 1, productColor: 1, productGender: 1 },
  { unique: true }
);

export default mongoose.model("Product", productSchema);
