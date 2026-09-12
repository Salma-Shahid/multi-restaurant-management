import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate("/");
      } else {
        setError(data.message || "Invalid authentication credentials.");
      }
    } catch (err) {
      setError("Unable to establish remote connection with server endpoints.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-3xl shadow-xl border border-slate-100 text-left">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 uppercase tracking-widest mb-4 transition"
      >
        ← Back to Home
      </Link>
      <h2 className="text-3xl font-black text-slate-900 text-center mb-2 tracking-tight">
        Welcome Back
      </h2>
      <p className="text-slate-400 text-xs text-center mb-6 font-medium">
        Please sign in with your credentials to manage allocations.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-4 text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="example@mail.com"
          />
        </div>
        <div>
          <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-100 transition tracking-wide text-sm cursor-pointer"
        >
          Sign In
        </button>
      </form>
      <p className="text-center text-slate-400 mt-6 text-xs font-medium">
        New to the platform?{" "}
        <Link
          to="/signup"
          className="text-emerald-600 font-bold hover:underline ml-1"
        >
          Sign Up here
        </Link>
      </p>
    </div>
  );
}
