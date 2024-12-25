import lifeScore from "../models/life.model.js";

export const getLifeScoreById = async (req, res) => {
  try {
    const { postOfficeId } = req.body;
    const ls = await lifeScore.find({ postOfficeId: postOfficeId });
    if (!ls) {
      res.status(400).json({ messgae: "Not found" });
    }
    res.status(200).json({ message: "Got the LifeScore", ls });
  } catch (error) {
    console.log(error);
  }
};
