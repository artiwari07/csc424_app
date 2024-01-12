import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthProvider";

export const Home = () => {
  const { value } = useAuth();
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = () => {
    if (username === "bj" && password === "pass424") {
      value.onLogin();
      navigate("/landing"); // Use navigate for redirection
    } else {
      setLoginError("Invalid username or password. Please try again.");
    }
  };

  return (
    <>
      <h2>Home (Public)</h2>
      <label>
        User:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <br />
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <br />
      <button type="button" onClick={handleLogin}>
        Sign In
      </button>
      {loginError && <p>{loginError}</p>}
    </>
  );
};
