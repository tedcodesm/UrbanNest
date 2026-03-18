import express from "express";
import Property from "../models/Property.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/landlord", protect, async (req, res) => {
  try {
    const landlordId = req.user._id;

    const totalProperties = await Property.countDocuments({
      landlord: landlordId,
    });

    const availableProperties = await Property.countDocuments({
      landlord: landlordId,
      available: true,
    });

    const occupiedProperties = await Property.countDocuments({
      landlord: landlordId,
      available: false,
    });

    const incomeData = await Property.aggregate([
      {
        $match: { landlord: landlordId },
      },
      {
        $group: {
          _id: null,
          totalExpectedIncome: { $sum: "$price" },
        },
      },
    ]);

    const totalExpectedIncome =
      incomeData[0]?.totalExpectedIncome || 0;

    res.json({
      totalProperties,
      availableProperties,
      occupiedProperties,
      totalExpectedIncome,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching landlord analytics",
      error: error.message,
    });
  }
});

router.get("/landlord/daily-properties", protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const landlordId = req.user._id;

    const dailyData = await Property.aggregate([
      {
        $match: {
          landlord: landlordId,
          createdAt: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          propertiesCreated: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(dailyData);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching daily property stats",
      error: error.message,
    });
  }
});

export default router;