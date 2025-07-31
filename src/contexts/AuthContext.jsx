import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 👤 Login
  const login = async (email, password, role) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;

    if (role !== "User") {
      const { data: staffData, error: staffErr } = await supabase
        .from("staff")
        .select("id")
        .eq("email", email)
        .single();

      if (staffErr || password !== staffData?.id) {
        throw new Error("Unauthorized staff/admin.");
      }
    }
  };

  // 📝 Signup for guest
  const signup = async (email, password, fullName, roomNumber) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const userId = data.user.id;

    const { error: insertErr } = await supabase.from("users").insert({
      id: userId,
      email,
      full_name: fullName,
      room_number: roomNumber,
    });

    if (insertErr) throw insertErr;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
