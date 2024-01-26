import { createContext, useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fakeAuth } from "../utils/FakeAuth";
import axios, { HttpStatusCode } from "axios";
// import https from "https";
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  // const agent = new https.Agent({
  //   rejectUnauthorized:false,

  // })
  const handleLogin = async () => {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
        const response = await axios.get("https://localhost:8000/account/login", { userid: value.username, password:value.password});
        console.log("Response", response)

        if (response.data.success) {
            const token = response.data.token
            setToken(token)
            console.log("Login successful");
            navigate("/landing");
            console.log("After navigation");
        } else {
            alert("Invalid username or password. Please try again.");
        }
    } catch (error) {
        console.error("Error during login:", error);
        alert("An error occurred during login. Please try again.");
    }
};

  const handleLogout = () => {
    setToken(null);
  };

  const value = {
    token,
    username: "",
    password: "",
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