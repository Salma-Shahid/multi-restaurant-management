import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [allStores, setAllStores] = useState([]);
  const [loading, setLoading] = useState(true);

  //  registered restaurants fetch 
  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants/admin/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((d) => {
        if (d.success) setAllStores(d.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token]);

  // Restaurant  approve  handler
  const handleAction = async (id, targetStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/restaurants/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: targetStatus }),
        },
      );
      const d = await res.json();
      if (d.success) {
        // State update to reflect the new status without refetching
        setAllStores(
          allStores.map((s) =>
            s._id === id ? { ...s, status: targetStatus } : s,
          ),
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-600 font-medium">
        Loading Verification Console...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-gray-100 mt-6">
      <div className="border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
           Super Admin Console
        </h2>
        <p className="text-gray-500 text-sm">
          Review incoming restaurant registration requests, verify details, and
          manage platform approvals.
        </p>
      </div>

      {allStores.length === 0 ? (
        <p className="text-gray-400 text-center py-10 text-sm">
          No pending restaurant registrations at the moment. All systems are
          up to date.
        </p>
      ) : (
        <div className="divide-y divide-gray-100">
          {allStores.map((s) => (
            <div
              key={s._id}
              className="py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-gray-900 text-xl">{s.name}</h3>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      s.status === "approved"
                        ? "bg-green-50 text-green-600 border border-green-100"
                        : s.status === "rejected"
                          ? "bg-red-50 text-red-600 border border-red-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-orange-600">
                    {s.cuisine}
                  </span>{" "}
                  Specialty | 📍 {s.address}
                </p>
                <p className="text-xs text-gray-400 font-medium">
                  Owner Profile: {s.ownerId?.name || "Unknown"} (
                  {s.ownerId?.email || "N/A"})
                </p>
              </div>

              {/* Action Buttons */}
              {s.status === "pending" ? (
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => handleAction(s._id, "approved")}
                    className="flex-1 md:flex-none bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-green-100 cursor-pointer"
                  >
                    Approve Branch
                  </button>
                  <button
                    onClick={() => handleAction(s._id, "rejected")}
                    className="flex-1 md:flex-none bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm shadow-red-100 cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-400 italic font-medium">
                  Decision finalized
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
