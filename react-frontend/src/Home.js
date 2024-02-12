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
    const handleSubmit = (e) => {
        e.preventDefault();
        value.username = username;
        value.password = password;
        return value.onLogin();
    }

    return (
        <>
            <h2>Home (Public)</h2>
            <label>
                Username:
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
            <button type="submit" onClick={handleSubmit}>
                Sign In
            </button>
            {loginError && <p>{loginError}</p>}
        </>
    );
};
