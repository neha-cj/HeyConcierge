import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, signup } = useAuth(); // Get both login & signup from context
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "User",
    fullName: "",
    roomNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup && form.role === "User") {
        // Only guests can sign up
        await signup(form.email, form.password, form.fullName, form.roomNumber);
        alert("Signup successful! Check your email to confirm.");
        setIsSignup(false); // return to login mode
        return;
      }

      // Login logic
      await login(form.email, form.password, form.role);
      switch (form.role) {
        case "User":
          navigate("/user-dashboard");
          break;
        case "Staff":
          navigate("/staff-dashboard");
          break;
        case "Admin":
          navigate("/admin-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError("Invalid credentials or signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-brand">NestInn</div>
        <div className="subtitle">{isSignup ? "Guest Sign Up" : "Concierge Login"}</div>

        <input
          type="email"
          placeholder="Email Address"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {/* Extra fields for Guest Signup */}
        {isSignup && form.role === "User" && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.fullName}
              required
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Room Number"
              value={form.roomNumber}
              required
              onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
            />
          </>
        )}

        {/* Role selector only shown during login */}
        {!isSignup && (
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="User">Guest</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
        )}

        {error && <div className="error-msg">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up (Guest)"
            : "Login"}
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setForm({ ...form, role: "User" }); // reset role to guest on signup
          }}
        >
          {isSignup ? "Switch to Login" : "New Guest? Sign Up"}
        </button>
      </form>
    </div>
  );
}
