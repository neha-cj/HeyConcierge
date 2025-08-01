import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.jsx";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup, signupStaff } = useAuth();
  const [activeTab, setActiveTab] = useState("guest"); // "guest" or "staff"
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    room_no: "",
    staff_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);

  async function handleResendConfirmation(email) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        throw error;
      }

      alert('Confirmation email sent! Please check your inbox.');
      setShowResendEmail(false);
    } catch (error) {
      setError('Failed to resend confirmation email: ' + error.message);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Validate required fields based on active tab
        if (activeTab === "guest") {
          if (!form.email || !form.password || !form.full_name || !form.room_no) {
            throw new Error('All fields are required for guest signup');
          }
          await signup(form.email, form.password, form.full_name, form.room_no);
        } else {
          if (!form.email || !form.password || !form.full_name || !form.staff_id) {
            throw new Error('All fields are required for staff signup');
          }
          await signupStaff(form.email, form.password, form.full_name, form.staff_id);
        }
        
        alert("Signup successful! Please check your email and click the confirmation link before logging in.");
        setIsSignup(false);
        return;
      }

      // Login logic
      try {
        if (activeTab === "guest") {
          await login(form.email, form.password, "user");
          navigate("/user-dashboard");
        } else {
          await login(form.email, form.password, "staff");
          navigate("/staff-dashboard");
        }
      } catch (loginError) {
        // Handle specific login errors
        if (loginError.message.includes('Email not confirmed')) {
          setShowResendEmail(true);
          throw new Error('Please check your email and click the confirmation link before logging in. You can also resend the confirmation email below.');
        }
        throw loginError;
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo-brand">NestInn</div>
        
        {/* Tab Navigation */}
        <div className="tab-container">
          <button
            type="button"
            className={`tab ${activeTab === "guest" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("guest");
              setError("");
              setShowResendEmail(false);
              setForm({
                email: "",
                password: "",
                full_name: "",
                room_no: "",
                staff_id: "",
              });
            }}
          >
            <span className="tab-icon">👤</span>
            <span>Guest</span>
          </button>
          <button
            type="button"
            className={`tab ${activeTab === "staff" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("staff");
              setError("");
              setShowResendEmail(false);
              setForm({
                email: "",
                password: "",
                full_name: "",
                room_no: "",
                staff_id: "",
              });
            }}
          >
            <span className="tab-icon">👨‍💼</span>
            <span>Staff</span>
          </button>
        </div>

        <div className="subtitle">
          {activeTab === "guest" ? "Guest Services" : "Staff Services"}
        </div>
        
        {!isSignup && (
          <div className="welcome-text">
            Welcome back! Please sign in to continue
          </div>
        )}

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={form.email}
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={form.password}
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        {/* Extra fields for Signup */}
        {isSignup && (
          <>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.full_name}
                required
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            
            {activeTab === "guest" ? (
              <div className="form-group">
                <label>Room Number</label>
                <input
                  type="text"
                  placeholder="Enter your room number"
                  value={form.room_no}
                  required
                  onChange={(e) => setForm({ ...form, room_no: e.target.value })}
                />
              </div>
            ) : (
              <div className="form-group">
                <label>Staff ID</label>
                <input
                  type="text"
                  placeholder="Enter your staff ID"
                  value={form.staff_id}
                  required
                  onChange={(e) => setForm({ ...form, staff_id: e.target.value })}
                />
              </div>
            )}
          </>
        )}

        {error && <div className="error-msg">{error}</div>}

        {showResendEmail && (
          <div className="resend-email">
            <p>Didn't receive the confirmation email?</p>
            <button
              type="button"
              onClick={() => handleResendConfirmation(form.email)}
              className="resend-btn"
            >
              Resend Confirmation Email
            </button>
          </div>
        )}

        <button type="submit" disabled={loading} className="submit-btn">
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : `Access ${activeTab === "guest" ? "Guest" : "Staff"} Services`}
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setShowResendEmail(false);
            setForm({
              email: "",
              password: "",
              full_name: "",
              room_no: "",
              staff_id: "",
            });
          }}
        >
          {isSignup 
            ? `Already have an account? Login as ${activeTab === "guest" ? "Guest" : "Staff"}`
            : `New ${activeTab === "guest" ? "Guest" : "Staff"}? Sign Up`}
        </button>
      </form>
    </div>
  );
}