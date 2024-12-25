import { GoogleGenerativeAI } from "@google/generative-ai";

export const getGemini = async (req, res) => {
  try {
    const { question } = req.body;
    const genAI = new GoogleGenerativeAI(
      "AIzaSyA7C9TBeb9t6FsCOJ-q0K1TBGBmzu3sx0A"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain how AI works";

    const result = await model.generateContent(question);

    if (result) {
      res.status(200).json({ message: result.response.text() });
    } else {
      res.status(400).json({ message: error });
    }
  } catch (error) {
    console.log(error);
  }
};
