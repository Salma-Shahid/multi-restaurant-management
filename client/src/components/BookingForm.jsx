import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context";

export default function BookingForm() {
  const { id: restaurantId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [formData, setFormData] = useState({
    tableId: "",
    partySize: "",
    bookingDate: "",
    startTime: "",
    endTime: "",
    notes: "",
  });
  const [message, setMessage] = useState({ text: "", isError: false });
  const [loading, setLoading] = useState(false);

  // Fetch available tables for this restaurant
  useEffect(() => {
    fetch(`http://localhost:5000/api/restaurants/${restaurantId}/tables`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setTables(data.data);
      })
      .catch((err) => console.error(err));
  }, [restaurantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ restaurantId, ...formData }),
      });
      const data = await response.json();

      if (data.success) {
        setMessage({ text: data.message, isError: false });
        setTimeout(() => navigate("/"), 2500); // Redirect to dashboard after success
      } else {
        setMessage({
          text: data.message || "Booking conflicts detected.",
          isError: true,
        });
      }
    } catch (err) {
      setMessage({ text: "Server connection timeout error.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-8">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
        Reserve a Table 📅
      </h2>
      <p className="text-gray-500 mb-6 text-sm">
        Select your desired timeline configuration. Our overlap prevention
        engine validates real-time schedules.
      </p>

      {message.text && (
        <div
          className={`px-4 py-3 rounded-xl mb-4 text-sm text-center border ${message.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Select Seating Table slot
          </label>
          <select
            required
            value={formData.tableId}
            onChange={(e) =>
              setFormData({ ...formData, tableId: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white"
          >
            <option value="">-- Choose an Allocated Table --</option>
            {tables.map((t) => (
              <option key={t._id} value={t._id}>
                Table {t.tableNumber} (Capacity: {t.capacity} chairs)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Party Size (Guests)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.partySize}
              onChange={(e) =>
                setFormData({ ...formData, partySize: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200"
              placeholder="2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reservation Date
            </label>
            <input
              type="date"
              required
              value={formData.bookingDate}
              onChange={(e) =>
                setFormData({ ...formData, bookingDate: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Start Time (24h format)
            </label>
            <input
              type="text"
              required
              placeholder="E.g., 18:00"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({ ...formData, startTime: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              End Time (24h format)
            </label>
            <input
              type="text"
              required
              placeholder="E.g., 20:00"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({ ...formData, endTime: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Special Dietary / Seating Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            className="w-full px-4 py-2 rounded-xl border border-gray-200 h-20"
            placeholder="Window side table preferred..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow-lg transition cursor-pointer"
        >
          {loading
            ? "Validating Schedules..."
            : "Confirm Reservation Request 🚀"}
        </button>
      </form>
    </div>
  );
}
