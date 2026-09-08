const { GoogleGenAI } = require("@google/generative-ai");
const Restaurant = require("../models/Restaurant");

// Gemini API ko key ke sath initialize karein
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @desc    Get AI-powered restaurant recommendations
// @route   POST /api/ai/recommend
exports.getRecommendations = async (req, res) => {
  try {
    const { cuisine, location, partySize, userPreference } = req.body;

    // 1. MongoDB se saare approved restaurants ka data nikalein
    const restaurants = await Restaurant.find({ status: "approved" });

    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Database mein koi bhi restaurant maujud nahi hai.",
      });
    }

    // 2. Data ko clean stringify karein taake Gemini ko context diya ja sake
    const restaurantContext = restaurants.map((r) => ({
      id: r._id,
      name: r.name,
      cuisine: r.cuisine,
      address: r.address,
      description: r.description,
    }));

    // 3. Gemini ke liye ek strict prompt design karein
    const systemPrompt = `
        You are an expert Restaurant Recommendation Assistant. 
        Analyze the following list of available restaurants from our database:
        ${JSON.stringify(restaurantContext)}

        Based on the User's Criteria:
        - Preferred Cuisine: ${cuisine || "Any"}
        - Preferred Location/Area: ${location || "Any"}
        - Party Size: ${partySize || "Any"}
        - Special Preferences: ${userPreference || "None"}

        Your Task:
        Rank and recommend the best matching restaurants from the provided list. 
        Strict Rules:
        1. Only recommend restaurants that exist in the provided database list. Do not make up fake restaurants.
        2. Do not attempt to book or confirm a table directly.
        3. Respond ONLY with a clean JSON array of recommended restaurants. Each object in the array must contain: "id", "name", "reasonForRecommendation".
        `;

    // 4. Gemini 2.5 Flash model ko call karein (Fast and JSON friendly)
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: systemPrompt,
      config: {
        // Ensure output is in JSON format
        responseMimeType: "application/json",
      },
    });

    // 5. AI ka response parse karke customer ko bhej dein
    const aiResponseText = response.text;
    const recommendations = JSON.parse(aiResponseText);

    res.json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gemini AI recommendation failed",
      error: error.message,
    });
  }
};
