import { DataModel } from "../models/data.model.js";

export const getData = async (req, res) => {
  try {
    const data = await DataModel.find(); // Retrieve all documents
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
