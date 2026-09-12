import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context.jsx";

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
        setError(
          data.message || "Registration failed. Please check your data fields.",
        );
      }
    } catch (error) {
      setError("Internal server connection timeout error.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 uppercase tracking-widest mb-4 transition"
      >
        ← Back to Home
      </Link>
      <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
        Create Account
      </h2>
      <p className="text-slate-400 text-xs text-center mb-6 font-medium">
        Join our intelligent multi-restaurant orchestration cluster network.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            Full Name
          </label>
          <input
            type="text"
            required
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="John Doe"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="john@mail.com"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            Phone Number
          </label>
          <input
            type="text"
            required
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="+923001234567"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            Password
          </label>
          <input
            type="password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            Select Platform Role
          </label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          >
            <option value="Customer">Customer (Book Seating Tables)</option>
            <option value="Owner">
              Restaurant Owner (Manage Dashboard & Slots)
            </option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl mt-2 shadow-lg shadow-emerald-100 transition cursor-pointer text-sm tracking-wide"
        >
          Register Account
        </button>
      </form>
      <p className="text-center text-slate-400 mt-4 text-xs font-medium">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-emerald-600 font-bold hover:underline ml-1"
        >
          Log in here
        </Link>
      </p>
    </div>
  );
}
