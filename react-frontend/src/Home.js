import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export const Home = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const handleLogin = async () => {
        try {
            await axios.post("http://localhost:8000/account/login", { userid: username, password });
            console.log("Login successful");
            navigate("/landing");
            console.log("After navigation");
        } catch (error) {
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
