const { GoogleGenerativeAI } = require("@google/generative-ai");
const Restaurant = require("../models/Restaurant");

// Valid Gemini models
const PRIMARY_MODEL = "gemini-1.5-flash";

const normalizeText = (value = "") => value.toLowerCase().trim();

const matchesLocation = (address = "", location = "") => {
  const normalizedAddress = normalizeText(address);
  const normalizedLocation = normalizeText(location);

  if (!normalizedLocation) return true;
  return normalizedAddress.includes(normalizedLocation);
};

const buildFallbackRecommendations = (restaurants, filters) => {
  const queryCuisine = normalizeText(filters.cuisine || "");
  const queryLocation = normalizeText(filters.location || "");
  const partySize = Number(filters.partySize) || 0;

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisineMatch = queryCuisine
      ? normalizeText(restaurant.cuisine || "").includes(queryCuisine)
      : true;
    const locationMatch = matchesLocation(restaurant.address, queryLocation);
    return cuisineMatch && locationMatch;
  });

  const scored = filteredRestaurants
    .map((restaurant) => {
      const cuisineMatch = restaurant.cuisine
        ? normalizeText(restaurant.cuisine).includes(queryCuisine)
        : false;
      const locationMatch = matchesLocation(restaurant.address, queryLocation);
      const text = `${restaurant.name} ${restaurant.description || ""} ${
        restaurant.cuisine || ""
      } ${restaurant.address || ""}`.toLowerCase();
      const preferenceMatch =
        filters.userPreference || ""
          ? text.includes(normalizeText(filters.userPreference || ""))
          : false;

      let score = 0;
      if (queryCuisine && cuisineMatch) score += 4;
      if (queryLocation && locationMatch) score += 3;
      if (preferenceMatch) score += 2;
      if (partySize && restaurant.capacity)
        score += restaurant.capacity >= partySize ? 2 : 0;
      if (!queryCuisine && !queryLocation) score += 1;

      return { restaurant, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(({ restaurant }) => ({
    id: restaurant._id.toString(),
    name: restaurant.name,
    reasonForRecommendation: `Matches your dining preferences and is located in ${restaurant.address}. Ideal for ${
      restaurant.cuisine
    } cuisine and a group of ${partySize || "flexible size"} guests.`,
  }));
};

const getLocationFilteredRestaurants = (restaurants, location) => {
  if (!normalizeText(location)) return restaurants;

  return restaurants.filter((restaurant) =>
    matchesLocation(restaurant.address, location),
  );
};

const filterRecommendationsByLocation = (
  recommendations,
  restaurants,
  location,
) => {
  const items = Array.isArray(recommendations)
    ? recommendations
    : recommendations
      ? [recommendations]
      : [];

  if (!normalizeText(location)) return items.filter(Boolean);

  const validIds = new Set(
    getLocationFilteredRestaurants(restaurants, location).map((restaurant) =>
      restaurant._id.toString(),
    ),
  );

  return items.filter((item) => {
    if (!item || !item.id) return false;
    return validIds.has(String(item.id));
  });
};

exports.getRecommendations = async (req, res) => {
  try {
    const { cuisine, location, partySize, userPreference } = req.body;

    const restaurants = await Restaurant.find({ status: "approved" });

    if (!restaurants || restaurants.length === 0) {
      return res.json({
        success: true,
        data: [],
        message:
          "No certified matching hotels active inside the cluster mappings.",
      });
    }

    const locationFilteredRestaurants = getLocationFilteredRestaurants(
      restaurants,
      location,
    );

    if (location && locationFilteredRestaurants.length === 0) {
      return res.json({
        success: true,
        data: [],
        message: `No approved restaurants found in ${location}.`,
      });
    }

    // Check GEMINI_API_KEY before making external network call
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }

    const textDataCluster = locationFilteredRestaurants
      .map(
        (r) =>
          `Restaurant ID: ${r._id.toString()} | Name: ${r.name} | Cuisine Type: ${
            r.cuisine
          } | Location: ${r.address} | Meta Description: ${r.description}`,
      )
      .join("\n");

    const primaryInstruction =
      "You are a Dining Concierge Bot. Filter and recommend matching items from the dataset string below. Return ONLY a valid JSON array matching the query specs. Never include markdown backticks or block specifiers like ```json. Each result item object structure must exactly have keys: 'id', 'name', 'reasonForRecommendation'. Hard rule: if a location is specified, only recommend restaurants whose address contains that exact city or region. If no exact match exists, return an empty array [] without recommending other cities.";

    const dynamicQueryPrompt =
      "Dataset Inventory Available List Nodes:\n" +
      textDataCluster +
      "\n\nCustomer Requirements Requested Filtering Criteria:" +
      "\n- Wanted Cuisine Model: " +
      (cuisine || "Any") +
      "\n- Wanted Location Region: " +
      (location || "Any") +
      "\n- Party Size Seats Count: " +
      (partySize || "Any") +
      "\n- Flavor Ambiance Preference Notes: " +
      (userPreference || "None");

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: PRIMARY_MODEL,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent([
      primaryInstruction,
      dynamicQueryPrompt,
    ]);
    const response = await result.response;
    let aiResponseText = response.text().trim();

    if (aiResponseText.startsWith("```")) {
      aiResponseText = aiResponseText.replace(/```json|```/g, "").trim();
    }

    const parsedRecommendations = JSON.parse(aiResponseText);
    const validRecommendations = filterRecommendationsByLocation(
      parsedRecommendations,
      restaurants,
      location,
    );

    return res.json({
      success: true,
      data: validRecommendations,
      message:
        validRecommendations.length === 0 && location
          ? `No approved restaurants found in ${location}.`
          : undefined,
    });
  } catch (error) {
    console.error("Gemini API Error Trace:", error.message);

    const fallback = buildFallbackRecommendations(
      await Restaurant.find({ status: "approved" }),
      req.body || {},
    );

    if (fallback.length > 0) {
      return res.json({
        success: true,
        data: fallback,
        message:
          "Returned best matching restaurants based on your preferences.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Gemini AI recommendation failed",
      error: error.message,
    });
  }
};

module.exports = {
  getRecommendations: exports.getRecommendations,
  buildFallbackRecommendations,
};
