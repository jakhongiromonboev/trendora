import mongoose, { Schema } from "mongoose";
import {
  ProductCollection,
  ProductSize,
  ProductStatus,
  ProductGender,
  ProductShoeSize,
} from "../libs/enums/product.enum";

const productSchema = new Schema(
  {
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.PAUSE,
    },

    productCollection: {
      type: String,
      enum: ProductCollection,
      required: true,
    },

    productName: {
      type: String,
      required: true,
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
      // required: true,
    },

    productShoeSize: {
      type: String,
      enum: ProductShoeSize,
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

// For clothes
productSchema.index(
  { productName: 1, productSize: 1, productGender: 1 },
  {
    unique: true,
    partialFilterExpression: { productSize: { $exists: true } },
  }
);

// For shoes
productSchema.index(
  { productName: 1, productShoeSize: 1, productGender: 1 },
  {
    unique: true,
    partialFilterExpression: { productShoeSize: { $exists: true } },
  }
);

export default mongoose.model("Product", productSchema);
