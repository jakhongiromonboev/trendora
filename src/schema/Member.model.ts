import mongoose, { Schema } from "mongoose";
import {
  AuthProvider,
  MemberStatus,
  MemberType,
} from "../libs/enums/member.enum";

const memberSchema = new Schema(
  {
    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.USER,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberNick: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPhone: {
      type: String,
      index: { unique: true, sparse: true },
      required: true,
    },

    memberPassword: {
      type: String,
      required: true,
      select: false,
    },

    memberAddress: {
      type: String,
    },

    memberEmail: {
      type: String,
      required: false, // later will be required
      index: { unique: true, sparse: true },
    },

    memberImage: {
      type: String,
    },

    memberPoints: {
      type: Number,
      default: 0,
    },

    passwordResetToken: {
      type: String,
    },

    passwordResetExpires: {
      type: Number,
    },

    authProvider: {
      type: String,
      enum: AuthProvider,
      default: AuthProvider.LOCAL,
    },
  },
  { timestamps: true, collection: "members" }
);

export default mongoose.model("Member", memberSchema);
