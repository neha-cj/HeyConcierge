import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  async function login(email, password, role) {
    await new Promise((r) => setTimeout(r, 500));
    setUser({
      email,
      role,
      name: role === "User" ? "John Doe" : role === "Staff" ? "Jane Smith" : "Manager Lee",
      room: role === "User" ? "210" : undefined,
    });
  }
  function logout() {
    setUser(null);
  }
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);