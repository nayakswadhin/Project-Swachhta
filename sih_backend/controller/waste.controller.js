import { Waste } from "../models/waste.model.js";
import { PostOffice } from "../models/postOffice.model.js";


export const getInfo = async (req, res) => {
  try {
    // Get the latest 10 waste records, sorted by date in descending order
    const notifications = await Waste.find()
      .sort({ date: -1 })
      .limit(10)
      .populate('postOfficeId', 'name location') // Populate post office details
      .lean();

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No waste records found"
      });
    }

    // Format the response data
    const formattedNotifications = notifications.map(notification => ({
      id: notification._id,
      date: notification.date,
      type: notification.type,
      size: notification.size,
      isAccidentProne: notification.isAccidentProne,
      location: {
        latitude: notification.latitude,
        longitude: notification.longitude
      },
      postOffice: notification.postOfficeId,
      photoLink: notification.photoLink,
      isRead: notification.isRead
    }));

    return res.status(200).json({
      success: true,
      message: "Waste notifications retrieved successfully",
      data: formattedNotifications
    });
  } catch (error) {
    console.error("Error in getInfo:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

export const wasteManagement = async (req, res) => {
  try {
    const {
      postOfficeId,
      type,
      isAccidentProne,
      size,
      longitude,
      latitude,
      photoLink,
    } = req.body;

    if (!postOfficeId) {
      return res.status(400).json({
        success: false,
        message: "postOfficeId is required",
      });
    }
    if (!type) {
      return res.status(400).json({
        success: false,
        message: "type is required",
      });
    }
    if (!size) {
      return res.status(400).json({
        success: false,
        message: "size is required",
      });
    }
    if (!photoLink) {
      return res.status(400).json({
        success: false,
        message: "photoLink is required",
      });
    }

    const currentDateTime = new Date();
    const postOffice = await PostOffice.findById(postOfficeId);

    if (!postOffice) {
      return res.status(404).json({
        success: false,
        message: "Post Office not found",
      });
    }

    const waste = await Waste.create({
      date: currentDateTime,
      type,
      isAccidentProne,
      size,
      longitude,
      latitude,
      postOfficeId,
      photoLink,
      isRead: false
    });

    await PostOffice.findByIdAndUpdate(
      postOfficeId,
      {
        $push: { photoLinks: photoLink },
      },
      { new: true }
    );

 
    console.log(waste);

    return res.status(201).json({
      success: true,
      message: "Waste record created successfully",
      data: waste,
    });
  } catch (error) {
    console.error("Error in wasteManagement:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const waste = await Waste.findById(id);
    if (!waste) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    waste.isRead = true;
    await waste.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
      data: waste
    });
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};