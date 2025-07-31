import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        determineUserRole(session.user.email);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        determineUserRole(session.user.email);
      } else {
        setUserRole(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const determineUserRole = async (email) => {
    try {
      // Check if user is staff first
      const { data: staffData } = await supabase
        .from("staff")
        .select("id")
        .eq("email", email)
        .single();

      if (staffData) {
        setUserRole("Staff");
        return;
      }

      // Check if user is in users table
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userData) {
        setUserRole("User");
        return;
      }

      setUserRole(null);
    } catch (error) {
      setUserRole(null);
    }
  };

  // 👤 Login
  const login = async (email, password, role) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    // Check if email is confirmed
    if (data.user && !data.user.email_confirmed_at) {
      await supabase.auth.signOut();
      throw new Error("Email not confirmed");
    }

    // Verify user exists in correct table
    if (role === "staff") {
      const { data: staffData, error: staffErr } = await supabase
        .from("staff")
        .select("*")
        .eq("email", email)
        .single();

      if (staffErr || !staffData) {
        await supabase.auth.signOut();
        throw new Error("Staff account not found");
      }
    } else {
      const { data: userData, error: userErr } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

      if (userErr || !userData) {
        await supabase.auth.signOut();
        throw new Error("User account not found");
      }
    }

    return { user: data.user, role };
  };

  // 📝 Signup for guest
  const signup = async (email, password, fullName, roomNumber) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
          room_no: roomNumber
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    if (error) throw error;

    const userId = data.user.id;

    const { error: insertErr } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name: fullName,
      room_no: roomNumber,
    });

    if (insertErr) throw insertErr;
    
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
