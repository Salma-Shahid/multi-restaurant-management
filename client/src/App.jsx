import React, { createContext, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

// Auth State global access karne ke liye Context banayein
export const AuthContext = createContext();

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gray-50 font-sans">
          {/* Main Navigation Bar */}
          <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link
              to="/"
              className="text-2xl font-bold text-orange-600 tracking-wide"
            >
              🍽️ MultiResto
            </Link>
            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">
                    Salam, {user.name} ({user.role})
                  </span>
                  <button
                    onClick={logout}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-orange-600 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Page Contents */}
          <main className="container mx-auto p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <div className="text-center mt-12">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                      Welcome to Multi-Restaurant Table Booking Platform
                    </h1>
                    <p className="text-gray-600 mt-2">
                      Please login to browse restaurants or manage reservations.
                    </p>
                  </div>
                }
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" />}
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
