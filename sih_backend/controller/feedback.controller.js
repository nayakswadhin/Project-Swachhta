import feedBackModel from "../models/feedback.model.js";

export const feedBack = async (req, res) => {
  try {
    const {
      cleanlinessRating,
      wasteManagementRating,
      energyConservation,
      greenPraticies,
      comment,
    } = req.body;
    const newFreedBack = await feedBackModel.create({
      cleanlinessRating,
      wasteManagementRating,
      energyConservation,
      greenPraticies,
      comment: comment ? comment : "",
    });
    if (newFreedBack) {
      res.status(200).json({ message: "Thank u for your feedback!!" });
    } else {
      res.status(400).json({ message: "error in creating new feedback" });
    }
  } catch (error) {
    console.log(error);
  }
};
