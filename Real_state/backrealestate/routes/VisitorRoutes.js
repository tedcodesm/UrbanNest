import express from "express";
import Visitor from "../models/Visitor.js";
import Property from "../models/Property.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/multer.js";
import cloudinary from "../lib/cloudinary.js";

const router = express.Router();

router.post(
  "/book",
  protect,
  upload.fields([
    { name: "idImage", maxCount: 1 },
    { name: "selfieImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { propertyId, visitDate, idNumber } = req.body;

      if (!propertyId || !visitDate) {
        return res.status(400).json({
          message: "Property and visit date required",
        });
      }

      const property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({
          message: "Property not found",
        });
      }

      if (!req.files?.idImage) {
        return res.status(400).json({
          message: "ID card image is required",
        });
      }

      const idUpload = await cloudinary.uploader.upload(
        req.files.idImage[0].path,
        { folder: "visitor_ids" },
      );

      let selfieUrl = null;

      if (req.files.selfieImage) {
        const selfieUpload = await cloudinary.uploader.upload(
          req.files.selfieImage[0].path,
          { folder: "visitor_selfies" },
        );

        selfieUrl = selfieUpload.secure_url;
      }

      const visitorRecord = await Visitor.create({
        property: propertyId,
        visitor: req.user._id,
        idImage: idUpload.secure_url,
        selfieImage: selfieUrl,
        idNumber,
        visitDate,
        verified: true,
      });

      res.status(201).json({
        message: "Visit booked successfully",
        visitorRecord,
      });
    } catch (error) {
      res.status(500).json({
        message: "Error booking visit",
        error: error.message,
      });
    }
  },
);

export default router;
