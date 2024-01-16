import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Registration = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [registrationError, setRegistrationError] = useState("");

    const handleRegistration = async () => {
        try {
            const response = await axios.post("http://localhost:8000/account/register", {
                username,
                password,
                confirmPassword
            });

            if (response.data.success) {
                console.log("Registration successful");
                navigate("/home"); // Redirect to login page
            } else {
                setRegistrationError(response.data.error);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            setRegistrationError("Your password isn't strong enough, please make sure it has at least 8 characters and includes at least one capital letter, one number, and one symbol.");
        }
    };

    return (
        <>
            <h2>Registration</h2>
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
            <label>
                Confirm Password:
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
            </label>
            <br />
            <button type="button" onClick={handleRegistration}>
                Register
            </button>
            {registrationError && <p>{registrationError}</p>}
        </>
    );
};
