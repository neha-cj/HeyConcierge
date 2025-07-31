import { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "user", // Default to user
    full_name: "",
    room_no: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [showResendEmail, setShowResendEmail] = useState(false);

  async function handleSignup(email, password, full_name, room_no) {
    try {
      // Check if Supabase client is properly configured
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // 1. Create auth user with email confirmation
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
            room_no
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (authError) {
        throw authError;
      }

      if (!authData.user) {
        throw new Error('No user data returned from auth signup');
      }

      // 2. Add to users table
      const { data: insertData, error: dbError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          email: email,
          full_name: full_name,
          room_no: room_no,
        }])
        .select();

      if (dbError) {
        // If database insert fails, we should clean up the auth user
        try {
          await supabase.auth.admin.deleteUser(authData.user.id);
        } catch (cleanupError) {
          // Silently handle cleanup error
        }
        throw dbError;
      }

      return authData;
    } catch (error) {
      throw error;
    }
  }

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

  async function handleLogin(email, password, role) {
    try {
      // 1. Authenticate
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Provide more specific error messages
        if (authError.message.includes('Email not confirmed')) {
          setShowResendEmail(true);
          throw new Error('Please check your email and click the confirmation link before logging in. You can also resend the confirmation email below.');
        }
        throw authError;
      }

      // Check if email is confirmed
      if (authData.user && !authData.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Please check your email and click the confirmation link before logging in.');
      }

      // 2. Verify user exists in correct table
      let tableName = "users";
      if (role === "staff") tableName = "staff";

      const { data, error: dbError } = await supabase
        .from(tableName)
        .select("*")
        .eq("email", email)
        .single();

      if (dbError || !data) {
        await supabase.auth.signOut();
        throw new Error("Account not found in database");
      }

      return { user: authData.user, role };
    } catch (error) {
      throw error;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        // Only users (guests) can sign up
        
        // Validate required fields
        if (!form.email || !form.password || !form.full_name || !form.room_no) {
          throw new Error('All fields are required for signup');
        }

        // Use AuthContext signup function
        await signup(form.email, form.password, form.full_name, form.room_no);
        
        alert("Signup successful! Please check your email and click the confirmation link before logging in.");
        setIsSignup(false);
        return;
      }

      // Login logic
      try {
        // Use AuthContext login function
        await login(form.email, form.password, form.role);
        
        // Determine role and redirect
        if (form.role === "staff") {
          navigate("/staff-dashboard");
        } else {
          navigate("/user-dashboard");
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
        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={form.full_name}
              required
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Room Number"
              value={form.room_no}
              required
              onChange={(e) => setForm({ ...form, room_no: e.target.value })}
            />
          </>
        )}

        {/* Role selector only shown during login */}
        {!isSignup && (
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="user">Guest</option>
            <option value="staff">Staff</option>
          </select>
        )}

        {error && <div className="error-msg">{error}</div>}

        {showResendEmail && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#fff3cd', 
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            <p style={{ margin: '0 0 10px 0' }}>Didn't receive the confirmation email?</p>
            <button
              type="button"
              onClick={() => handleResendConfirmation(form.email)}
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Resend Confirmation Email
            </button>
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        <button
          type="button"
          className="toggle-btn"
          onClick={() => {
            setIsSignup(!isSignup);
            setError("");
            setShowResendEmail(false);
            setForm({
              ...form,
              role: "user",
              full_name: "",
              room_no: ""
            });
          }}
        >
          {isSignup ? "Already have an account? Login" : "New Guest? Sign Up"}
        </button>
      </form>
    </div>
  );
}