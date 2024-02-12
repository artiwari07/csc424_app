import React, { createContext, useContext, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { TOKEN_KEY, INVALID_TOKEN } from './constants';

const AuthContext = createContext({});

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return { ...state, token: action.payload };
    case "SET_INVALID_TOKEN":
      return { ...state, token: INVALID_TOKEN };
    case "SET_GOOGLE_TOKEN":
      return { ...state, googleToken: action.payload };
    case "LOGOUT":
      return { ...state, token: null, googleToken: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  
  const [state, dispatch] = useReducer(authReducer, {
    token: cookies.token || null,
    googleToken: null,
  });

  const handleLogin = async () => {
    try {
      const response = await axios.post("https://localhost:8000/account/login", {
        userid: value.username,
        password: value.password,
      });

      if (response.data.success) {
        const token = response.data.token;
        console.log("token:", response.data.token);
        setCookie("token", token, { path: "/" });
      
        // Store the regular token in local storage
      localStorage.setItem(TOKEN_KEY, token);

      // Use dispatch to set the regular token in the context
      dispatch({ type: "SET_TOKEN", payload: token });

      // If there is a Google token, set it in the context as well
      if (state.googleToken) {
        dispatch({ type: "SET_GOOGLE_TOKEN", payload: state.googleToken });
      }

      console.log("Login successful");
      navigate("/landing");
      console.log("After navigation");
    } else {
      alert("Invalid username or password. Please try again.");
    }
  }  catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem(TOKEN_KEY);
    navigate("/home");
  };

  const value = {
    token: state.token,
    username: "",
    password: "",
    onLogin: handleLogin,
    onLogout: handleLogout,
  };

  return (
    <AuthContext.Provider value={{ value, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
