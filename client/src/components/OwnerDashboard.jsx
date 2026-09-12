import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context.jsx";

const initialRestaurantForm = {
  name: "",
  description: "",
  cuisine: "",
  address: "",
  phone: "",
  openingTime: "09:00 AM",
  closingTime: "11:00 PM",
};

export default function OwnerDashboard() {
  const { token } = useContext(AuthContext);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [tables, setTables] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [isEditingRestaurant, setIsEditingRestaurant] = useState(false);

  const [restoData, setRestoData] = useState(initialRestaurantForm);
  const [imageFile, setImageFile] = useState(null);
  const [tableData, setTableData] = useState({ tableNumber: "", capacity: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetchOwnerRestaurant();
    }
  }, [token]);

  const fetchOwnerRestaurant = async () => {
    try {
      let response = await fetch("http://localhost:5000/api/restaurants/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      let data = await response.json();

      if (!data.success || !data.data) {
        const fallback = await fetch("http://localhost:5000/api/restaurants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fallbackData = await fallback.json();

        if (fallbackData.success && fallbackData.data.length > 0) {
          const matchingRestaurant = fallbackData.data.find(
            (restaurant) =>
              restaurant.ownerId?.toString() ===
              JSON.parse(localStorage.getItem("user") || "{}")?.id?.toString(),
          );

          if (matchingRestaurant) {
            data = { success: true, data: matchingRestaurant };
          }
        }
      }

      if (data.success && data.data) {
        setMyRestaurant(data.data);
        setRestoData({
          name: data.data.name || "",
          description: data.data.description || "",
          cuisine: data.data.cuisine || "",
          address: data.data.address || "",
          phone: data.data.phone || "",
          openingTime: data.data.openingTime || "09:00 AM",
          closingTime: data.data.closingTime || "11:00 PM",
        });
        await fetchTablesAndBookings(data.data._id);
      } else {
        setMyRestaurant(null);
        setTables([]);
        setBookings([]);
        setRestoData(initialRestaurantForm);
      }
    } catch (err) {
      console.error("Error fetching owner restaurant:", err);
      setMyRestaurant(null);
    }
  };

  const fetchTablesAndBookings = async (restaurantId) => {
    try {
      const resTables = await fetch(
        `http://localhost:5000/api/restaurants/${restaurantId}/tables`,
      );
      const dTables = await resTables.json();
      if (dTables.success) setTables(dTables.data);

      const resBookings = await fetch(
        `http://localhost:5000/api/bookings/restaurant/${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const dBookings = await resBookings.json();
      if (dBookings.success) setBookings(dBookings.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterRestaurant = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.keys(restoData).forEach((key) =>
      formData.append(key, restoData[key]),
    );
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch("http://localhost:5000/api/restaurants", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMyRestaurant(data.data);
        setRestoData({
          name: data.data.name || "",
          description: data.data.description || "",
          cuisine: data.data.cuisine || "",
          address: data.data.address || "",
          phone: data.data.phone || "",
          openingTime: data.data.openingTime || "09:00 AM",
          closingTime: data.data.closingTime || "11:00 PM",
        });
        setImageFile(null);
        await fetchTablesAndBookings(data.data._id);
      } else {
        alert(data.message || "Restaurant registration failed.");
      }
    } catch (error) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startEditRestaurant = () => {
    if (!myRestaurant) return;
    setIsEditingRestaurant(true);
    setRestoData({
      name: myRestaurant.name || "",
      description: myRestaurant.description || "",
      cuisine: myRestaurant.cuisine || "",
      address: myRestaurant.address || "",
      phone: myRestaurant.phone || "",
      openingTime: myRestaurant.openingTime || "09:00 AM",
      closingTime: myRestaurant.closingTime || "11:00 PM",
    });
    setImageFile(null);
  };

  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();
    if (!myRestaurant) return;

    setLoading(true);

    const updatePayload = {};
    Object.keys(restoData).forEach((key) => {
      if (myRestaurant[key] !== restoData[key]) {
        updatePayload[key] = restoData[key];
      }
    });

    const formData = new FormData();
    Object.keys(updatePayload).forEach((key) =>
      formData.append(key, updatePayload[key]),
    );
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${myRestaurant._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );
      const data = await res.json();

      if (data.success) {
        setMyRestaurant(data.data);
        setRestoData({
          name: data.data.name || "",
          description: data.data.description || "",
          cuisine: data.data.cuisine || "",
          address: data.data.address || "",
          phone: data.data.phone || "",
          openingTime: data.data.openingTime || "09:00 AM",
          closingTime: data.data.closingTime || "11:00 PM",
        });
        setIsEditingRestaurant(false);
        setImageFile(null);
        alert("Restaurant details updated successfully.");
      } else {
        alert(data.message || "Restaurant update failed.");
      }
    } catch (error) {
      alert("Failed to update restaurant details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!myRestaurant) return;

    const confirmed = window.confirm(
      "Delete this restaurant and all related tables? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${myRestaurant._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();

      if (data.success) {
        setMyRestaurant(null);
        setTables([]);
        setBookings([]);
        setRestoData(initialRestaurantForm);
        setIsEditingRestaurant(false);
        setImageFile(null);
        alert("Restaurant deleted successfully.");
      } else {
        alert(data.message || "Restaurant deletion failed.");
      }
    } catch (error) {
      alert("Failed to delete restaurant.");
    }
  };

  const handleAddTable = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${myRestaurant._id}/tables`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(tableData),
        },
      );
      const data = await res.json();

      if (data.success) {
        setTables((prev) => [...prev, data.data]);
        setTableData({ tableNumber: "", capacity: "" });
      } else {
        alert(data.message || "Table could not be added.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to add table.");
    }
  };

  const handleUpdateStatus = async (bookingId, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: currentStatus }),
        },
      );
      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Unable to update booking status.");
        return;
      }

      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: currentStatus } : b,
        ),
      );
      if (myRestaurant?._id) {
        await fetchTablesAndBookings(myRestaurant._id);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong while updating the booking.");
    }
  };

  if (!myRestaurant) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mt-10">
        <div className="mb-6">
          <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
            Owner Portal
          </span>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-800 mb-2">
            Setup Restaurant Profile
          </h2>
        </div>
        <p className="text-slate-500 mb-6 text-sm">
          Register your branch details and upload a cover photo to receive table
          reservations.
        </p>

        <form onSubmit={handleRegisterRestaurant} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setRestoData({ ...restoData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="The Spice Hub"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Cuisine Specialty
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setRestoData({ ...restoData, cuisine: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Desi / Continental"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              onChange={(e) =>
                setRestoData({ ...restoData, description: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none h-20 focus:ring-2 focus:ring-emerald-500"
              placeholder="Describe ambiance..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Physical Address
            </label>
            <input
              type="text"
              required
              onChange={(e) =>
                setRestoData({ ...restoData, address: e.target.value })
              }
              className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Main Boulevard, Phase 2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Contact Phone
              </label>
              <input
                type="text"
                required
                onChange={(e) =>
                  setRestoData({ ...restoData, phone: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="0321XXXXXXX"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Open
              </label>
              <input
                type="text"
                value={restoData.openingTime}
                onChange={(e) =>
                  setRestoData({ ...restoData, openingTime: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Close
              </label>
              <input
                type="text"
                value={restoData.closingTime}
                onChange={(e) =>
                  setRestoData({ ...restoData, closingTime: e.target.value })
                }
                className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Cover Image
            </label>
            <input
              type="file"
              required
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition mt-4 shadow-lg cursor-pointer"
          >
            {loading
              ? "Uploading to Cloudinary..."
              : "Launch Restaurant Profile"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
      <div className="space-y-6 lg:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <img
            src={myRestaurant.imageUrl}
            alt="preview"
            className="w-full h-40 object-cover rounded-xl"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {myRestaurant.name}
            </h2>
            <p className="text-sm font-semibold text-emerald-700">
              {myRestaurant.cuisine} Specialty
            </p>
            <p className="text-xs text-gray-400 mt-1">
              📍 {myRestaurant.address}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              📞 {myRestaurant.phone}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              🕒 {myRestaurant.openingTime} - {myRestaurant.closingTime}
            </p>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              onClick={startEditRestaurant}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Edit Details
            </button>
            <button
              onClick={handleDeleteRestaurant}
              className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {isEditingRestaurant && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-4 text-slate-800">
              Edit Restaurant
            </h3>

            <div className="mb-4 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-2">
              <img
                src={myRestaurant.imageUrl}
                alt="Current restaurant cover"
                className="h-32 w-full rounded-lg object-cover"
              />
            </div>

            <form onSubmit={handleUpdateRestaurant} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={restoData.name}
                  onChange={(e) =>
                    setRestoData({ ...restoData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Restaurant name"
                />
                <input
                  type="text"
                  value={restoData.cuisine}
                  onChange={(e) =>
                    setRestoData({ ...restoData, cuisine: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Cuisine"
                />
              </div>

              <textarea
                value={restoData.description}
                onChange={(e) =>
                  setRestoData({ ...restoData, description: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none h-20 focus:ring-2 focus:ring-emerald-500"
                placeholder="Description"
              />

              <input
                type="text"
                value={restoData.address}
                onChange={(e) =>
                  setRestoData({ ...restoData, address: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Address"
              />

              <input
                type="text"
                value={restoData.phone}
                onChange={(e) =>
                  setRestoData({ ...restoData, phone: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Phone"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={restoData.openingTime}
                  onChange={(e) =>
                    setRestoData({ ...restoData, openingTime: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Opening time"
                />
                <input
                  type="text"
                  value={restoData.closingTime}
                  onChange={(e) =>
                    setRestoData({ ...restoData, closingTime: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Closing time"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Update cover image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingRestaurant(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-lg mb-4 text-slate-800">
            ⚙️ Configure Seating Tables
          </h3>
          <form
            onSubmit={handleAddTable}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            <input
              type="text"
              placeholder="Table #"
              required
              value={tableData.tableNumber}
              onChange={(e) =>
                setTableData({ ...tableData, tableNumber: e.target.value })
              }
              className="border border-slate-200 px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              placeholder="Seats"
              required
              value={tableData.capacity}
              onChange={(e) =>
                setTableData({ ...tableData, capacity: e.target.value })
              }
              className="border border-slate-200 px-3 py-2 rounded-xl outline-none text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="col-span-2 bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition cursor-pointer"
            >
              Add Table
            </button>
          </form>

          <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto pr-1">
            {tables.map((t) => (
              <div
                key={t._id}
                className="py-2 flex justify-between items-center text-sm"
              >
                <span className="font-medium text-gray-700">
                  Table {t.tableNumber}
                </span>
                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-500">
                  {t.availableSeats ?? t.capacity}/{t.capacity} Seats
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:col-span-2">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-xl text-slate-800 mb-4">
            📋 Booking Requests
          </h3>

          {bookings.length === 0 ? (
            <p className="text-sm text-gray-500">
              No table booking requests received yet.
            </p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                    <div>
                      <p className="font-bold text-gray-800">
                        {b.customerId?.name || "Customer"}
                      </p>
                      <p className="text-xs text-gray-500">
                        📱 {b.customerId?.phone || "N/A"} | 👥 Party Size:{" "}
                        {b.partySize} guests
                      </p>
                      <p className="text-xs text-gray-500">
                        📍 Allocated: Table {b.tableId?.tableNumber || "N/A"} |
                        🕒 {new Date(b.bookingDate).toLocaleDateString()} (
                        {b.startTime} - {b.endTime})
                      </p>
                      {b.notes && (
                        <p className="text-xs text-gray-500 mt-2">
                          Note: {b.notes}
                        </p>
                      )}
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                        b.status === "confirmed"
                          ? "bg-green-50 text-green-600"
                          : b.status === "cancelled"
                            ? "bg-red-50 text-red-600"
                            : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {b.status === "pending" && (
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleUpdateStatus(b._id, "confirmed")}
                        className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b._id, "cancelled")}
                        className="flex-1 md:flex-none bg-red-100 hover:bg-red-200 text-red-600 text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
