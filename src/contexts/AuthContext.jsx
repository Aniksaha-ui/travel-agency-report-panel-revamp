import { createContext, useContext } from "react";
import useAuth from "../features/auth/hooks/useAuth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const authTools = useAuth();

  return <AuthContext.Provider value={authTools}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider.");
  }

  return context;
}
