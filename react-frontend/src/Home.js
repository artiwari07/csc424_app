import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { fakeAuth } from "./utils/FakeAuth";
import { useAuth } from "./context/AuthProvider";
import axios from "axios";

export const Home = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const { value } = useAuth();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/account/login", { userid: username, password });
    
            if (response.data.success) {
                const token = await fakeAuth();
                value.onLogin(token);
                console.log("Login successful");
                navigate("/landing");
                console.log("After navigation");
            } else {
                setLoginError("Invalid username or password. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setLoginError("An error occurred during login. Please try again.");
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
