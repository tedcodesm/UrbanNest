import mongoose from "mongoose";

const visitorSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    idImage: {
      type: String,
      required: true,
    },
    selfieImage: {
      type: String,
    },
    idNumber: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    visitDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Visitor", visitorSchema);