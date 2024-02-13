import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";
const TOKEN_KEY = "JWT_AUTH_TOKEN";
const INVALID_TOKEN = "INVALID_TOKEN";

export const ProtectedRoute = ({ children }) => {
  const { value } = useAuth();
  const token = localStorage.getItem(TOKEN_KEY);

  if (!value.token && token === INVALID_TOKEN) {
    return <Navigate to="/home" replace />;
  }
  return children;
};