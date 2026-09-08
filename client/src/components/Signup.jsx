import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../App";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "Customer",
  });
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data.message || "Signup fail ho gaya.");
      }
    } catch (err) {
      setError("Server ka error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
        Naya Account 🚀
      </h2>
      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Pura Naam
          </label>
          <input
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Ali Khan"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="ali@mail.com"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Phone Number
          </label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="03001234567"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Aapka Role Kya Hai?
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none bg-white focus:ring-2 focus:ring-orange-500"
          >
            <option value="Customer">Customer (Table Book Karni Hai)</option>
            <option value="Owner">
              Restaurant Owner (Hotel Manage Karna Hai)
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl mt-2 shadow-md transition"
        >
          Create Account
        </button>
      </form>
      <p className="text-center text-gray-500 mt-4 text-sm">
        Pehle se account hai?{" "}
        <Link to="/login" className="text-orange-500 font-bold hover:underline">
          Log in karein
        </Link>
      </p>
    </div>
  );
}
