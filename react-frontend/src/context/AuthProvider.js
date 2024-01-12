import { createContext, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const handleLogin = async () => {
    const token = await fakeAuth();
    setToken(token);
    navigate("/landing");
  };

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={{ value }}>
      {children}
    </AuthContext.Provider>
  );
};

// give callers access to the context
export const useAuth = () => useContext(AuthContext);