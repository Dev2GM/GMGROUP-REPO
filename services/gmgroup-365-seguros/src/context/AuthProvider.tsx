import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import API from "@/api/api";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    await API.post("/api/auth/logout", {
      token
    })
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
