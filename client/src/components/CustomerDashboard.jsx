import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context.jsx";

export default function CustomerDashboard() {
  const { token } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [aiPreferences, setAiPreferences] = useState({
    cuisine: "",
    location: "",
    partySize: "",
    userPreference: "",
  });
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  // 1. Fetch Approved Restaurants
  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRestaurants(data.data);
      })
      .catch((err) => console.error("Error fetching restaurants:", err));
  }, []);

  // 2. Gemini AI Assistant Click Trigger Handler
  const handleAiRecommendation = async (e) => {
    e.preventDefault();
    setLoadingAi(true);
    setAiMessage("");
    setAiRecommendations([]);

    try {
      const response = await fetch("http://localhost:5000/api/ai/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(aiPreferences),
      });
      const data = await response.json();

      if (data.success && data.data.length > 0) {
        setAiRecommendations(data.data);
      } else {
        setAiMessage(
          data.message ||
            "No specific matches found by Gemini matching your keywords.",
        );
      }
    } catch (error) {
      setAiMessage(
        "Could not establish connection with Gemini Endpoint server.",
      );
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-10 mt-4">
      {/*  Professional Emerald Gradient AI Assistant Section */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 text-white shadow-xl border border-emerald-950">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-extrabold mb-1 text-white tracking-tight flex items-center gap-2">
            ✨ Gemini Concierge Assistant
          </h2>
          <p className="text-emerald-100 text-sm mb-6 font-medium">
            Describe your fine dining mood context. Our conversational machine
            algorithm targets ideal table schemas.
          </p>
        </div>

        <form
          onSubmit={handleAiRecommendation}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-emerald-950/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md"
        >
          <input
            type="text"
            placeholder="Cuisine (e.g. Desi, Italian)"
            value={aiPreferences.cuisine}
            onChange={(e) =>
              setAiPreferences({ ...aiPreferences, cuisine: e.target.value })
            }
            className="bg-white text-gray-800 px-4 py-3 rounded-xl outline-none placeholder:text-gray-400 text-sm font-medium border border-transparent focus:border-emerald-400"
          />
          <input
            type="text"
            placeholder="City or Area location"
            value={aiPreferences.location}
            onChange={(e) =>
              setAiPreferences({ ...aiPreferences, location: e.target.value })
            }
            className="bg-white text-gray-800 px-4 py-3 rounded-xl outline-none placeholder:text-gray-400 text-sm font-medium border border-transparent focus:border-emerald-400"
          />
          <input
            type="number"
            placeholder="Party size constraints"
            value={aiPreferences.partySize}
            onChange={(e) =>
              setAiPreferences({ ...aiPreferences, partySize: e.target.value })
            }
            className="bg-white text-gray-800 px-4 py-3 rounded-xl outline-none placeholder:text-gray-400 text-sm font-medium border border-transparent focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={loadingAi}
            className="bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl hover:bg-emerald-400 transition shadow-lg tracking-wide text-sm cursor-pointer disabled:bg-emerald-700"
          >
            {loadingAi ? "Analyzing Context..." : "Ask Gemini Assistant"}
          </button>
        </form>

        {/* AI Results Parsing Windows Layout */}
        {(aiRecommendations.length > 0 || aiMessage) && (
          <div className="mt-6 bg-slate-900/60 rounded-2xl p-6 border border-white/5 space-y-4">
            <h3 className="font-bold text-sm tracking-widest text-emerald-400 uppercase">
               Smart Matching Models Suggestions:
            </h3>

            {aiMessage && (
              <p className="text-sm text-gray-300 italic">{aiMessage}</p>
            )}

            <div className="space-y-3">
              {aiRecommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-emerald-950/20 p-3 rounded-xl border border-emerald-500/10 flex flex-col gap-0.5"
                >
                  <span className="font-bold text-emerald-300 text-base">
                    📍 {rec.name}
                  </span>
                  <span className="text-gray-300 text-sm font-medium">
                    "{rec.reasonForRecommendation}"
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 🍽️ Marketplace Dynamic Cards Layout Grid */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Explore Certified Partner Establishments
          </h2>
          <span className="text-xs bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full uppercase border border-slate-200">
            {restaurants.length} active branches
          </span>
        </div>

        {restaurants.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200 text-gray-400 text-sm font-medium">
            No approved partner locations visible on the active grid system
            nodes currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {restaurants.map((resto) => (
              <div
                key={resto._id}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-0.5 transition duration-300 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={resto.imageUrl || "https://placeholder.com"}
                    alt={resto.name}
                    className="w-full h-52 object-cover"
                  />
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                      {resto.cuisine} Cuisine
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 pt-1 tracking-tight">
                      {resto.name}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">
                      {resto.description}
                    </p>
                    <p className="text-slate-400 text-xs font-semibold flex items-center gap-1 pt-1">
                      📍 {resto.address}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 flex justify-between items-center border-t border-slate-50">
                    <span className="text-xs text-slate-500 font-bold tracking-tight">
                      🕒 {resto.openingTime} - {resto.closingTime}
                    </span>
                    <Link
                      to={`/book/${resto._id}`}
                      className="bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-md tracking-wide cursor-pointer"
                    >
                      Book Seating Slot
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
