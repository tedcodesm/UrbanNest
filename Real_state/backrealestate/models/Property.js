import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    coordinates: {
      lat: {
        type: Number,
        required: true,
      },
      lng: {
        type: Number,
        required: true,
      },
    },

    price: {
      type: Number,
      required: true,
    },
    propertytype: {
      type: String,
      enum: ["Rent", "Sale"],

      required: true,
    },
    category: {
      type: String,
      enum: ["Apartment", "House", "Studio"],

      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    amenities: [String],
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: [String],
    available: {
      type: Boolean,
      default: true,
    },
    securityScore: {
      type: Number,
      default: 5, // Default to a neutral/good score
    },
    securityDetails: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

export default mongoose.model("Property", propertySchema);
