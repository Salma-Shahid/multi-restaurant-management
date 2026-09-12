import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomerDashboard from "./components/CustomerDashboard";
import OwnerDashboard from "./components/OwnerDashboard";
import AdminDashboard from "./components/AdminDashboard";
import BookingForm from "./components/BookingForm";
import { AuthContext } from "./context.jsx";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer"; //  global Footer component

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoading(false);
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: "", text: "" });

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "New password must be at least 6 characters long.",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: "New password and confirm password do not match.",
      });
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({
          type: "success",
          text: "Password changed successfully.",
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          setShowPasswordModal(false);
          setPasswordMessage({ type: "", text: "" });
        }, 1400);
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Password change failed.",
        });
      }
    } catch (error) {
      setPasswordMessage({
        type: "error",
        text: "Unable to connect to the server for password update.",
      });
    }
  };

  const renderLandingPage = () => (
    <div className="space-y-20 py-8 animate-fade-in">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-10 md:p-16 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border border-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.08),transparent_50%)]"></div>

        <div className="max-w-xl space-y-6 text-left relative z-10">
          <span className="inline-flex bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-emerald-500/20">
            ✨ Next-Gen Dining Orchestration
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Secure Your Premium Table Reservations with{" "}
            <span className="text-emerald-400">Gemini AI</span>
          </h1>
          <p className="text-slate-300 text-base leading-relaxed font-medium">
            Discover verified Michelin-grade culinary partners globally.
            Experience precision interval scheduling backed by automated
            double-booking prevention schemas.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              to="/signup"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg shadow-emerald-950/20 transition tracking-wide text-sm cursor-pointer"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="bg-white/5 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-xl border border-white/10 transition text-sm cursor-pointer"
            >
              Sign In Portal
            </Link>
          </div>
        </div>

        <div
          className="w-full md:w-80 h-80 rounded-2xl bg-cover bg-center shadow-2xl border-4 border-white/5 transform rotate-1 hover:rotate-0 transition duration-500 relative z-10 shrink-0"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80')",
          }}
        ></div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
          <div className="text-3xl font-black text-emerald-600">350+</div>
          <div className="text-sm font-bold text-slate-800 tracking-tight">
            Certified Partner Hubs
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Approved branch ecosystems live monitored
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
          <div className="text-3xl font-black text-emerald-600">12k+</div>
          <div className="text-sm font-bold text-slate-800 tracking-tight">
            Active Monthly Diners
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Verified reservation capacity maps allocation
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-1">
          <div className="text-3xl font-black text-emerald-600">0.00%</div>
          <div className="text-sm font-bold text-slate-800 tracking-tight">
            Schedule Overlap Failures
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Guaranteed by algorithmic isolation intervals
          </p>
        </div>
      </section>

      <section className="space-y-10">
        <div className="text-center max-w-lg mx-auto space-y-2">
          <h2 className="text-3xl font-black tracking-tight text-slate-800">
            Engineered Platform Workflows
          </h2>
          <p className="text-sm text-slate-400 font-medium">
            Three precise steps to coordinate secure restaurant reservations
            transparently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3 text-left p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 text-base">
              1
            </div>
            <h4 className="font-bold text-slate-800 text-lg tracking-tight">
              Establish Account Identity
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Register as either a Customer or a Restaurant Owner to access
              specific control dashboards securely.
            </p>
          </div>
          <div className="space-y-3 text-left p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 text-base">
              2
            </div>
            <h4 className="font-bold text-slate-800 text-lg tracking-tight">
              Query Gemini Assistant
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Input spatial parameters or cuisine cravings. Our large language
              model ranks optimal matches instantly.
            </p>
          </div>
          <div className="space-y-3 text-left p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black flex items-center justify-center border border-emerald-100 text-base">
              3
            </div>
            <h4 className="font-bold text-slate-800 text-lg tracking-tight">
              Lock Conflict-Free Slots
            </h4>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              Select available seating tables. Node endpoints lock timestamps to
              guarantee absolute slot isolation logs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

  if (loading) {
    return (
      <div className="text-center mt-20 text-slate-500 font-medium tracking-wide">
        Restoring authenticated secure session pipeline...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans antialiased">
          <nav className="bg-white shadow-sm border-b border-slate-100 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-b-2xl">
            <Link
              to="/"
              className="text-2xl font-black text-emerald-700 tracking-tight flex items-center gap-2"
            >
              MultiResto
            </Link>
            <div className="flex gap-4 items-center">
              {user ? (
                <>
                  {/*  greeting tracking block */}
                  <span className="text-slate-700 font-semibold text-sm tracking-tight bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/60">
                    Hello, {user.name}
                  </span>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Change Password
                  </button>
                  <button
                    onClick={logout}
                    className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer shadow-sm shadow-rose-100"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-slate-600 hover:text-emerald-700 text-sm font-bold transition tracking-tight"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-md shadow-emerald-100 tracking-tight"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>

          {showPasswordModal && (
            <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-black text-slate-900">
                    Change Password
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordMessage({ type: "", text: "" });
                    }}
                    className="text-slate-400 hover:text-slate-700 text-xl font-bold"
                  >
                    ×
                  </button>
                </div>

                {passwordMessage.text && (
                  <div
                    className={`mb-4 rounded-xl border px-3 py-2 text-xs font-semibold ${
                      passwordMessage.type === "success"
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-red-50 border-red-200 text-red-600"
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-100 transition cursor-pointer"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
          )}

          <main className="max-w-7xl mx-auto p-6">
            <Routes>
              <Route
                path="/"
                element={
                  user ? (
                    user.role === "Admin" ? (
                      <AdminDashboard />
                    ) : user.role === "Owner" ? (
                      <OwnerDashboard />
                    ) : (
                      <CustomerDashboard />
                    )
                  ) : (
                    renderLandingPage()
                  )
                }
              />
              <Route
                path="/login"
                element={!user ? <Login /> : <Navigate to="/" replace />}
              />
              <Route
                path="/signup"
                element={!user ? <Signup /> : <Navigate to="/" replace />}
              />
              <Route path="/book/:id" element={<BookingForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthContext.Provider>
  );
}
